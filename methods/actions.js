var User = require("../models/user");
var Money = require("../models/money");
var jwt = require("jsonwebtoken");
var bcrypt = require("bcrypt");
const createWalletActions = require("./specialMethods/createWalletActions");
const emailTemplate = require("../middleware/emailTemplate");
const generateOTP = require("../middleware/generateOTP");
var AddressStore = require("../models/address");
const axios = require("axios");
const client = require("../middleware/init_redis");

var functions = {
  // ** LOGOUT ROUTE **//
  logout: function (req, res) {
    try {
      if (req.session || req.user) {
        req.session.destroy(async (err) => {
          if (err) {
            res
              .status(400)
              .send({ success: false, message: "Unable to logout" });
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
    } catch (e) {
      res.send({
        success: false,
        msg: "Server Error",
      });
    }
  },

  deleteUser: async function (req, res) {
    try {
      const defaultEmail = req.body.email;
      const lowerCaseEmail = defaultEmail.toLowerCase();
      const removedUser = await User.deleteOne({
        email: lowerCaseEmail,
      }).then(async () => {
        const removedMoney = await Money.deleteOne({
          userEmail: lowerCaseEmail,
        });
        const removedAddress = await AddressStore.deleteOne({
          userEmail: lowerCaseEmail,
        });
        res.json({ success: true, Message: "User Deleted" });
      });
    } catch (err) {
      res.json({ message: err });
    }
  },

  resendOTP: async function (req, res) {
    try {
      const generatedOTP = generateOTP();
      const defaultEmail = req.body.email;
      const lowerCaseEmail = defaultEmail.toLowerCase();

      //check if the email exists
      let userEmail = await User.findOne({ email: lowerCaseEmail });
      if (!lowerCaseEmail) {
        res.status(400).send({ success: false, msg: "No Email Provided" });
      } else if (!userEmail) {
        return res.status(401).send({
          success: false,
          msg: "no user with this email address, Please Signup",
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

            //UPDATING THE USER OTP
            const updatedOTP = await User.updateOne(
              { email: lowerCaseEmail },
              {
                $set: {
                  verifyCode: hash,
                },
              }
            ).then(() => {
              emailTemplate.signup(generatedOTP, lowerCaseEmail);
              res.json({
                success: true,
                msg: "Please check your email address for the OTP",
              });
            });
          });
        });
      }
    } catch (e) {
      res.status(503).send({
        success: false,
        msg: "An server error occurred while processing the next steps",
        error: e,
      });
    }
  },

  //***CREATE A NEW USER ACCOUNT***//
  signup: async function (req, res) {
    try {
      const generatedOTP = generateOTP();
      const defaultEmail = req.body.email;
      const lowerCaseEmail = defaultEmail.toLowerCase();

      //check if the email exists
      let userEmail = await User.findOne({ email: lowerCaseEmail });
      if (!lowerCaseEmail) {
        res.status(400).send({ success: false, msg: "No Email Provided" });
      } else if (userEmail) {
        res.status(400).send({
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
              occupation: "",
              street: "",
              city: "",
              country: "",
              dateOfBirth: "",
              ourCustomerTatumId: lowerCaseEmail,
              onRegistrationLedgerAccnts: [],
              pin: null,
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
    } catch (e) {
      res.status(503).send({
        success: false,
        msg: "A error occurred while processing the next steps",
        error: e,
      });
    }
  },

  //***VERIFY EMAIL ADDRESS***
  verifyEmail: async function (req, res) {
    try {
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
    } catch (e) {
      res.status(503).send({
        success: false,
        msg: `A server error occurred while processing the next steps, Error: ${e}`,
      });
    }
  },

  //3****COMPLETE THE USER REGISTRATION***/
  completeSignup: async function (req, res) {
    try {
      const userEmailAddress = req.body.email;
      const lowerCaseEmail = userEmailAddress.toLowerCase();
      let nickname = req.body.nickname;
      let referredBy = req.body.referredBy || " ";
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
                bcrypt.hash(
                  req.body.password,
                  salt,
                  async function (err, hash) {
                    if (err) {
                      return next(err);
                    }
                    try {
                      const user = User.updateOne(
                        { email: lowerCaseEmail },
                        {
                          $set: {
                            nickname,
                            referredBy,
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
                              referredBy,
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
                            const clientEmail = lowerCaseEmail;
                            //CREATE TATUM ACCOUNT_SETUP AND RECIEVE ADDRESSES HERE and delay the response by some seconds
                            async function btc() {
                              try {
                                await new Promise((resolve) =>
                                  setTimeout(resolve, 500)
                                );
                                createWalletActions.createBtcWallet(
                                  clientEmail
                                );
                              } catch (e) {
                                console.log(e);
                              }
                            }
                            btc();
                            async function eth() {
                              try {
                                await new Promise((resolve) =>
                                  setTimeout(resolve, 1000)
                                );
                                createWalletActions.createETHWallet(
                                  clientEmail
                                );
                              } catch (e) {
                                console.log(e);
                              }
                            }
                            eth();
                            async function bsc() {
                              try {
                                await new Promise((resolve) =>
                                  setTimeout(resolve, 1500)
                                );
                                createWalletActions.createBSCWallet(
                                  clientEmail
                                );
                              } catch (e) {
                                console.log(e);
                              }
                            }
                            bsc();
                            async function doge() {
                              try {
                                await new Promise((resolve) =>
                                  setTimeout(resolve, 2000)
                                );
                                createWalletActions.createDOGEWallet(
                                  clientEmail
                                );
                              } catch (e) {
                                console.log(e);
                              }
                            }
                            doge();
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
                  }
                );
              });

              //SEND EMAIL
              emailTemplate.completeRegistration(lowerCaseEmail, nickname);

              // res.json({
              //   success: true,
              //   msg: "User Account successfully created, Please Login ",
              // });
              //PASS THE USER TOKEN TO
              const theFunction = async () => {
                const theuser = await User.findOne({ email: lowerCaseEmail });
                if (!theuser) {
                  res.json({
                    success: false,
                    user: "error occured while creating user account. Please Login",
                  });
                } else {
                  const payload = {
                    sub: theuser._id,
                    user: theuser,
                    iat: Date.now(),
                  };

                  var token = jwt.sign(payload, process.env.TOKEN_SECRET, {
                    expiresIn: "5d",
                  });
                  // Set data to Redis
                  client.set(theuser.email, token);
                  client.expire(theuser.email, 86400);
                  //give the response
                  res.json({
                    success: true,
                    user: theuser,
                    token: "Bearer " + token,
                  });
                }
              };

              setTimeout(() => theFunction(), 6000);
            } catch (err) {
              res.json({ message: err });
            }
          }
        }
      );
    } catch (e) {
      res.status(503).send({
        success: false,
        msg: `A server error occurred while processing the next steps, Error: ${e}`,
      });
    }
  },

  //**** AUTHENTICATE A USER****/
  authenticate: function (req, res) {
    try {
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
                    await client.expire(user.email, 86400);
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
    } catch (e) {
      res.status(503).send({
        success: false,
        msg: `A server error occurred while processing the next steps, Error: ${e}`,
      });
    }
  },

  //GET USER INFORMATION
  getInfo: function (req, res) {
    try {
      if (
        req.headers.authorization &&
        req.headers.authorization.split(" ")[0] === "Bearer"
      ) {
        var token = req.headers.authorization.split(" ")[1];
        jwt.verify(token, process.env.TOKEN_SECRET, function (err, decoded) {
          if (err)
            res.status(401).json({ success: false, msg: "Invalid Token" });
          else {
            res.send({ decoded });
          }
        });
      } else {
        return res
          .status(400)
          .json({ success: false, msg: "No User/Invalid Token" });
      }
    } catch (e) {
      res.status(503).send({
        success: false,
        msg: "A server error occurred while processing the next steps",
      });
    }
  },

  //***RECOVER USER ACCOUNT USING FORGOT PASSWORD LINK***
  recoverAccount: async function (req, res) {
    try {
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
                emailTemplate.recover(generatedOTP, lowerCaseEmail);
                //  emailTemplate.completeRegistration(lowerCaseEmail, nickname);
              });
            });
          });
          res.json({
            success: true,
            msg: "OTP successfully sent to user email",
          });
        } catch (err) {
          res.json({
            success: false,
            msg: `Failed to recover user account ${err}`,
          });
        }
      }
    } catch (e) {
      res.status(503).send({
        success: false,
        msg: `A server error occurred while processing the next steps Error: ${e}`,
      });
    }
  },

  //***UPDATE USER PIN***
  updatePin: function (req, res) {
    try {
      const defaultEmail = req.user.email;
      const defaultPin = req.body.pin;
      const defaultVerifyPin = req.body.verifyPin;
      const lowerCaseEmail = defaultEmail.toLowerCase();
      const theEmail = lowerCaseEmail;
      if (defaultPin === null && defaultVerifyPin === undefined) {
        res.status(401).send({
          success: false,
          msg: "Please enter a 4 digit pin!",
        });
      }
      else if (defaultPin !== defaultVerifyPin) {
        res.status(401).send({
          success: false,
          msg: "Pin must match",
        });
      } else if (defaultPin.length > 4 || defaultVerifyPin.length > 4) {
        res.status(400).send({
          success: false,
          msg: "Pin is greater than 4 digits",
        });
      } else if (defaultPin.length < 4 || defaultVerifyPin.length < 4) {
        res.status(400).send({
          success: false,
          msg: "Pin is less than 4 digits",
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
    } catch (e) {
      res.status(503).send({
        success: false,
        msg: `A server error occurred while setting your pin, Error: ${e}`,
      });
    }
  },

  //***UPDATE LEGAL AGGREMENT***
  updateLegal: async function (req, res) {
    try {
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
    } catch (e) {
      res.status(503).send({
        success: false,
        msg: "A server error occurred while processing the next steps",
        error: e,
      });
    }
  },

  //***UPDATE USER BVN***
  updateBvn: async function (req, res) {
    try {
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
    } catch (e) {
      res.status(503).send({
        success: false,
        msg: "A server error occurred while processing the next steps",
        error: e,
      });
    }
  },

  //*** UPDATE A USER PASSWORD WHEN NOT SIGNED IN** */
  updatePassword: async function (req, res) {
    try {
      const defaultEmail = req.body.email;
      const lowerCaseEmail = defaultEmail.toLowerCase();

      const userEmailAddress = lowerCaseEmail;
      let passConfirmString = req.body.confirmPassword;
      let passConfirmNewString = req.body.password;

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
          } else if (user && req.body.confirmPassword !== req.body.password) {
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
                  req.body.password,
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
                msg: `Account recovery failed ${err}`,
              });
            }
          }
        }
      );
    } catch (e) {
      res.status(503).send({
        success: false,
        msg: `A server error occurred while processing the next steps ,Error: ${e}`,
      });
    }
  },

  //*** UPDATE A USER PASSWORD WHEN SIGNED IN** */
  updatePasswordAuth: async function (req, res) {
    try {
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
          } else if (
            user &&
            req.body.confirmPassword !== req.body.newPassword
          ) {
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
    } catch (e) {
      res.status(503).send({
        success: false,
        msg: "A server error occurred while processing the next steps",
        error: e,
      });
    }
  },

  //** GET USER INFORMATION */
  getInfos: async function (req, res) {
    try {
      const user = await User.findOne({ email: req.user.email });
      const userDetails = {
        fullname: user.fullname,
        email: user.email,
        phone: user.phone,
        nickname: user.nickname,
        street: user.street,
        country: user.country,
        occupation: user.occupation,
        dateOfBirth: user.dateOfBirth,
        emailVerified: user.emailVerified,
        accountSetup: user.accountSetup,
        accountVerified: user.accountVerified,
      };
      res.send({ success: true, user: userDetails });
    } catch (e) {
      res.status(503).send({
        success: false,
        msg: "A server error occurred while processing the next steps",
      });
    }
  },

  //** UPDATE USER INFORMATION */
  updateInfos: async function (req, res) {
    try {
      await User.updateOne(
        { email: req.user.email },
        {
          $set: {
            phone: req.body.phone,
            city: req.body.city,
            street: req.body.address,
            country: req.body.country,
            occupation: req.body.occupation,
            dateOfBirth: req.body.dateOfBirth,
          },
        }
      );
      res.send({ success: true, msg: "Profile updated successfully" });
    } catch (e) {
      res.status(503).send({
        success: false,
        msg: "A server error occurred while processing the next steps",
      });
    }
  },

  //** UPDATE USER INFORMATION */
  appInfo: function (req, res) {
    const data = {
      andriodVersion: 12,
      IOSVersion: 12,
      andriodVersionText: "12",
      IOSVersionText: "12",
      termsAndConditions: "https://www.tinqfi.com/terms_and_condition",
      privacyPolicy: "https://www.tinqfi.com/privacy_policy",
      forceUpdate: false,
      playStoreUrl: "",
      appStoreUrl: "",
      websiteUrl: "https://www.tinqfi.com/",
      faqUrl: "https://www.tinqfi.com/faqs",
      aboutUrl: "https://www.tinqfi.com/about",
      supportEmail: "support@tinqfi.com",
      supportPhone: "",
      facebookUrl: "https://facebook.com/tinqfi",
      twitterUrl: "https://twitter.com/tinqfi",
      instagramUrl: "https://instagramcom/tinqfi",
      linkedinUrl: "https://www.linkedin.com/company/tinqfi",
      latestAppFeatures: "",
    };
    try {
      res.send({ success: false, msg: "OK", data });
    } catch (e) {
      res.status(503).send({
        success: false,
        msg: "A server error occurred while processing your request",
      });
    }
  },
};

module.exports = functions;
