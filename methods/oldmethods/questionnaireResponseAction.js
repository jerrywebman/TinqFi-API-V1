var Questionnaire = require("../../models/Questionnaire");
var User = require("../../models/user");

var functions = {
  //CREATE A NEW Questionnaire
  createQuestionaireResponse: function (req, res) {
    if (!req.user.email) {
      res.status(400).send({
        success: false,
        msg: "Please login to access this route",
      });
    } else if (
      !req.body.goalsResponse ||
      !req.body.experienceResponse ||
      !req.body.styleResponse ||
      !req.body.incomeResponse ||
      !req.body.horizonResponse
    ) {
      res.status(400).send({
        success: false,
        msg: "Please Make sure you submit all available response",
      });
    } else {
      var newQuestionnaireRequest = Questionnaire({
        userEmail: req.user.email,
        userFullname: req.user.fullname,
        assessments: [
          {
            question: "Investment Goals",
            answer: req.body.goalsResponse,
          },
          {
            question: "Investing Experience",
            answer: req.body.experienceResponse,
          },
          {
            question: "Investment Style",
            answer: req.body.styleResponse,
          },
          {
            question: "Monthly Income",
            answer: req.body.incomeResponse,
          },
          {
            question: "Investing Horizon",
            answer: req.body.horizonResponse,
          },
        ],
      });
      newQuestionnaireRequest.save(async function (err, Questionnaire) {
        if (err) {
          res.status(400).send({
            success: false,
            msg: "Failed to create Questionnaire Data",
          });
        } else {
          try {
            const emailAddress = req.user.email;
            const updatedState = await User.updateOne(
              { email: emailAddress },
              {
                $set: {
                  assessmentResponse: true,
                },
              }
            ).then(() => {
              console.log("success");
              return;
            });
          } catch (err) {
            console.log(err);
          }
        }
      });
      res.json({
        success: true,
        msg: "successfully created Questionnaire Data",
      });
    }
  },

  // GET ALL DonationReques
  getAllAssessmenResult: async function (req, res) {
    try {
      const allQuestionnaireRequest = await Questionnaire.find();
      res.json(allQuestionnaireRequest);
    } catch (err) {
      res.json({ message: err });
    }
  },

  // //DELETE a DonationRequest
  // deleteDonationRequest: async function (req, res) {
  //   try {
  //     const removedDonationRequest = await DonationRequest.remove({
  //       _id: req.params.id,
  //     });
  //     res.json({ success: true, Message: "Donation Request Deleted" });
  //   } catch (err) {
  //     res.json({ message: err });
  //   }
  // },

  //GET A DonationRequest
  // getSingleDonationRequest: async function (req, res) {
  //   try {
  //     const singleDonationRequest = await DonationRequest.findById({
  //       _id: req.params.id,
  //     });
  //     res.json(singleDonationRequest);
  //   } catch (err) {
  //     res.json({ message: err });
  //   }
  // },

  //UPDATE DonationRequest
  // updateDonationRequest: async function (req, res) {
  //   try {
  //     const updatedDonationRequest = await DonationRequest.updateOne(
  //       { _id: req.params.id },
  //       {
  //         $set: {
  //           amount: req.body.amount,
  //           status: req.body.status,
  //           childFullname: req.body.childFullname,
  //           childReferralCode: req.body.childReferralCode,
  //         },
  //       }
  //     );
  //     res.json({
  //       success: true,
  //       Message: "Donation Request Successfully updated",
  //     });
  //   } catch (err) {
  //     res.json({ message: err });
  //   }
  // },
};

module.exports = functions;
