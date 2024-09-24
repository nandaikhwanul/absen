import { Sequelize } from "sequelize";
import db from "../config/database.js";

const { DataTypes } = Sequelize;

// Define the Users model with NIP, nama, email, password, refresh_token, last_login, and last_logout
const Users = db.define('users', {
    nip: {
        type: DataTypes.STRING,    // NIP as a string
        allowNull: false,          // Prevent null values
        unique: true               // Ensure NIP is unique
    },
    nama: {
        type: DataTypes.STRING,     // Nama as a string
        allowNull: false            // Prevent null values
    },
    email: {
        type: DataTypes.STRING,     // Email as a string
        allowNull: false,           // Prevent null values
        unique: true,               // Ensure email is unique
        validate: {
            isEmail: true           // Validate email format
        }
    },
    password: {
        type: DataTypes.STRING,     // Password as a string
        allowNull: false            // Prevent null values
    },
    refresh_token: {
        type: DataTypes.TEXT,       // Refresh token as text (can be long)
        allowNull: true             // Can be null initially
    },
    last_login: {
        type: DataTypes.DATE,       // Date of last login
        allowNull: true             // Can be null if the user hasn't logged in
    },
    last_logout: {
        type: DataTypes.DATE,       // Date of last logout
        allowNull: true             // Can be null if the user hasn't logged out yet
    }
}, {
    freezeTableName: true          // Prevent Sequelize from pluralizing the table name
});

export default Users;

// Uncomment this to sync with the database (create table if it doesn't exist)
// (async () => {
//     await Users.sync({ alter: true }); // Use 'alter: true' to update the table with new columns
// })();
