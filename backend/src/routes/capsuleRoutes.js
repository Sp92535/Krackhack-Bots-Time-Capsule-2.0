import express from "express";
import { addEditorsViewers, createCapsule, getUserCapsules, updateUnlockDate } from "../controllers/capsuleController.js";
import protect from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/create-capsule", protect, createCapsule);
router.put("/update-unlock", protect, updateUnlockDate);
router.put("/add-editors-viewers", protect, addEditorsViewers);
router.get("/my-capsules", protect, getUserCapsules);

export default router