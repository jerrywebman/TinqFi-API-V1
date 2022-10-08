var Faq = require("../models/Faq");

var functions = {
  // ADD A NEW FAQ
  addFaq: function (req, res) {
    try {
      if (!req.body.question || !req.body.answer || !req.body.category) {
        res.status(403).send({
          success: false,
          msg: "Please submit all the requests",
        });
      }
      const newFaq = {
        question: req.body.question,
        answer: req.body.answer,
        category: req.body.category,
      };
      new Faq(newFaq)
        .save()
        .then(() =>
          res.json({
            success: true,
            msg: "New Faq response added successfully",
          })
        )
        .catch((err) =>
          res.status(403).send({
            success: false,
            msg: "Something went wrong",
          })
        );
    } catch (e) {
      res.status(500).send({
        success: false,
        msg: "Server error",
      });
    }
  },

  //DELETE AN EXISTING FAQ
  deleteFaq: async function (req, res) {
    try {
      const removeFaq = await Faq.deleteOne({
        _id: req.params.id,
      })
        .then(() => res.json({ success: true, Message: "Faq Deleted" }))
        .catch(() =>
          res.status(403).send({
            success: false,
            msg: "Something went wrong",
          })
        );
    } catch (err) {
      res.status(500).send({
        success: false,
        msg: "Server error",
      });
    }
  },

  //GET ALL THE FAQ
  getFaq: async function (req, res) {
    try {
      const faqResponse = await Faq.find({});
      res.json({
        success: true,
        message: "Request successful",
        faq: faqResponse,
      });
    } catch (e) {
      res.status(500).send({
        success: false,
        msg: "Server error",
      });
    }
  },
};

module.exports = functions;
