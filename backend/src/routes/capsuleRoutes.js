import express from "express";
import { createCapsule, getUserCapsules, lockCapsule, updateCapsule, uploadCapsuleData } from "../controllers/capsuleController.js";
import protect from "../middlewares/authMiddleware.js";
import multer from "multer"
import { streamCapsuleFiles } from "../utils/cloudflareR2.js";

const storage = multer.memoryStorage();
const upload = multer({ storage });

const router = express.Router();

router.post("/create-capsule", protect, createCapsule);
router.put("/update-capsule", protect, updateCapsule);
router.get("/my-capsules", protect, getUserCapsules);
router.post("/upload", upload.array("files"), protect, uploadCapsuleData);
router.put("/lock", protect, lockCapsule)
router.get("/open/:capsuleId",streamCapsuleFiles);

export default router