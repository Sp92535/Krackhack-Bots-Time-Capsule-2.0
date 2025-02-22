import { Op } from "sequelize";
import crypto from "crypto";
import { uploadFilesToR2 } from "../utils/cloudflareR2.js";
import { User, Capsule } from "../models/index.js";

export const createCapsule = async (req, res) => {
    try {
        const { capsuleName, description, editors = [], viewers = [], unlockDate } = req.body;
        const ownerId = req.user.id;
        const decodeKey = crypto.randomBytes(32).toString("hex");

        // Fetch users in parallel
        const [editorUsers, viewerUsers] = await Promise.all([
            User.findAll({ where: { email: editors } }),
            User.findAll({ where: { email: viewers } }),
        ]);

        const capsuleDataLink = "link"; // Placeholder for Firebase upload logic

        const capsule = await Capsule.create({
            capsuleName,
            description,
            ownerId,
            unlockDate,
            decodeKey,
            capsuleDataLink,
        });

        // Associate Editors & Viewers using many-to-many relationships
        if (editorUsers.length) await capsule.addEditors(editorUsers);
        if (viewerUsers.length) await capsule.addViewers(viewerUsers);

        res.status(201).json({ message: "Capsule created successfully", capsuleId: capsule.id });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
};

export const updateUnlockDate = async (req, res) => {
    try {
        const { capsuleId, newUnlockDate } = req.body;
        const ownerId = req.user.id;

        const capsule = await Capsule.findByPk(capsuleId);
        if (!capsule) return res.status(404).json({ message: "Capsule not found" });
        if (!capsule.canModify) return res.status(400).json({ message: "Cannot modify." });

        if (capsule.ownerId !== ownerId) return res.status(403).json({ message: "Not authorized" });

        if (new Date(capsule.unlockDate) > new Date()) {
            return res.status(400).json({ message: "Cannot update unlock date before previous date has passed" });
        }

        capsule.unlockDate = newUnlockDate;
        await capsule.save();

        res.status(200).json({ message: "Unlock date updated successfully" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
};

export const addEditorsViewers = async (req, res) => {
    try {
        const { capsuleId, newEditors = [], newViewers = [] } = req.body;
        const ownerId = req.user.id;

        const capsule = await Capsule.findByPk(capsuleId);

        if (!capsule) return res.status(404).json({ message: "Capsule not found" });
        if (capsule.ownerId !== ownerId) return res.status(403).json({ message: "Not authorized" });
        if (!capsule.canModify) return res.status(400).json({ message: "Cannot modify." });

        // Fetch users in parallel
        const [editorUsers, viewerUsers] = await Promise.all([
            User.findAll({ where: { email: newEditors } }),
            User.findAll({ where: { email: newViewers } }),
        ]);

        // Add new Editors & Viewers
        if (editorUsers.length) await capsule.addEditors(editorUsers);
        if (viewerUsers.length) await capsule.addViewers(viewerUsers);

        res.status(200).json({ message: "Editors/Viewers updated successfully" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
};


export const getUserCapsules = async (req, res) => {
    try {
        const userId = req.user.id;

        const capsules = await Capsule.findAll({
            attributes: ["id", "capsuleName", "description", "isLocked", "canModify", "unlockDate"], // Select only required fields
            include: [
                {
                    model: User,
                    as: "Editors",
                    attributes: [], // Exclude user details
                    through: { attributes: [] }, // Exclude join table data
                },
                {
                    model: User,
                    as: "Viewers",
                    attributes: [],
                    through: { attributes: [] },
                },
            ],
            where: {
                [Op.or]: [
                    { ownerId: userId },
                    { "$Editors.id$": userId },
                    { "$Viewers.id$": userId },
                ],
            },
        });

        res.status(200).json({ capsules });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
};


export const uploadCapsuleData = async (req, res) => {
    try {
        if (!req.files || req.files.length === 0) {
            return res.status(400).json({ message: "No files uploaded" });
        }

        const { capsuleId } = req.body;
        
        const userId = req.user.id; // Current user

        const capsule = await Capsule.findByPk(capsuleId, {
            include: [{ model: User, as: "Editors", attributes: ["id"] }],
        });

        if (!capsule) return res.status(404).json({ message: "Capsule not found" });

        // Check if user is the Owner or an Editor
        const isOwner = capsule.ownerId === userId;
        const isEditor = capsule.Editors.some((editor) => editor.id === userId);

        if (!isOwner && !isEditor) {
            return res.status(403).json({ message: "Not authorized to upload files" });
        }

        const ownerId = capsule.ownerId;
        const fileUrls = await uploadFilesToR2(req.files, ownerId);
        const folderUrl = `${process.env.R2_ENDPOINT}/${process.env.R2_BUCKET_NAME}/${ownerId}/files/`;

        capsule.capsuleDataLink = folderUrl;
        await capsule.save();

        res.status(200).json({ message: "Files uploaded successfully" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Upload failed" });
    }
};


export const lockCapsule = async (req, res) => {
    try {
        const { capsuleId } = req.body;
        const ownerId = req.user.id;

        const capsule = await Capsule.findByPk(capsuleId);
        if (!capsule) return res.status(404).json({ message: "Capsule not found" });
        if (!capsule.canModify) return res.status(400).json({ message: "Cannot modify." });

        if (capsule.ownerId !== ownerId) return res.status(403).json({ message: "Not authorized" });

        // Lock the capsule if unlockDate is in the future
        if (new Date(capsule.unlockDate) > new Date()) {
            capsule.isLocked = true;
            capsule.canModify = false;
            await capsule.save();
            res.status(200).json({ message: "Capsule locked successfully" });
        } else {
            res.status(400).json({ message: "Unlock date has already passed" });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
};
