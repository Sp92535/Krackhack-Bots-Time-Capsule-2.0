import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

export const sendVerificationEmail = async (email, token) => {
    const verificationLink = `${process.env.BASE_URL}/api/auth/verify-email?token=${token}`;

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: "Verify Your Email",
        text: `Click the link to verify your email: ${verificationLink}`,
    };

    await transporter.sendMail(mailOptions);
};
export const sendUnlockNotification = async (email, capsuleTitle) => {
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: "Your Time Capsule is Now Open!",
        text: `A new capsule, "${capsuleTitle}", is now unlocked on Timeless Treasures. Check it out!`,
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log(`Notification sent to ${email}`);
    } catch (error) {
        console.error(`Error sending email to ${email}:`, error);
    }
};