import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./utils/connectDB.js"
import authRoutes from "./routes/authRoutes.js";
import capsuleRoutes from "./routes/capsuleRoutes.js";


dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api/capsule", capsuleRoutes);

app.get("/", (req, res) => res.send("API Running..."));

connectDB();
const PORT = process.env.SERVER_PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
