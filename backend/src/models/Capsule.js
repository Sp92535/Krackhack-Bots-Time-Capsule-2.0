import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const Capsule = sequelize.define("Capsule", {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    ownerId: {
        type: DataTypes.UUID,
        allowNull: false,
    },
    lockDate: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
    },
    unlockDate: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
    },
    decodeKey: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    capsuleDataLink: {
        type: DataTypes.STRING,
        allowNull: false, // Firebase storage link
    },
});

export default Capsule;
