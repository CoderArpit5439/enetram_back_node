// models/index.js

import { sequelize } from "../config/db.config.js";
import { UserModel } from "./user.model.js"; // Make sure this file also exists

const db = {};
db.sequelize = sequelize;
db.User = UserModel(sequelize);

// Sync DB (auto-create tables)
db.sequelize.sync({ alter: true })
  .then(() => console.log("✅ DB synced successfully"))
  .catch((err) => console.error("❌ DB sync failed:", err));

export default db;
