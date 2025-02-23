import cron from "node-cron";
import { Capsule, User } from "../models/index.js";
import { Op } from "sequelize";
import { sendUnlockNotification } from "./sendEmail.js";

cron.schedule("* * * * *", async () => {
    try {
        console.log("Running unlock capsule cron job...");

        // Find all locked capsules where unlockDate has passed
        const capsulesToUnlock = await Capsule.findAll({
            where: {
                isLocked: true,
                unlockDate: { [Op.lt]: new Date() },
            },
            include: [
                { 
                    model: User,
                    as: "Editors",
                    attributes: ["email"],
                    through: { attributes: [] }
                },
                { 
                    model: User,
                    as: "Viewers",
                    attributes: ["email"],
                    through: { attributes: [] }
                },
                { 
                    model: User,
                    foreignKey: "ownerId",
                    attributes: ["email"]
                }
            ],
        });

        if (capsulesToUnlock.length === 0) {
            console.log("No capsules to unlock.");
            return;
        }

        // Unlock the capsules
        await Capsule.update(
            { isLocked: false },
            {
                where: {
                    id: capsulesToUnlock.map((capsule) => capsule.id),
                },
            }
        );

        console.log(`Unlocked ${capsulesToUnlock.length} capsules.`);

        // Send email notifications
        for (const capsule of capsulesToUnlock) {
            const recipients = [
                capsule.User?.email,  // Owner's email
                ...capsule.Editors.map((user) => user.email),
                ...capsule.Viewers.map((user) => user.email),
            ].filter(Boolean);

            if (recipients.length > 0) {
                await sendUnlockNotification(
                    recipients,
                    "Capsule Unlocked!",
                    "A new capsule is ready to open on Timeless Treasures!"
                );
            }
        }
    } catch (err) {
        console.error("Error in unlock capsule cron job:", err);
    }
});