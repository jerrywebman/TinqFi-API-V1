var Portfolio = require("../models/Portfolio");

var functions = {
  //CREATE A NEW Portfolio
  createPortfolio: function (req, res) {
    if (
      !req.body.name ||
      !req.body.intro ||
      !req.body.portfolioImageUrl ||
      !req.body.objectiveIntro ||
      !req.body.capAssets ||
      !req.body.capAssetsIntro ||
      !req.body.projectType ||
      !req.body.projectTypeIntro ||
      !req.body.term ||
      !req.body.termIntro ||
      !req.body.inception ||
      !req.body.currentHoldingsUrl ||
      !req.body.faceSheetUrl ||
      !req.body.quarterlyReportUrl
    ) {
      res.json({
        success: false,
        msg: "Please Provide all required Field",
      });
    } else {
      var newPortfolio = Portfolio({
        name: req.body.name,
        intro: req.body.intro,
        portfolioImageUrl: req.body.portfolioImageUrl,
        objectiveIntro: req.body.objectiveIntro,
        capAssets: req.body.capAssets,
        capAssetsIntro: req.body.capAssetsIntro,
        projectType: req.body.projectType,
        projectTypeIntro: req.body.projectTypeIntro,
        term: req.body.term,
        termIntro: req.body.termIntro,
        inception: req.body.inception,
        currentHoldingsUrl: req.body.currentHoldingsUrl,
        faceSheetUrl: req.body.faceSheetUrl,
        quarterlyReportUrl: req.body.quarterlyReportUrl,
      });
      newPortfolio.save(function (err, Portfolio) {
        if (err) {
          res.json({
            success: false,
            msg: "Failed to create Investment Portfolio",
          });
        } else {
          res.json({
            success: true,
            msg: "successfully created Investment Portfolio",
            data: Portfolio,
          });
        }
      });
    }
  },

  // GET ALL Portfolio
  getAllPortfolio: async function (req, res) {
    try {
      const allPortfolio = await Portfolio.find();
      res.json(allPortfolio);
    } catch (err) {
      res.json({ message: err });
    }
  },

  //DELETE a Portfolio
  deletePortfolio: async function (req, res) {
    try {
      const removedPortfolio = await Portfolio.remove({
        _id: req.params.id,
      });
      res.json({ success: true, Message: "Portfolio Deleted" });
    } catch (err) {
      res.json({ message: err });
    }
  },

  // GET A Portfolio
  getSinglePortfolio: async function (req, res) {
    try {
      const singlePortfolio = await Portfolio.findById({
        _id: req.params.id,
      });
      res.json(singlePortfolio);
    } catch (err) {
      res.json({ message: err });
    }
  },
};

module.exports = functions;
