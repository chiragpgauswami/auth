import { Router } from "express";
import {
  createResetSession,
  generateOTP,
  getUser,
  login,
  register,
  resetPassword,
  updateUser,
  verifyOTP,
  verifyUser,
} from "../contrllers/appController.js";
import Auth, { localVariables } from "../middleware/auth.js";
import { registerMail } from "../contrllers/mailer.js";

const router = Router();

// POST

router.post("/register", register);

router.post("/login", verifyUser, login);

router.post("/registerMail", registerMail);

router.post("/authenticate", verifyUser, (req, res) => {
  res.end();
});

// GET

router.get("/user/:username", getUser);

router.get("/generateOTP", verifyUser, localVariables, generateOTP);

router.get("/verifyOTP", verifyUser, verifyOTP);

router.get("/createResetSession", createResetSession);

// PUT

router.put("/updateUser", Auth, updateUser);

router.put("/resetPassword", verifyUser, resetPassword);

export default router;
