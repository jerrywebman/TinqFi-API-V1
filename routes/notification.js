const express = require("express");
require("dotenv").config();
const notificationActions = require("../methods/notificationActions");

const verify = require("../middleware/verifyToken");

const router = express.Router();

//GET ALL NOTIFICATION
router.get(
  "/api/v1/notification/all_notifications",
  verify,
  notificationActions.getAllNotification
);

//GET A SINGLE NOTIFICATION
router.get(
  "/api/v1/notification/single_notification/:id",
  verify,
  notificationActions.getSingleNotification
);

//DELETE A SINGLE NOTIFICATION
router.delete(
  "/api/v1/notification/single_notification/:id",
  verify,
  notificationActions.deleteNotification
);

//DELETE A SINGLE NOTIFICATION
router.post(
  "/api/v1/notification/add_notification",
  notificationActions.addNotification
);

module.exports = router;
