const { contactUs, adminContactUs } = require("../middleware/emailTemplate");
var ContactUs = require("../models/ContactUs");

var functions = {
  // ** Contact US ROUTE **//
  contactUs: function (req, res) {
    try {
      const { name, email, phoneNumber, industry, budget, message } = req.body;
      if (!name || !email || !phoneNumber || !industry || !budget || !message) {
        res.status(200).json({
          success: false,
          msg: "Please provide all the required information.",
        });
      } else {
        const contactData = ContactUs({
          name,
          email,
          phoneNumber,
          industry,
          budget,
          message,
        });
        contactData.save(function (err, newData) {
          if (err) {
            res.status(500).send({
              success: false,
              msg: "An error occurred",
              err,
            });
          } else {
            contactUs(name, email);
            adminContactUs(name, email, phoneNumber, industry, budget, message);
            return res.status(200).json({
              success: true,
              msg: "Thank you for contacting us. We’ll get back to you shortly.",
            });
          }
        });
      }
    } catch (e) {
      console.error("Contact Us Error:", e);
      res.send({
        success: false,
        msg: "Something went wrong.",
      });
    }
  },
};

module.exports = functions;
