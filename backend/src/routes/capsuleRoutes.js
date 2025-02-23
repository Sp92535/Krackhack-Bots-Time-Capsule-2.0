import express from "express";
import { createCapsule, deleteCapsule, getUserCapsules, lockCapsule, updateCapsule, uploadCapsuleData } from "../controllers/capsuleController.js";
import protect from "../middlewares/authMiddleware.js";
import multer from "multer"
import { streamCapsuleFiles } from "../utils/cloudflareR2.js";

const storage = multer.memoryStorage();
const upload = multer({ storage });

const router = express.Router();

router.post("/create-capsule", protect, createCapsule);
router.put("/update-capsule", protect, updateCapsule);
router.get("/my-capsules", protect, getUserCapsules);
router.post("/upload", protect, upload.array("files"), uploadCapsuleData);
router.put("/lock", protect, lockCapsule)
router.get("/open/:capsuleId", protect, streamCapsuleFiles);
router.delete("/delete-capsule", protect, deleteCapsule);

export default router