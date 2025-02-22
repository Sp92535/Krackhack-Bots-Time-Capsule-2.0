import { validationResult } from "express-validator";
import { User } from "../models/index.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { v4 as uuidv4 } from "uuid";
import { sendVerificationEmail } from "../utils/sendEmail.js";

export const register = async (req, res) => {

    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

        const { email, password } = req.body;
        let user = await User.findOne({ where: { email } });
        if (user) return res.status(400).json({ message: "User already exists" });

        const hashedPassword = await bcrypt.hash(password, 10);
        const verificationToken = uuidv4(); // Generate unique token
        
        
        user = await User.create({ email, password: hashedPassword, verificationToken, isVerified:true /*Testing only*/ });

        // await sendVerificationEmail(email, verificationToken);

        res.json({ message: "Verification email sent. Please check your inbox." });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Server error" });
    }
};

export const login = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ where: { email } });
        if (!user) return res.status(400).json({ message: "Invalid credentials" });

        if (!user.isVerified) return res.status(400).json({ message: "Click on the verification link in your mail." });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: "7d" });
        return res.json({ token, email: user.email });

    } catch (err) {
        return res.status(500).json({ message: "Server error" });
    }
};


export const verifyEmail = async (req, res) => {
    const { token } = req.query;

    try {
        const user = await User.findOne({ where: { verificationToken: token } });

        if (!user) return res.status(400).json({ message: "Invalid or expired token" });

        user.isVerified = true;
        user.verificationToken = null; // Remove token after verification
        await user.save();

        res.json({ message: "Email verified successfully. You can now log in." });
    } catch (err) {
        res.status(500).json({ message: "Server error" });
    }
};
