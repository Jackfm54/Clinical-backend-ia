const express = require("express");
const multer = require("multer");
const { 
    createUser, 
    getUsers, 
    loginUser, 
    getUserById, 
    getUsersByDoctor 
} = require("../controllers/userController");

const router = express.Router();
const upload = multer();

router.get("/doctor-patients", getUsersByDoctor);

router.post("/", upload.fields([{ name: "faceImage" }, { name: "voiceData" }]), createUser);
router.get("/", getUsers);
router.post("/login", express.json(), loginUser);

router.get("/:userId", getUserById);

module.exports = router;
