import express from "express";
import { login, register, verifyEmail } from "../controllers/authController.js";
import { body } from "express-validator";

const router = express.Router();

// Register Route
router.post(
    "/register",
    [
        body("email").isEmail().withMessage("Invalid email"),
        // body("password").isLength({ min: 6 }).withMessage("Password too short"),
    ],
    register
);

// Login Route
router.post(
    "/login",
    login
);

// Verification link
router.get(
    "/verify-email",
    verifyEmail
)

export default router;
