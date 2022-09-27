var Notification = require("../models/Notification");

var functions = {
  // GET ALL Notification
  getAllNotification: async function (req, res) {
    try {
      const allNotification = await Notification.find().sort({ createdAt: -1 });
      res.json({
        success: true,
        data: allNotification,
      });
    } catch (err) {
      console.log(err);
      res.json({
        success: false,
        msg: "Failed to get any Notification data",
        error: err,
      });
    }
  },

  // GET A Notification
  getSingleNotification: async function (req, res) {
    try {
      const singleNotification = await Notification.findById({
        _id: req.params.id,
      });
      res.json({
        success: true,
        data: singleNotification,
      });
    } catch (err) {
      res.json({
        success: false,
        msg: "Failed to get any Notification data",
        error: err,
      });
    }
  },

  // DELETE A Notification
  deleteNotification: async function (req, res) {
    try {
      const allNotification = await Notification.deleteOne({
        _id: req.params.id,
      });
      res.json({
        success: true,
        data: allNotification,
      });
    } catch (err) {
      console.log(err);
      res.json({
        success: false,
        msg: "Failed to delete the Notification",
        error: err,
      });
    }
  },

  //add a notification
  // DELETE A Notification
  addNotification: async function (req, res) {
    // if (!req.user.email) {
    //   res.status(400).send({
    //     success: false,
    //     msg: "Please login to access this route",
    //   });
    // }
    // else if (
    //   req.body.name ||
    //   req.body.detail ||
    //   req.body.imageUrl ||
    //   req.body.button ||
    //   req.body.buttonActionWord ||
    //   req.body.buttonLink
    // ) {
    //   res.status(400).send({
    //     success: false,
    //     msg: "Please Make sure you submit all available data",
    //   });
    // }
    // else {
    var newNotification = Notification({
      name: "The Second Name",
      detail:
        "The name of the notification your application will receive when it is created",
      imageUrl: "https://i.imgur.com/YUv3K9Y.jpg",
      button: true,
      buttonActionWord: "Buy",
      buttonLink: "/#",
    });
    newNotification.save(async function (err, Notification) {});
    res.json({
      success: true,
      msg: "successfully created Notification Data",
    });
    // }
  },
};

module.exports = functions;
