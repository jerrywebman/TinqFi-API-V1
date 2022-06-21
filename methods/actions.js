var User = require("../models/user");
var Money = require("../models/money");
var jwt = require("jsonwebtoken");
var config = require("../config/dbconfig");
const { token } = require("morgan");
var bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");
const { createClient } = require("redis");

//for redis
const client = createClient();

client.on("error", (err) => console.log("Redis Client Error", err));

client.connect();

var functions = {
  //logout route
  logout: function (req, res) {
    if (req.session || req.user) {
      req.session.destroy(async (err) => {
        if (err) {
          res.status(400).send("Unable to log out");
        } else {
          await client.del(req.user.email);
          res.status(200).json({
            success: true,
            msg: "Successfully logged you out.",
          });
        }
      });
    } else {
      res.end();
    }
  },

  //***CREATE A NEW USER ACCOUNT***
  signup: async function (req, res) {
    function generateOTP() {
      var digits = "0123456789";
      let OTP = "";
      for (let i = 0; i < 6; i++) {
        OTP += digits[Math.floor(Math.random() * 10)];
      }
      return OTP;
    }
    const generatedOTP = generateOTP();
    const defaultEmail = req.body.email;
    const lowerCaseEmail = defaultEmail.toLowerCase();

    //check if the email exists
    let userEmail = await User.findOne({ email: lowerCaseEmail });
    if (!lowerCaseEmail) {
      res.json({ success: false, msg: "No Email Provided" });
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
            phone: 00000000000,
            occupation: "",
            street: "",
            city: "",
            country: "",
            dateOfBirth: "",
            pin: "",
            verifyCode: hash,
            email: lowerCaseEmail,
            password: null,
          });
          newUser.save(function (err, newUser) {
            if (err) {
              res.json({
                success: false,
                msg: "Failed to create user account",
                err,
              });
            } else {
              const logoUrl = "https://i.imgur.com/uNnD4YG.png";
              let htmlWelcomeTemplate = `
             <!DOCTYPE html>
        <html>
        <body>
         <img src=${logoUrl} alt="ComiBlock Logo" style="display:block;width:150px;height:100px;margin-left:auto; margin-right:auto">
        <h3 style="margin:0.4em; margin-bottom:2em; text-align:center; color:black">Please confirm your email</h3>
        
        <p style="line-spacing:4px; text-align:left;color:black">Hello ,</p>
        <p style="line-spacing:4px; text-align:left;color:black">Please use this verification code to verify your email address.</p>
        <p style="font-weight:bold; text-align:left;color:black;font-size:1.5em;margin-bottom:2em">${generatedOTP}</p>
        <p style="font-size:3px;line-spacing:4px; text-allign:left;color:black;margin-bottom:3em"><span style="font-weight:bold">Note:</span> If you did not take this action, please contact us immediately at <span><a href="mailto:hello@comiblock.com">hello@comiblock.com</a></span>.</p>
        <p style="font-size:2px;line-spacing:4px; text-allign:left; margin-top:2em;color:black">Powerful investment strategies that help you invest in crypto confidently, grow and manage your capital expertly, available on <span><a href="https://play.google.com/store/apps/details?id=com.sendVillageHQ.comi_block">Andriod</a></span>, and coming soon on IOS</p>
        </body>
        </html>
             `;
              //send an email here
              //step 1
              //ALLOW LESS SECURE APPS TO MAKE THIS WORK FOR GMAIL
              let transporter = nodemailer.createTransport({
                host: "smtp.zoho.com",
                secure: true,
                port: 465,
                auth: {
                  user: process.env.NODEMAILER_EMAIL,
                  pass: process.env.NODEMAILER_PASSWORD,
                },
              });

              //step 2
              let mailOptions = {
                from: "support@comiblock.com",
                to: lowerCaseEmail,
                subject: "Please verify your email address",
                html: htmlWelcomeTemplate,
              };

              //step3
              transporter.sendMail(mailOptions, function (err, data) {
                if (err) {
                  console.log(err);
                } else {
                  console.log("Email Sent");
                }
              });

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
      res.json({ success: false, msg: "Please Enter an Email address" });
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

  //****COMPLETE THE USER REGISTRATION***/
  completeSignup: async function (req, res) {
    const userEmailAddress = req.body.email;
    const lowerCaseEmail = userEmailAddress.toLowerCase();
    let fullname = req.body.fullname;
    let password = req.body.password;
    let occupation = req.body.occupation;
    let dateOfBirth = req.body.dateOfBirth;
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
          !req.body.fullname ||
          !req.body.password ||
          !req.body.dateOfBirth ||
          !req.body.occupation
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
                        fullname,
                        password: hash,
                        occupation,
                        dateOfBirth,
                      },
                    }
                  ).then((user) => {
                    //CREATING A NEW USER Money
                    try {
                      const newMoney = {
                        _id: lowerCaseEmail,
                        userEmail: lowerCaseEmail,
                        userFullname: req.body.fullname,
                        occupation: req.body.occupation,
                        walletBalance: 0,
                        emergeBalance: 0,
                        originBalance: 0,
                        referralBonusBalance: 0,
                      };
                      new Money(newMoney).save();
                    } catch (err) {
                      console.log(err);
                    }
                  });
                } catch (err) {
                  res.json(err);
                }
              });
            });

            const logoUrl = "https://i.imgur.com/uNnD4YG.png";
            let htmlWelcomeTemplate = `
              <!DOCTYPE html>
              <html>
              <body>
              <img src=${logoUrl} alt="ComiBlock Logo" style="display:block;width:150px;height:100px;margin-left:auto; margin-right:auto">
              <h3 style="margin:0.4em; text-align:center; color:black">Welcome to ComiBlock</h3>
              
              <p style="line-spacing:4px; text-align:left;color:black">Hello ${fullname},</p>
              <p style="line-spacing:4px; text-align:left;color:black">Thank you for completing your registration today.</p>
              <p style="font-size:2px;line-spacing:4px; text-align:left; margin-top:2em;color:black">Powerful investment strategies that help you invest in crypto confidently, grow and manage your capital expertly, available on <span><a href="https://play.google.com/store/apps/details?id=com.sendVillageHQ.comi_block">Andriod</a></span>, and coming soon on IOS.</p>
              </body>
              </html>
             `;
            //send an email here
            //step 1
            //ALLOW LESS SECURE APPS TO MAKE THIS WORK FOR GMAIL
            let transporter = nodemailer.createTransport({
              host: "smtp.zoho.com",
              secure: true,
              port: 465,
              auth: {
                user: process.env.NODEMAILER_EMAIL,
                pass: process.env.NODEMAILER_PASSWORD,
              },
            });

            //step 2
            let mailOptions = {
              from: "support@comiblock.com",
              to: lowerCaseEmail,
              subject: "Thank you for joining ComiBlock",
              html: htmlWelcomeTemplate,
            };

            //step3
            transporter.sendMail(mailOptions, function (err, data) {
              if (err) {
                console.log(err);
              } else {
                console.log("Email Sent");
              }
            });

            res.json({
              success: true,
              Message: "User Account successfully created",
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
            msg: "Authentication Failed, user email or password not correct",
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
        if (err) res.status(400).json({ success: false, msg: "Invalid Token" });
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

    let userEmail = await User.findOne({ email: lowerCaseEmail });
    if (!lowerCaseEmail) {
      res
        .status(400)
        .send({ success: false, msg: "Please Enter an Email address" });
    } else if (!userEmail) {
      return res.status(400).send({
        success: false,
        msg: "There is no user with this email address!",
      });
    } else {
      function generateOTP() {
        var digits = "0123456789";
        let OTP = "";
        for (let i = 0; i < 6; i++) {
          OTP += digits[Math.floor(Math.random() * 10)];
        }
        return OTP;
      }
      const generatedOTP = generateOTP();
      //NOW I HAVE THE OTP, SEND IT TO THE DATABASE
      const logoUrl = "https://i.imgur.com/uNnD4YG.png";
      let htmlRecoverTemplate = `
            <!DOCTYPE html>
            <html>
            <body>
            <img src=${logoUrl} alt="ComiBlock Logo" style="display:block;width:150px;height:100px;margin-left:auto; margin-right:auto">
            <h3 style="margin:0.4em; margin-bottom:2em; text-align:center; color:black">Please confirm your email</h3>
            
            <p style="line-spacing:4px; text-align:left;color:black">Hello ${userEmail.fullname},</p>
            <p style="line-spacing:4px; text-align:left;color:black">Please use this verification code to verify your email address.</p>
            <p style="font-weight:bold; text-align:left;color:black;font-size:1.5em;margin-bottom:2em">${generatedOTP}</p>
            <p style="font-size:3px;line-spacing:4px; text-allign:left;color:black;margin-bottom:3em"><span style="font-weight:bold">Note:</span> If you did not take this action, please contact us immediately at <span><a href="mailto:hello@comiblock.com">hello@comiblock.com</a></span>.</p>
            <p style="font-size:2px;line-spacing:4px; text-allign:left; margin-top:2em;color:black">Powerful investment strategies that help you invest in crypto confidently, grow and manage your capital expertly, available on <span><a href="https://play.google.com/store/apps/details?id=com.sendVillageHQ.comi_block">Andriod</a></span>, and coming soon on IOS</p>
            </body>
            </html>
    `;
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
              //step 1
              let transporter = nodemailer.createTransport({
                host: "smtp.zoho.com",
                secure: true,
                port: 465,
                auth: {
                  user: process.env.NODEMAILER_EMAIL,
                  pass: process.env.NODEMAILER_PASSWORD,
                },
              });

              //step 2
              let mailOptions = {
                from: "support@comiblock.com",
                to: lowerCaseEmail,
                subject: "OTP Notification - ComiBlock",
                html: htmlRecoverTemplate,
              };

              //step3
              transporter.sendMail(mailOptions, function (err, data) {
                if (err) {
                  console.log("error occurs");
                } else {
                  console.log("Email Sent");
                }
              });
            });
          });
        });
        res.json({
          success: true,
          Message: "OTP successfully sent to user email",
        });
      } catch (err) {
        res.json({ message: err });
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

  // signup: async function (req, res) {
  //   // Function to generate OTP
  //   function generateOTP() {
  //     // Declare a digits variable
  //     // which stores all digits
  //     var digits = "0123456789";
  //     let OTP = "";
  //     for (let i = 0; i < 6; i++) {
  //       OTP += digits[Math.floor(Math.random() * 10)];
  //     }
  //     return OTP;
  //   }
  //   //get the OTP
  //   const generatedOTP = generateOTP();
  //   //request for the email
  //   const defaultEmail = req.body.email;
  //   //change to lowercase
  //   const lowerCaseEmail = defaultEmail.toLowerCase();

  //   //check if the email exists
  //   let userEmail = await User.findOne({ email: lowerCaseEmail });
  //   let userphone = await User.findOne({ phone: req.body.phone });
  //   let userPassword = req.body.password;
  //   let userFullname = req.body.fullname;
  //   if (
  //     !req.body.phone ||
  //     !req.body.fullname ||
  //     !lowerCaseEmail ||
  //     !req.body.occupation ||
  //     !req.body.dateOfBirth ||
  //     !req.body.password
  //   ) {
  //     res.json({ success: false, msg: "Enter all fields" });
  //   } else if (userEmail) {
  //     return res.status(400).send({
  //       success: false,
  //       msg: "a user with this email address already exists!",
  //     });
  //   } else if (userphone) {
  //     return res.status(400).send({
  //       success: false,
  //       msg: "a user with this Phone number already exists!",
  //     });
  //   } else if (userPassword < 6) {
  //     return res.status(400).send({
  //       success: false,
  //       msg: "Password must be 6 or more character long",
  //     });
  //   } else {
  //     //CREATING A NEW USER Money
  //     try {
  //       const newMoney = {
  //         _id: lowerCaseEmail,
  //         userEmail: lowerCaseEmail,
  //         userFullname: req.body.firstname,
  //         occupation: req.body.occupation,
  //         investmentBalance: 0,
  //         referralBonusBalance: 0,
  //       };
  //       await new Money(newMoney).save();
  //     } catch (err) {
  //       console.log(err);
  //     }
  //     //CREATING A NEW USER
  //     var newUser = User({
  //       fullname: req.body.fullname,
  //       phone: req.body.phone,
  //       occupation: req.body.occupation,
  //       street: "",
  //       city: "",
  //       country: "",
  //       dateOfBirth: req.body.dateOfBirth,
  //       verifyCode: Number(generatedOTP),
  //       email: lowerCaseEmail,
  //       password: req.body.password,
  //     });
  //     newUser.save(function (err, newUser) {
  //       if (err) {
  //         res.json({
  //           success: false,
  //           msg: "Failed to create user account",
  //           err,
  //         });
  //       } else {
  //         const logoUrl = "https://i.imgur.com/uNnD4YG.png";
  //         let htmlWelcomeTemplate = `
  //             <!DOCTYPE html>
  //             <html>
  //             <body>
  //             <img src=${logoUrl} alt="ComiBlock Logo" style="display:block;width:150px;height:100px;margin-left:auto; margin-right:auto">
  //             <h3 style="margin:0.4em; text-align:center; color:black">Welcome to ComiBlock</h3>

  //             <p style="line-spacing:4px; text-align:left;color:black">Hello ${userFullname},</p>
  //             <p style="line-spacing:4px; text-align:left;color:black">Please use this verification code to complete your registration.</p>
  //             <p style="font-weight:bold; text-align:left;color:black;font-size:1.5em;margin-bottom:2em">${generatedOTP}</p>
  //             <p style="font-size:2px;line-spacing:4px; text-align:left; margin-top:2em;color:black">Powerful investment strategies that help you invest in crypto confidently, grow and manage your capital expertly, available on <span><a href="https://play.google.com/store/apps/details?id=com.sendVillageHQ.comi_block">Andriod</a></span>, and coming soon on IOS.</p>
  //             </body>
  //             </html>
  //            `;
  //         //send an email here
  //         //step 1
  //         //ALLOW LESS SECURE APPS TO MAKE THIS WORK FOR GMAIL
  //         let transporter = nodemailer.createTransport({
  //           host: "smtp.zoho.com",
  //           secure: true,
  //           port: 465,
  //           auth: {
  //             user: process.env.NODEMAILER_EMAIL,
  //             pass: process.env.NODEMAILER_PASSWORD,
  //           },
  //         });

  //         //step 2
  //         let mailOptions = {
  //           from: "support@comiblock.com",
  //           to: lowerCaseEmail,
  //           subject: "Thank you for joining ComiBlock",
  //           html: htmlWelcomeTemplate,
  //         };

  //         //step3
  //         transporter.sendMail(mailOptions, function (err, data) {
  //           if (err) {
  //             console.log(err);
  //           } else {
  //             console.log("Email Sent");
  //           }
  //         });

  //         res.json({ success: true, msg: "User Account Successfully Created" });
  //       }
  //     });
  //   }
  // },

  // //CREATE NEW/UPDATE PASSWORD
  // //update the user password when user is signed in
  // updatePasswordAuth: async function (req, res) {
  //   const userEmailAddress = req.user.email;
  //   let passConfirmString = req.body.confirmPassword;
  //   let passConfirmNewString = req.body.newPassword;

  //   User.findOne(
  //     {
  //       email: userEmailAddress,
  //     },
  //     function (err, user) {
  //       if (err) throw err;
  //       if (!user) {
  //         res.status(403).send({
  //           success: false,
  //           msg: "Please sign in to change your password",
  //         });
  //       } else if (user && req.body.confirmPassword !== req.body.newPassword) {
  //         res.status(400).send({
  //           success: false,
  //           msg: "Password did not match",
  //         });
  //       } else if (
  //         passConfirmString.length < 6 &&
  //         passConfirmNewString.length < 6
  //       ) {
  //         res.status(400).send({
  //           success: false,
  //           msg: "Password not secure. it must be 6 characters or more",
  //         });
  //       } else {
  //         //CHANGE THE PASSWORD
  //         try {
  //           bcrypt.genSalt(10, function (err, salt) {
  //             if (err) {
  //               return next(err);
  //             }
  //             bcrypt.hash(
  //               req.body.newPassword,
  //               salt,
  //               async function (err, hash) {
  //                 if (err) {
  //                   return next(err);
  //                 }
  //                 const updatedPassword = await User.updateOne(
  //                   { email: userEmailAddress },
  //                   {
  //                     $set: {
  //                       password: hash,
  //                       verified: true,
  //                     },
  //                   }
  //                 );
  //               }
  //             );
  //           });
  //           res.json({
  //             success: true,
  //             Message: "Password Successfully updated",
  //           });
  //         } catch (err) {
  //           res.json({ message: err });
  //         }
  //       }
  //     }
  //   );
  // },

  // getinfo: function (req, res) {
  //   if (
  //     req.headers.authorization &&
  //     req.headers.authorization.split(" ")[0] === "Bearer"
  //   ) {
  //     var token = req.headers.authorization.split(" ")[1];
  //     var decodedtoken = jwt.decode(token, config.secret);
  //     return res.json({
  //       id: decodedtoken._id,
  //       success: true,
  //       fullname: decodedtoken.fullname,
  //       occupation: decodedtoken.occupation,
  //       street: decodedtoken.street,
  //       city: decodedtoken.city,
  //       country: decodedtoken.country,
  //       phone: decodedtoken.phone,
  //       email: decodedtoken.email,
  //       verified: decodedtoken.verified,
  //       assessmentResponse: decodedtoken.assessmentResponse,
  //       addressVerified: decodedtoken.addressVerified,
  //       dateOfBirth: decodedtoken.dateOfBirth,
  //       dateJoined: decodedtoken.dateJoined,
  //     });
  //   } else {
  //     return res
  //       .status(400)
  //       .json({ success: false, msg: "No User/Invalid Token" });
  //   }
  // },

  // //CREATE NEW/UPDATE USER ADDRESS
  // updateAddress: async function (req, res) {
  //   const userEmailAddress = req.user.email;
  //   let street = req.body.userStreet;
  //   let city = req.body.userCity;
  //   let country = req.body.userCountry;
  //   //CHECKING IF USER HAS AN ACCOUNT WITH US
  //   User.findOne(
  //     {
  //       email: userEmailAddress,
  //     },
  //     function (err, user) {
  //       if (err) throw err;
  //       if (!user) {
  //         res.status(403).send({
  //           success: false,
  //           msg: "Please sign in to Update your address",
  //         });
  //       } else if (
  //         !user ||
  //         !req.body.userStreet ||
  //         !req.body.userCity ||
  //         !req.body.userCountry
  //       ) {
  //         res.status(400).send({
  //           success: false,
  //           msg: "Please provide all required information",
  //         });
  //       }
  //       // else if (street.length < 11) {
  //       //   res.status(400).send({
  //       //     success: false,
  //       //     msg: "Your street address is incorrect. it must be 11 characters or more",
  //       //   });
  //       // }
  //       else {
  //         try {
  //           const updatedAddress = User.updateOne(
  //             { email: userEmailAddress },
  //             {
  //               $set: {
  //                 street,
  //                 city,
  //                 country,
  //               },
  //             }
  //           ).then(() => {
  //             res.json({
  //               success: true,
  //               Message: "Address Successfully updated",
  //             });
  //           });
  //         } catch (err) {
  //           res.json({ message: err });
  //         }
  //       }
  //     }
  //   );
  // },

  // //GET ALL USER INFORMATION
  // getAllUserDetails: async function (req, res) {
  //   try {
  //     const allUser = await User.find();
  //     res.json(allUser);
  //   } catch (err) {
  //     res.json({ message: err });
  //   }
  // },

  // //GET ALL USER INFORMATION
  // getAUserDetails: async function (req, res) {
  //   try {
  //     const singleUser = await User.findOne({
  //       email: req.body.userEmail,
  //     });
  //     res.json(singleUser);
  //   } catch (err) {
  //     res.json({ message: err });
  //   }
  // },
};

module.exports = functions;
