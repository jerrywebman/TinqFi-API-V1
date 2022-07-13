var User = require("../models/user");
var Money = require("../models/money");
var jwt = require("jsonwebtoken");
var bcrypt = require("bcrypt");
const { createClient } = require("redis");
const createWalletActions = require("./specialMethods/createWalletActions");
const emailTemplate = require("../middleware/emailTemplate");
const generateOTP = require("../middleware/generateOTP");
var AddressStore = require("../models/address");
const axios = require("axios");

//for redis
// const client = createClient({
//   url: process.env.REDIS_URL,
//   socket: {
//     tsl: true,
//     rejectUnauthorized: false,
//   },
// });
const client = createClient();

client.on("error", (err) => console.log("Redis Client Error", err));

client.connect();

const logoUrl =
  "https://www.tinqlab.com/_next/image?url=%2Ftinqlab_logo.svg&w=32&q=75g";

var functions = {
  addressTest: function (req, res) {
    const id = "62c4370fa7136f7f55ba1cdf";
    const url = `${process.env.TATUM_BASE_URL}/ledger/account/${id}`;

    try {
      const options = {
        method: "GET",
        headers: {
          "content-type": "application/json",
          "x-api-key": process.env.TATUM_API_KEY,
        },
        url,
      };
      //try creating the token offchain address
      axios(options).then((ServerResponse) => {
        console.log(ServerResponse);
      });
    } catch (err) {
      console.error(err);
    }
  },

  // ** LOGOUT ROUTE **//
  logout: function (req, res) {
    if (req.session || req.user) {
      req.session.destroy(async (err) => {
        if (err) {
          res.status(400).send({ success: false, message: "Unable to logout" });
        } else {
          await client.del(req.user.email);
          res.status(200).json({
            success: true,
            msg: "User Successfully logged out.",
          });
        }
      });
    } else {
      res.end();
    }
  },

  //***CREATE A NEW USER ACCOUNT***//
  signup: async function (req, res) {
    const generatedOTP = generateOTP();
    const defaultEmail = req.body.email;
    const lowerCaseEmail = defaultEmail.toLowerCase();

    //check if the email exists
    let userEmail = await User.findOne({ email: lowerCaseEmail });
    if (!lowerCaseEmail) {
      res.status(400).send({ success: false, msg: "No Email Provided" });
    } else if (userEmail) {
      return res.status(400).send({
        success: false,
        msg: "a user with this email address already exists!",
      });
    } else {
      //hashing the otp
      bcrypt.genSalt(10, function (err, salt) {
        if (err) {
          return next(err);
        }
        bcrypt.hash(generatedOTP, salt, async function (err, hash) {
          if (err) {
            return next(err);
          }
          //CREATING THE NEW USER
          var newUser = User({
            fullname: "",
            nickname: "",
            phone: 00000000000,
            occupation: "",
            street: "",
            city: "",
            country: "",
            dateOfBirth: "",
            ourCustomerTatumId: lowerCaseEmail,
            onRegistrationLedgerAccnts: [],
            pin: "",
            verifyCode: hash,
            email: lowerCaseEmail,
            password: null,
          });
          newUser.save(function (err, newUser) {
            if (err) {
              res.status(500).send({
                success: false,
                msg: "Failed to create user account",
                err,
              });
            } else {
              //SEND EMAIL TO USER
              emailTemplate.signup(generatedOTP, lowerCaseEmail);
              res.json({
                success: true,
                msg: "User Account Successfully Created",
                userMsg: "Please check your email address for the next steps",
              });
            }
          });
        });
      });
    }
  },

  //***VERIFY EMAIL ADDRESS***
  verifyEmail: async function (req, res) {
    const defaultEmail = req.body.email;
    const lowerCaseEmail = defaultEmail.toLowerCase();

    let user = await User.findOne({ email: lowerCaseEmail });
    const theEmail = lowerCaseEmail;
    if (!lowerCaseEmail) {
      res
        .status(400)
        .send({ success: false, msg: "Please Enter an Email address" });
    } else if (!user) {
      return res.status(400).send({
        success: false,
        msg: "There is no user with this email address!",
      });
    } else {
      //compareCode is a method in the user model
      user.compareCode(req.body.verifyCode, function (err, isMatch) {
        if (isMatch && !err) {
          //COMPARING THE OTP
          try {
            const updatedOTP = User.updateOne(
              { email: theEmail },
              {
                $set: {
                  emailVerified: true,
                  verifyCode: null,
                },
              }
            ).then(() => {
              res.json({ success: true, msg: "OTP is correct" });
            });
          } catch (err) {
            res.send({ message: err });
          }
        } else {
          return res.status(403).send({
            success: false,
            msg: "Wrong OTP",
          });
        }
      });
    }
  },

  //3****COMPLETE THE USER REGISTRATION***/
  completeSignup: async function (req, res) {
    const userEmailAddress = req.body.email;
    const lowerCaseEmail = userEmailAddress.toLowerCase();
    let nickname = req.body.nickname;
    let password = req.body.password;
    let confirmPassword = req.body.confirmPassword;
    //CHECKING IF USER HAS AN ACCOUNT WITH US AND EMAIL VERIFIED
    User.findOne(
      {
        email: lowerCaseEmail,
        emailVerified: true,
      },
      function (err, user) {
        if (err) throw err;
        if (!lowerCaseEmail) {
          res.status(400).send({
            success: false,
            msg: "Please verify your email address to continue",
          });
        } else if (!user) {
          res.status(400).send({
            success: false,
            msg: "No user with this email address",
          });
        } else if (
          !user ||
          !req.body.password ||
          !req.body.confirmPassword ||
          !req.body.nickname
        ) {
          res.status(403).send({
            success: false,
            msg: "Please provide all required information",
          });
        } else if (password.length < 6) {
          return res.status(401).send({
            success: false,
            msg: "Password must be 6 or more character long",
          });
        } else if (password !== confirmPassword) {
          return res.status(401).send({
            success: false,
            msg: "Password did not match",
          });
        } else {
          //hashing the password
          try {
            bcrypt.genSalt(10, function (err, salt) {
              if (err) {
                return next(err);
              }
              bcrypt.hash(req.body.password, salt, async function (err, hash) {
                if (err) {
                  return next(err);
                }
                try {
                  const user = User.updateOne(
                    { email: lowerCaseEmail },
                    {
                      $set: {
                        nickname,
                        password: hash,
                        accountSetup: true,
                      },
                    }
                  ).then(async (user) => {
                    //CREATING A NEW USER MONEY DATABASE

                    const userMoney = await Money.findOne({
                      userEmail: lowerCaseEmail,
                    });
                    if (!userMoney) {
                      try {
                        const newMoney = {
                          _id: lowerCaseEmail,
                          userEmail: lowerCaseEmail,
                          nickname,
                          investmentBalance: 0,
                          loanBalance: 0,
                          savingsBalance: 0,
                          referralBonusBalance: 0,
                        };
                        new Money(newMoney).save();
                        //creating the address db
                        const newAddress = {
                          userEmail: lowerCaseEmail,
                          nickname,
                          ourCustomerTatumId: lowerCaseEmail,
                          onRegistration: [],
                          onP2P: [],
                          lastUpdated: Date.now(),
                        };
                        new AddressStore(newAddress).save();

                        //CREATE TATUM ACCOUNT_SETUP AND RECIEVE ADDRESSES HERE
                        const clientEmail = lowerCaseEmail;
                        var everythingBTC =
                          createWalletActions.createBtcWallet(clientEmail);
                        var everythingETH =
                          createWalletActions.createETHWallet(clientEmail);
                        var everythingBSC =
                          createWalletActions.createBSCWallet(clientEmail);
                        var everythingDOGE =
                          createWalletActions.createDOGEWallet(clientEmail);

                        //create all the wallet addresses
                        Promise.all([
                          everythingBTC,
                          everythingETH,
                          everythingBSC,
                          everythingDOGE,
                        ]).then(() => console.log("end test"));
                      } catch (err) {
                        console.log(err);
                      }
                    } else {
                      console.log("User already exists in money db");
                    }
                  });
                } catch (err) {
                  res.json(err);
                }
              });
            });

            //SEND EMAIL
            emailTemplate.completeRegistration(lowerCaseEmail, nickname);

            res.json({
              success: true,
              Message: "User Account successfully created, Please Login ",
            });
          } catch (err) {
            res.json({ message: err });
          }
        }
      }
    );
  },

  //**** AUTHENTICATE A USER****/
  authenticate: function (req, res) {
    const defaultEmail = req.body.email;
    const lowerCaseEmail = defaultEmail;

    User.findOne(
      {
        email: lowerCaseEmail,
      },
      function (err, user) {
        if (err) throw err;
        if (!user) {
          res.status(401).send({
            success: false,
            msg: "Authentication Failed, no user with such email address",
          });
        } else if (user.emailVerified === false) {
          res.status(403).send({
            success: false,
            msg: "Authentication Failed, Please verify your email address",
          });
        } else {
          try {
            user.comparePassword(
              req.body.password,
              async function (err, isMatch) {
                if (isMatch && !err) {
                  // let refreshTokens = [];
                  //PASS THE USER TOKEN TO CHECK
                  const payload = {
                    sub: user._id,
                    user: user,
                    iat: Date.now(),
                  };

                  var token = jwt.sign(payload, process.env.TOKEN_SECRET, {
                    expiresIn: "5d",
                  });
                  res.json({
                    success: true,
                    user: user,
                    token: "Bearer " + token,
                  });

                  // Set data to Redis
                  await client.set(user.email, token);
                  await client.expire(user.email, 18000);
                  const value = await client.get(user.email);
                } else {
                  return res.status(401).send({
                    success: false,
                    msg: "Authentication Failed, Wrong password",
                  });
                }
              }
            );
          } catch (err) {
            console.log(err);
          }
        }
      }
    );
  },

  //GET USER INFORMATION
  getInfo: function (req, res) {
    if (
      req.headers.authorization &&
      req.headers.authorization.split(" ")[0] === "Bearer"
    ) {
      var token = req.headers.authorization.split(" ")[1];
      jwt.verify(token, process.env.TOKEN_SECRET, function (err, decoded) {
        if (err) res.status(401).json({ success: false, msg: "Invalid Token" });
        else {
          res.send({ decoded });
        }
      });
    } else {
      return res
        .status(400)
        .json({ success: false, msg: "No User/Invalid Token" });
    }
  },

  //***RECOVER USER ACCOUNT USING FORGOT PASSWORD LINK***
  recoverAccount: async function (req, res) {
    const defaultEmail = req.body.email;
    const lowerCaseEmail = defaultEmail.toLowerCase();

    let userDetails = await User.findOne({ email: lowerCaseEmail });
    if (!lowerCaseEmail) {
      res
        .status(400)
        .send({ success: false, msg: "Please Enter an Email address" });
    } else if (!userDetails) {
      return res.status(400).send({
        success: false,
        msg: "There is no user with this email address, Please signup!",
      });
    } else {
      const generatedOTP = generateOTP();
      //NOW I HAVE THE OTP, SEND IT TO THE DATABASE

      try {
        //hashing the otp
        bcrypt.genSalt(10, function (err, salt) {
          if (err) {
            return next(err);
          }
          bcrypt.hash(generatedOTP, salt, async function (err, hash) {
            if (err) {
              return next(err);
            }
            const updatedProfile = await User.updateOne(
              { email: lowerCaseEmail },
              {
                $set: {
                  verifyCode: hash,
                  emailVerified: false,
                },
              }
            ).then(() => {
              //SEND EMAIL HERE
              const nickname = userDetails.nickname;
              emailTemplate.recover(lowerCaseEmail, generatedOTP, nickname);
            });
          });
        });
        res.json({
          success: true,
          Message: "OTP successfully sent to user email",
        });
      } catch (err) {
        res.json({
          success: false,
          msg: "Failed to recover user account",
          error: err,
        });
      }
    }
  },

  //***UPDATE USER PIN***
  updatePin: async function (req, res) {
    const defaultEmail = req.user.email;
    const defaultPin = req.body.pin;
    const lowerCaseEmail = defaultEmail.toLowerCase();

    let userEmail = await User.findOne({ email: lowerCaseEmail });
    const theEmail = lowerCaseEmail;
    if (!userEmail) {
      return res.status(401).send({
        success: false,
        msg: "Please login to access this route!",
      });
    } else if (Number(defaultPin.length) > 6) {
      return res.status(400).send({
        success: false,
        msg: "Pin is greater than 6 digits",
      });
    } else if (Number(defaultPin.length) < 6) {
      return res.status(400).send({
        success: false,
        msg: "Pin is less than 6 digits",
      });
    } else {
      //encrypt the pin and save
      bcrypt.genSalt(10, function (err, salt) {
        if (err) {
          return next(err);
        }
        bcrypt.hash(defaultPin, salt, async function (err, hash) {
          if (err) {
            return next(err);
          }
          try {
            const updatedPin = User.updateOne(
              { email: theEmail },
              {
                $set: {
                  pin: hash,
                },
              }
            ).then(() => {
              res.json({ success: true, msg: "Pin saved successfully" });
            });
          } catch (err) {
            res.send({ message: err });
          }
        });
      });
    }
  },

  //***UPDATE LEGAL AGGREMENT***
  updateLegal: async function (req, res) {
    const defaultEmail = req.user.email;
    const lowerCaseEmail = defaultEmail.toLowerCase();

    let userEmail = await User.findOne({ email: lowerCaseEmail });
    const theEmail = lowerCaseEmail;
    if (!userEmail) {
      return res.status(401).send({
        success: false,
        msg: "Please login to access this route!",
      });
    } else if (userEmail && req.user.emailVerified === false) {
      return res.status(400).send({
        success: false,
        msg: "Please verify your email address to access this route",
      });
    } else {
      try {
        const updateLegal = User.updateOne(
          { email: theEmail },
          {
            $set: {
              legalAgreement: true,
            },
          }
        ).then(() => {
          res.json({
            success: true,
            msg: "User agreed to our legal agreement",
          });
        });
      } catch (err) {
        res.send({ message: err });
      }
    }
  },

  //***UPDATE USER BVN***
  updateBvn: async function (req, res) {
    const defaultEmail = req.user.email;
    const bvn = req.body.bvn;
    const lowerCaseEmail = defaultEmail.toLowerCase();

    let userEmail = await User.findOne({ email: lowerCaseEmail });
    const theEmail = lowerCaseEmail;
    if (!userEmail) {
      return res.status(401).send({
        success: false,
        msg: "Please login to access this route!",
      });
    } else if (userEmail && req.user.emailVerified === false) {
      return res.status(400).send({
        success: false,
        msg: "Please verify your email address to access this route",
      });
    } else if (
      userEmail &&
      req.user.emailVerified === true &&
      Number(bvn.length) > 11
    ) {
      return res.status(400).send({
        success: false,
        msg: "BVN is greater than 11 characters",
      });
    } else if (
      userEmail &&
      req.user.emailVerified === true &&
      Number(bvn.length) < 11
    ) {
      return res.status(400).send({
        success: false,
        msg: "BVN is less than 11 characters",
      });
    } else {
      try {
        const updatebvn = User.updateOne(
          { email: theEmail },
          {
            $set: {
              bvn: bvn,
            },
          }
        ).then(() => {
          res.json({
            success: true,
            msg: "Bank Verification number successfully saved",
          });
        });
      } catch (err) {
        res.send({ message: err });
      }
    }
  },

  //*** UPDATE A USER PASSWORD WHEN NOT SIGNED IN** */
  updatePassword: async function (req, res) {
    const defaultEmail = req.body.email;
    const lowerCaseEmail = defaultEmail.toLowerCase();

    const userEmailAddress = lowerCaseEmail;
    let passConfirmString = req.body.confirmPassword;
    let passConfirmNewString = req.body.newPassword;

    User.findOne(
      {
        email: userEmailAddress,
      },
      function (err, user) {
        if (err) throw err;
        if (!user) {
          res.status(403).send({
            success: false,
            msg: "No account associated with this email",
          });
        } else if (user && req.body.confirmPassword !== req.body.newPassword) {
          res.status(400).send({
            success: false,
            msg: "Password did not match",
          });
        } else if (
          passConfirmString.length < 6 &&
          passConfirmNewString.length < 6
        ) {
          res.status(401).send({
            success: false,
            msg: "Password not secure. it must be 6 characters or more",
          });
        } else {
          //CHANGE THE PASSWORD
          try {
            bcrypt.genSalt(10, function (err, salt) {
              if (err) {
                return next(err);
              }
              bcrypt.hash(
                req.body.newPassword,
                salt,
                async function (err, hash) {
                  if (err) {
                    return next(err);
                  }
                  const updatedPassword = await User.updateOne(
                    { email: userEmailAddress },
                    {
                      $set: {
                        password: hash,
                        emailVerified: true,
                      },
                    }
                  );
                }
              );
            });
            res.json({
              success: true,
              msg: "Password Successfully updated",
            });
          } catch (err) {
            res.json({
              success: false,
              msg: "Account recovery failed",
              errormsg: err,
            });
          }
        }
      }
    );
  },

  //*** UPDATE A USER PASSWORD WHEN SIGNED IN** */
  updatePasswordAuth: async function (req, res) {
    const defaultEmail = req.user.email;
    const lowerCaseEmail = defaultEmail.toLowerCase();

    const userEmailAddress = lowerCaseEmail;
    let passConfirmString = req.body.confirmPassword;
    let passConfirmNewString = req.body.newPassword;

    User.findOne(
      {
        email: userEmailAddress,
      },
      function (err, user) {
        if (err) throw err;
        if (!user) {
          res.status(403).send({
            success: false,
            msg: "No account associated with this email",
          });
        } else if (user && req.body.confirmPassword !== req.body.newPassword) {
          res.status(400).send({
            success: false,
            msg: "Password did not match",
          });
        } else if (
          passConfirmString.length < 6 &&
          passConfirmNewString.length < 6
        ) {
          res.status(400).send({
            success: false,
            msg: "Password not secure. it must be 6 characters or more",
          });
        } else {
          //CHANGE THE PASSWORD
          try {
            bcrypt.genSalt(10, function (err, salt) {
              if (err) {
                return next(err);
              }
              bcrypt.hash(
                req.body.newPassword,
                salt,
                async function (err, hash) {
                  if (err) {
                    return next(err);
                  }
                  const updatedPassword = await User.updateOne(
                    { email: userEmailAddress },
                    {
                      $set: {
                        password: hash,
                        emailVerified: true,
                      },
                    }
                  );
                }
              );
            });
            res.json({
              success: true,
              Message: "Password Successfully updated",
            });
          } catch (err) {
            res.json({ message: err });
          }
        }
      }
    );
  },
};

module.exports = functions;
