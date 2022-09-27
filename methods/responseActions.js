var Response = require("../models/Response");

var functions = {
  // ADD A NEW Response
  addResponse: function (req, res) {
    try {
      if (
        !req.body.responseOne ||
        !req.body.responseTwo ||
        !req.body.responseThree
      ) {
        res.status(403).send({
          success: false,
          msg: "Please submit all the requests",
        });
      }
      const newResponse = {
        userEmail: req.user.email,
        category: req.params.category,
        response: [
          {
            question: "Select what you represent",
            answer: req.body.responseOne,
          },
          {
            question: "What will you use this Loan for?",
            answer: req.body.responseTwo,
          },
          {
            question: "How much crypto do you earn per year?",
            answer: req.body.responseThree,
          },
        ],
      };
      new Response(newResponse)
        .save()
        .then(() =>
          res.json({
            success: true,
            msg: "User response saved successfully",
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
};

module.exports = functions;
