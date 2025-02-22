import express from "express";
import { addEditorsViewers, createCapsule, getUserCapsules, lockCapsule, updateUnlockDate, uploadCapsuleData } from "../controllers/capsuleController.js";
import protect from "../middlewares/authMiddleware.js";

import multer from "multer";
const upload = multer({ storage: multer.memoryStorage() });

const router = express.Router();

router.post("/create-capsule", protect, createCapsule);
router.put("/update-unlock", protect, updateUnlockDate);
router.put("/add-editors-viewers", protect, addEditorsViewers);
router.get("/my-capsules", protect, getUserCapsules);
router.post("/upload", upload.single("file"), uploadCapsuleData);
router.put("/lock",protect, lockCapsule)

export default router