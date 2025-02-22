import { S3Client, PutObjectCommand, GetObjectCommand, ListObjectsV2Command } from "@aws-sdk/client-s3";
import dotenv from "dotenv";
import { User, Capsule } from "../models/index.js";

dotenv.config();

const s3 = new S3Client({
    region: "auto",
    endpoint: process.env.R2_ENDPOINT,
    credentials: {
        accessKeyId: process.env.R2_ACCESS_KEY_ID,
        secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
    },
});

export const uploadFilesToR2 = async (files, ownerId) => {
    try {
        const uploadPromises = files.map(async (file) => {
            const filePath = `${ownerId}/files/${file.originalname}`;

            const params = {
                Bucket: process.env.R2_BUCKET_NAME,
                Key: filePath,
                Body: file.buffer,
                ContentType: file.mimetype,
            };

            await s3.send(new PutObjectCommand(params));
            return `${process.env.R2_ENDPOINT}/${process.env.R2_BUCKET_NAME}/${filePath}`;
        });

        const fileUrls = await Promise.all(uploadPromises);
        return fileUrls;
    } catch (error) {
        console.error("R2 Upload Error:", error);
        throw error;
    }
};


export const streamCapsuleFiles = async (req, res) => {
    try {
        const { capsuleId } = req.params;

        // Fetch capsule
        const capsule = await Capsule.findByPk(capsuleId);
        if (!capsule) return res.status(404).json({ message: "Capsule not found" });

        // Check access permissions
        if (capsule.isLocked || capsule.canModify) {
            return res.status(403).json({ message: "Access denied" });
        }

        // Folder path in R2
        const folderPath = `${capsule.ownerId}/files/`;

        // List all files in the folder
        const listParams = { Bucket: process.env.R2_BUCKET_NAME, Prefix: folderPath };
        const { Contents } = await s3.send(new ListObjectsV2Command(listParams));

        if (!Contents || Contents.length === 0) {
            return res.status(404).json({ message: "No files found" });
        }

        // Fetch file streams
        const filesData = await Promise.all(
            Contents.map(async (file) => {
                const getParams = { Bucket: process.env.R2_BUCKET_NAME, Key: file.Key };
                const { Body, ContentType } = await s3.send(new GetObjectCommand(getParams));

                // Read file stream into a buffer
                const chunks = [];
                for await (const chunk of Body) {
                    chunks.push(chunk);
                }
                const fileBuffer = Buffer.concat(chunks);

                // Convert to Base64 for frontend display
                return {
                    fileName: file.Key.split("/").pop(),
                    contentType: ContentType,
                    data: `data:${ContentType};base64,${fileBuffer.toString("base64")}`,
                };
            })
        );

        // Send JSON response with all file data
        res.status(200).json({ files: filesData });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Error fetching files" });
    }
};
