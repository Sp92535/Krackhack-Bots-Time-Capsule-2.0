import cron from "node-cron";
import { Capsule } from "../models/index.js";
import { Op } from "sequelize";

// Run every minute
cron.schedule("* * * * *", async () => {
    try {
        console.log("Running unlock capsule cron job...");

        // Find all locked capsules where unlockDate has passed
        const updatedCapsules = await Capsule.update(
            { isLocked: false }, // Unlock the capsules
            {
                where: {
                    isLocked: true,
                    unlockDate: { [Op.lt]: new Date() }, // unlockDate < now
                },
            }
        );

        console.log(`Unlocked ${updatedCapsules[0]} capsules.`);
    } catch (err) {
        console.error("Error in unlock capsule cron job:", err);
    }
});
