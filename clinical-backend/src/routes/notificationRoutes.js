const express = require("express");
const { getHighRiskNotifications, getNotifications, getNotificationsByDoctor, deleteNotification } = require("../controllers/notificationController");

const router = express.Router();

router.get("/:doctorId", getNotificationsByDoctor);
router.delete("/:notificationId", deleteNotification);


module.exports = router;
