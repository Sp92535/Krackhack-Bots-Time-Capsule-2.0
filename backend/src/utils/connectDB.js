import sequelize from "../config/db.js";
import User from "../models/User.js";

const connectDB = async () => {
    try {
        await sequelize.authenticate();
        console.log("PostgreSQL Connected");

        await sequelize.sync({ force: true });
        console.log("Database synced");

    } catch (err) {
        console.error("DB Connection Error:", err);
    }
}

export default connectDB;