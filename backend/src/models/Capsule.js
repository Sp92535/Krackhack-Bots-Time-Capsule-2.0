import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const Capsule = sequelize.define("Capsule", {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    capsuleName: {
        type: DataTypes.STRING,
        allowNull: false
    },
    description: {
        type: DataTypes.STRING,
    },
    ownerId: {
        type: DataTypes.UUID,
        allowNull: false,
    },
    isLocked: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    canModify:{
        type: DataTypes.BOOLEAN,
        defaultValue: true
    },
    unlockDate: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
    },
    decodeKey: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    isPublic:{
        type: DataTypes.STRING,
        allowNull: false
    },
    capsuleDataLink: {
        type: DataTypes.STRING,
        allowNull: false, // Cloud flare storage link
    },
});

export default Capsule;
