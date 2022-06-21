var Strategy = require("../models/Strategy");

var functions = {
  //CREATE A NEW STRATEGY
  createStrategy: function (req, res) {
    const numEmerge = Number(req.body.emerge);
    const numOrigin = Number(req.body.origin);
    if (!numEmerge || !numOrigin) {
      res.json({
        success: false,
        msg: "Please Provide all required Field",
      });
    } else {
      var newStrategy = Strategy({
        emerge: numEmerge,
        origin: numOrigin,
      });
      newStrategy.save(function (err, Strategy) {
        if (err) {
          res.json({
            success: false,
            msg: "Failed to add Strategy Performance Data",
          });
        } else {
          res.json({
            success: true,
            msg: "successfully added Strategy Performance Data",
            data: Strategy,
          });
        }
      });
    }
  },

  // GET ALL Strategy
  getAllStrategy: async function (req, res) {
    try {
      const allStrategy = await Strategy.find().sort({ createdAt: -1 });
      res.json(allStrategy);
    } catch (err) {
      res.json({ message: err });
    }
  },

  //DELETE a Strategy
  deleteStrategy: async function (req, res) {
    try {
      const removedStrategy = await Strategy.remove({
        _id: req.params.id,
      });
      res.json({
        success: true,
        data: removedStrategy,
        Message: "Strategy Deleted",
      });
    } catch (err) {
      res.json({ message: err });
    }
  },

  // GET A Portfolio
  getSingleStrategy: async function (req, res) {
    try {
      const singleStrategy = await Strategy.find()
        .sort({ createdAt: -1 })
        .limit(1);
      res.json(singleStrategy);
    } catch (err) {
      res.json({ message: err });
    }
  },
};

module.exports = functions;
