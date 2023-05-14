var Biometrics = require("../models/biometrics");
var User = require("../models/user");
var jwt = require("jsonwebtoken");
const client = require("../middleware/init_redis");

var functions = {
  // CREATE A BIOMETRICS PROFILE
  activateAccount: async function (req, res) {
    try {
      const biodataActive = await Biometrics.findOne({ email: req.user.email })
      if (biodataActive !== null) {
        res.status(401).send({
          success: false,
          msg: "This user has already activated biometics on another device.",
        });
      }
      else if (
        !req.body.modelNumber ||
        !req.body.deviceName
      ) {
        res.status(403).send({
          success: false,
          msg: "Please provide the device name and model number",
        });
      } else {
        const newBioData = {
          email: req.user.email,
          modelNumber: req.body.modelNumber,
          deviceName: req.body.deviceName,
        };
        new Biometrics(newBioData)
          .save()
          .then(async (result) => {
            await Biometrics.updateOne(
              { email: req.user.email },
              {
                $set: {
                  biometricsId: result._id,
                },
              }
            ).then(() =>
              res.json({
                success: true,
                msg: "Biometrics Activation successful",
              })
            )
          })
          .catch((err) =>
            res.status(403).send({
              success: false,
              msg: `Something went wrong ${err.message}`,
            })
          );
      }
    } catch (e) {
      res.status(500).send({
        success: false,
        msg: "Server error",
      });
    }
  },

  //VERIFY THE USER WITH JWT
  verifyAccount: async function (req, res) {
    try {
      if (!req.body.deviceName || !req.body.modelNumber) {
        res.status(403).send({
          success: false,
          msg: "Please provide the deviceName and modelNumber",
        });
      }
      const userBiometrics = await Biometrics.findOne({
        deviceName: req.body.deviceName,
        modelNumber: req.body.modelNumber,
      });

      if (!userBiometrics) {
        res.status(403).send({
          success: false,
          msg: "No user found for this device",
        });
      } else if (
        userBiometrics.deviceName !== req.body.deviceName ||
        userBiometrics.modelNumber !== req.body.modelNumber
      ) {
        res.status(401).send({
          success: false,
          msg: "you cannot login using this device, please login with email and password first.",
        });
      } else {
        //PASS THE USER TOKEN TO CHECK
        const pass = async () => {
          const user = await User.findOne({ email: req.user.email });
          if (user.email !== userBiometrics.email) {
            res.status(401).send({
              success: false,
              msg: "you cannot login using this device, please login with email and password first.",
            });
          } else {
            res.send({
              success: true,
              msg: "Biometrics authentication successful",
            });
            // const payload = {
            //   sub: user._id,
            //   user: user,
            //   iat: Date.now(),
            // };
            // var token = jwt.sign(payload, process.env.TOKEN_SECRET, {
            //   expiresIn: "5d",
            // });
            // res.json({
            //   success: true,
            //   user: user,
            //   token: "Bearer " + token,
            // });
            // // Set data to Redis
            // await client.set(user.email, token);
            // await client.expire(user.email, 86400);
          }
        };
        //run the function
        pass();
      }
    } catch (err) {
      res.status(500).send({
        success: false,
        msg: `Server error - ${err.message}`,
      });
    }
  },
};

module.exports = functions;
