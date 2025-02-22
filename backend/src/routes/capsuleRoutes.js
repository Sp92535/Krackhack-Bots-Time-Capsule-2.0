import express from "express";
import { addEditorsViewers, createCapsule, getUserCapsules, lockCapsule, updateUnlockDate, uploadCapsuleData } from "../controllers/capsuleController.js";
import protect from "../middlewares/authMiddleware.js";
import multer from "multer"

const storage = multer.memoryStorage();
const upload = multer({ storage });

const router = express.Router();

router.post("/create-capsule", protect, createCapsule);
router.put("/update-capsule", protect, updateUnlockDate);
router.get("/my-capsules", protect, getUserCapsules);
router.post("/upload", upload.array("files"), protect, uploadCapsuleData);
router.put("/lock", protect, lockCapsule)

export default router