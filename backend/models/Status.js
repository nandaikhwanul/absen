import { Sequelize } from "sequelize";
import db from "../config/database.js";
import Users from "./UserModel.js"; // Adjust the path if necessary

const { DataTypes } = Sequelize;

// Define the UserSessions model for tracking login and logout activities
const UserSessions = db.define('user_sessions', {
    userId: {
        type: DataTypes.INTEGER,     // Reference to the user's ID
        allowNull: false,
        references: {
            model: Users,            // Reference to the Users model
            key: 'id'
        }
    },
    login_time: {
        type: DataTypes.DATE,       // Date and time of login
        allowNull: false            // Must have a value
    },
    logout_time: {
        type: DataTypes.DATE,       // Date and time of logout
        allowNull: true             // Can be null if the user hasn't logged out yet
    }
}, {
    freezeTableName: true          // Prevent Sequelize from pluralizing the table name
});

export default UserSessions;

// Uncomment this to sync with the database (create table if it doesn't exist)
(async () => {
    await UserSessions.sync({ alter: true }); // Use 'alter: true' to update the table with new columns
})();
