import { Op } from "sequelize";
import crypto from "crypto";
import { deleteFromCloud, uploadFilesToR2 } from "../utils/cloudflareR2.js";
import { User, Capsule } from "../models/index.js";

export const createCapsule = async (req, res) => {
    try {
        const { capsuleName, description, editors = [], viewers = [], unlockDate, isPublic } = req.body;
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
            isPublic,
            capsuleDataLink,
        });

        // Associate Editors & Viewers using many-to-many relationships
        if (!isPublic && editorUsers.length) await capsule.addEditors(editorUsers);
        if (!isPublic && viewerUsers.length) await capsule.addViewers(viewerUsers);

        res.status(201).json({ message: "Capsule created successfully", capsuleId: capsule.id });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
};

export const updateCapsule = async (req, res) => {
    try {
        const { capsuleId, unlockDate, newEditors = [], newViewers = [] } = req.body;
        const ownerId = req.user.id;

        const capsule = await Capsule.findByPk(capsuleId);
        if (!capsule) return res.status(404).json({ message: "Capsule not found" });
        if (capsule.ownerId !== ownerId) return res.status(403).json({ message: "Not authorized" });
        if (!capsule.canModify) return res.status(400).json({ message: "Cannot modify capsule" });

        const updates = {}; // Store fields to update

        // Update Unlock Date if provided
        if (unlockDate) {
            console.log("Unlock Date:", new Date(unlockDate).toISOString());
            console.log("Current Date:", new Date().toISOString());

            if (new Date(unlockDate) < new Date()) {
                return res.status(400).json({ message: "Date has already passed" });
            }
            updates.unlockDate = unlockDate;
        }

        // Update Editors & Viewers if provided
        if (newEditors.length || newViewers.length) {
            const [editorUsers, viewerUsers] = await Promise.all([
                User.findAll({ where: { email: newEditors } }),
                User.findAll({ where: { email: newViewers } }),
            ]);

            if (editorUsers.length) await capsule.addEditors(editorUsers);
            if (viewerUsers.length) await capsule.addViewers(viewerUsers);
        }

        // Apply updates
        await capsule.update(updates);

        res.status(200).json({ message: "Capsule updated successfully" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
};



export const getUserCapsules = async (req, res) => {
    try {
        const userId = req.user.id;

        const capsules = await Capsule.findAll({
            attributes: ["id", "capsuleName", "description", "isLocked", "canModify", "unlockDate", "isPublic"], // Select only required fields
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
        const userId = req.user.id;

        const capsule = await Capsule.findByPk(capsuleId, {
            include: [{ model: User, as: "Editors", attributes: ["id"] }],
        });

        if (!capsule) return res.status(404).json({ message: "Capsule not found" });

        const isOwner = capsule.ownerId === userId;
        const isEditor = capsule.Editors.some((editor) => editor.id === userId);
        const isPublic = capsule.isPublic;

        if (!isOwner && !isEditor && !isPublic) {
            return res.status(403).json({ message: "Not authorized to upload files" });
        }

        const fileUrls = await uploadFilesToR2(req.files, capsuleId);
        const folderUrl = `${process.env.R2_ENDPOINT}/${process.env.R2_BUCKET_NAME}/${capsuleId}/files/`;

        if (isPublic) {
            // Check if user is already a viewer
            const existingViewers = await capsule.getViewers({ attributes: ["id"] });
            const viewerIds = existingViewers.map((viewer) => viewer.id);

            if (!viewerIds.includes(userId)) {
                const user = await User.findByPk(userId);
                if (user) await capsule.addViewer(user);
            }
        }

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

        if (new Date(capsule.unlockDate).getTime() > Date.now()) {
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

export const deleteCapsule = async (req, res) => {
    try {
        const { capsuleId } = req.body;
        const ownerId = req.user.id;

        const capsule = await Capsule.findByPk(capsuleId);
        if (!capsule) return res.status(404).json({ message: "Capsule not found" });
        if (capsule.ownerId !== ownerId) return res.status(403).json({ message: "Not authorized" });

        if (capsule.capsuleDataLink) {
            await deleteFromCloud(capsuleId);
        }
        await capsule.destroy();

        res.status(200).json({ message: "Capsule deleted successfully" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
};

export const getAllPublicCapsules = async (req, res) => {
    try {

        const publicCapsules = await Capsule.findAll({
            attributes: ["id", "capsuleName", "description", "isLocked", "canModify", "unlockDate", "isPublic"],
            where: { isPublic: true }, // Fetch only public capsules
        });
        
        res.status(200).json({ capsules: publicCapsules });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
};
