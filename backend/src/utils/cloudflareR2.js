import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import dotenv from "dotenv";

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

