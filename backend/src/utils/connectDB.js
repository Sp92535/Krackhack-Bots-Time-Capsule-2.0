import sequelize from "../config/db.js";
import { User, Capsule } from "../models/index.js"

const connectDB = async () => {
    try {
        await sequelize.authenticate();
        console.log("PostgreSQL Connected");

        await sequelize.sync({ force: false});
        console.log("Database synced");

    } catch (err) {
        console.error("DB Connection Error:", err);
    }
}

export default connectDB;