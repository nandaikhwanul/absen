import express from "express";
import { getUsers, Register, Login, Logout, searchUsers, getUserById } from "../controllers/Users.js";
import { verifyToken } from "../middleware/VerifyToken.js";
import { refreshToken } from "../controllers/RefreshToken.js";

const router = express.Router();

// Endpoints
router.get('/users', verifyToken, getUsers);
router.get('/user/:id', verifyToken, getUserById); // Rute baru untuk mendapatkan pengguna berdasarkan ID
router.post('/users', Register);
router.post('/login', Login);
router.get('/token', refreshToken);
router.delete('/logout', Logout);
router.get('/search', searchUsers);

export default router;
