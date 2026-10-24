const { contactUs, adminContactUs } = require("../middleware/emailTemplate");
const {
  contactUsZamafit,
  adminContactUsZamafit,
} = require("../middleware/emailTemplateZamafit");
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
        contactData.save().then((savedDoc) => {
          contactUs(name, email);
          adminContactUs(name, email, phoneNumber, industry, budget, message);
          return res.status(200).json({
            success: true,
            msg: "Thank you for contacting us. We’ll get back to you shortly.",
          });
        });
      }
    } catch (e) {
      res.status(500).json({
        success: false,
        msg: "Something went wrong.",
      });
    }
  },

  contactUsZamafit: async function (req, res) {
    try {
      const { name, email, phone, subject, message, website, from } = req.body;
      // Honeypot: reject automated submissions.
      // Return a generic success response to avoid revealing the check.
      if (typeof website === "string" && website.trim() !== "") {
        return res.status(200).json({
          success: true,
          msg: "Thank you for contacting us. We'll get back to you shortly.",
        });
      }

      // Validate required fields.
      if (
        typeof name !== "string" ||
        typeof email !== "string" ||
        typeof phone !== "string" ||
        typeof subject !== "string" ||
        typeof message !== "string" ||
        !name.trim() ||
        !email.trim() ||
        !phone.trim() ||
        !subject.trim() ||
        !message.trim()
      ) {
        return res.status(400).json({
          success: false,
          msg: "Please provide all the required information.",
        });
      }

      // Validate field lengths.
      if (
        name.trim().length < 2 ||
        name.length > 150 ||
        email.length > 254 ||
        phone.length > 30 ||
        message.trim().length < 10 ||
        message.length > 5000
      ) {
        return res.status(400).json({
          success: false,
          msg: "Please check your information and try again.",
        });
      }

      // Validate email format.
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      if (!emailPattern.test(email.trim())) {
        return res.status(400).json({
          success: false,
          msg: "Please provide a valid email address.",
        });
      }

      // Allow only known subjects.
      const allowedSubjects = [
        "Osteoarthritis Rehabilitation",
        "Cancer Rehabilitation",
        "Community Wellbeing Classes",
        "General Enquiry",
        "Other",
      ];

      if (!allowedSubjects.includes(subject)) {
        return res.status(400).json({
          success: false,
          msg: "Please select a valid subject.",
        });
      }

      // Send notifications after successfully saving.
      try {
        await Promise.all([
          contactUsZamafit(name.trim(), email.trim()),
          adminContactUsZamafit(
            name.trim(),
            email.trim(),
            phone.trim(),
            subject,
            message.trim(),
          ),
        ]);
      } catch (notificationError) {
        console.error(
          "Contact saved, but notification failed:",
          notificationError,
        );
      }

      return res.status(201).json({
        success: true,
        msg: "Thank you for contacting us. We'll get back to you shortly.",
      });
    } catch (error) {
      console.error("Contact submission error:", error);

      return res.status(500).json({
        success: false,
        msg: "Something went wrong. Please try again later.",
      });
    }
  },
};

module.exports = functions;
