import { Op } from "sequelize";
import crypto from "crypto";
import { User, Capsule } from "../models/index.js";

export const createCapsule = async (req, res) => {
    try {
        const { editors = [], viewers = [], lockDate, unlockDate } = req.body;
        const ownerId = req.user.id;
        const decodeKey = crypto.randomBytes(32).toString("hex");

        // Fetch users in parallel
        const [editorUsers, viewerUsers] = await Promise.all([
            User.findAll({ where: { email: editors } }),
            User.findAll({ where: { email: viewers } }),
        ]);
        console.log(editorUsers);

        const capsuleDataLink = "link"; // Placeholder for Firebase upload logic

        const capsule = await Capsule.create({
            ownerId,
            lockDate,
            unlockDate,
            decodeKey,
            capsuleDataLink,
        });

        // Associate Editors & Viewers using many-to-many relationships
        if (editorUsers.length) await capsule.addEditors(editorUsers);
        if (viewerUsers.length) await capsule.addViewers(viewerUsers);

        res.status(201).json({ message: "Capsule created successfully", capsule });
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

        if (capsule.ownerId !== ownerId) return res.status(403).json({ message: "Not authorized" });

        if (new Date(capsule.unlockDate) > new Date()) {
            return res.status(400).json({ message: "Cannot update unlock date before previous date has passed" });
        }

        capsule.unlockDate = newUnlockDate;
        await capsule.save();

        res.status(200).json({ message: "Unlock date updated successfully", capsule });
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
            attributes: ["id", "lockDate", "unlockDate"], // Select only required fields
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
