import User from "./User.js"
import Capsule from "./Capsule.js"
import sequelize from "../config/db.js";

const CapsuleEditor = sequelize.define("CapsuleEditor", {});
const CapsuleViewer = sequelize.define("CapsuleViewer", {});

// Many-to-Many Relationships
User.belongsToMany(Capsule, { through: CapsuleEditor, as: "EditingCapsules" });
Capsule.belongsToMany(User, { through: CapsuleEditor, as: "Editors" });

User.belongsToMany(Capsule, { through: CapsuleViewer, as: "ViewingCapsules" });
Capsule.belongsToMany(User, { through: CapsuleViewer, as: "Viewers" });

// Owner Relationship
User.hasMany(Capsule, { foreignKey: "ownerId", onDelete: "CASCADE" });
Capsule.belongsTo(User, { foreignKey: "ownerId" });

export { User, Capsule, CapsuleEditor, CapsuleViewer };
