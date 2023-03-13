var Biometrics = require("../models/biometrics");
var User = require("../models/user");
var jwt = require("jsonwebtoken");
const client = require("../middleware/init_redis");

var functions = {
  // CREATE A BIOMETRICS PROFILE
  activateAccount: async function (req, res) {
    try {
      let userExist = await Biometrics.findOne({ email: req.user.email });
      if (
        !req.body.modelNumber ||
        !req.body.deviceName ||
        !req.body.biometricsId
      ) {
        res.status(403).send({
          success: false,
          msg: "Please provide the device name, bio id and model number",
        });
      } else if (userExist) {
        res.status(400).send({
          success: false,
          msg: "you have already created a biometrics profile",
        });
      } else {
        const newBioData = {
          email: req.user.email,
          biometricsId: req.body.biometricsId,
          modelNumber: req.body.modelNumber,
          deviceName: req.body.deviceName,
        };
        new Biometrics(newBioData)
          .save()
          .then(() =>
            res.json({
              success: true,
              msg: "Biometrics authentication successful",
            })
          )
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
      if (!req.body.biometricsId || !req.body.modelNumber) {
        res.status(403).send({
          success: false,
          msg: "Please provide the bioId and modelNumber",
        });
      }
      const userBiometrics = await Biometrics.findOne({
        biometricsId: req.body.biometricsId,
        modelNumber: req.body.modelNumber,
      });

      if (!userBiometrics) {
        res.status(403).send({
          success: false,
          msg: "No user found for this device",
        });
      } else if (
        userBiometrics.biometricsId !== req.body.biometricsId ||
        userBiometrics.modelNumber !== req.body.modelNumber
      ) {
        res.status(401).send({
          success: false,
          msg: "you cannot login using this device, please login with email and password first.",
        });
      } else {
        //PASS THE USER TOKEN TO CHECK
        const pass = async () => {
          const user = await User.findOne({ email: userBiometrics.email });
          if (user.email !== userBiometrics.email) {
            res.status(401).send({
              success: false,
              msg: "you cannot login using this device, please login with email and password first.",
            });
          } else {
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
