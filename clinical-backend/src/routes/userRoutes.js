const express = require("express");
const multer = require("multer");
const { createUser, getUsers, loginUser } = require("../controllers/userController");

const router = express.Router();
const upload = multer();

router.post("/", upload.fields([{ name: "faceImage" }, { name: "voiceData" }]), createUser);
router.get("/", getUsers);
router.post("/login", express.json(), loginUser);

module.exports = router;
