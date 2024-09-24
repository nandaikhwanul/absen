import Users from "../models/UserModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { validationResult } from "express-validator";
import { Op } from "sequelize";

// Get all users with NIP, nama, email, last_login, last_logout
export const getUsers = async (req, res) => {
    try {
        const users = await Users.findAll({
            attributes: ['id', 'nip', 'nama', 'email', 'last_login', 'last_logout'] // Updated to include last_login and last_logout
        });
        res.json(users);
    } catch (error) {
        console.log(error);
        res.status(500).json({ msg: "Server error" });
    }
}

// Get user by ID
export const getUserById = async (req, res) => {
    const { id } = req.params; // Mengambil ID dari parameter rute
    try {
        const user = await Users.findOne({ where: { id } }); // Mengambil pengguna berdasarkan ID
        if (!user) return res.status(404).json({ msg: "User not found" });
        res.json(user);
    } catch (error) {
        console.log(error);
        res.status(500).json({ msg: "Server error" });
    }
}



// Register user
export const Register = async (req, res) => {
    const { nip, nama, email, password, confPassword } = req.body;

    if (password !== confPassword) return res.status(400).json({ msg: "Password tidak sama" });

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const existingEmail = await Users.findOne({ where: { email } });
    const existingNip = await Users.findOne({ where: { nip } });

    if (existingEmail) return res.status(400).json({ msg: "Email sudah terdaftar" });
    if (existingNip) return res.status(400).json({ msg: "NIP sudah terdaftar" });

    const salt = await bcrypt.genSalt();
    const hashPassword = await bcrypt.hash(password, salt);

    try {
        await Users.create({
            nip,
            nama,
            email,
            password: hashPassword
        });
        res.json({ msg: "Daftar Berhasil" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ msg: "Server error" });
    }
}

// Login user
export const Login = async (req, res) => {
    try {
        const user = await Users.findOne({ where: { nip: req.body.nip } });

        if (!user) return res.status(400).json({ msg: "NIP tidak ditemukan" });

        const match = await bcrypt.compare(req.body.password, user.password);
        if (!match) return res.status(400).json({ msg: "Wrong password" });

        const userId = user.id;
        const nama = user.nama;
        const email = user.email;

        const accessToken = jwt.sign({ userId, nama, email }, process.env.ACCESS_TOKEN_SECRET, {
            expiresIn: '15s' // Token expires in 15 seconds
        });
        const refreshToken = jwt.sign({ userId, nama, email }, process.env.REFRESH_TOKEN_SECRET, {
            expiresIn: '1d' // Refresh token expires in 1 day
        });

        // Update last_login field on successful login
        await Users.update({
            refresh_token: refreshToken,
            last_login: new Date() // Store current timestamp
        }, { where: { id: userId } });

        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            maxAge: 24 * 60 * 60 * 1000,
        });

        // Verify the access token after it's created
        jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
            if (err) return res.status(403).json({ msg: "Token verification failed" });
            
            // If verification is successful, respond with the access token
            res.json({ accessToken });
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ msg: "Server error" });
    }
}



// Logout user
export const Logout = async (req, res) => {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) return res.sendStatus(204);

    const user = await Users.findOne({ where: { refresh_token: refreshToken } });
    if (!user) return res.sendStatus(204);

    // Update last_logout field on logout
    await Users.update({
        refresh_token: null,
        last_logout: new Date() // Store current timestamp
    }, { where: { id: user.id } });

    res.clearCookie('refreshToken');
    return res.sendStatus(200);
}


// Search users by NIP, nama, or email
export const searchUsers = async (req, res) => {
    const page = parseInt(req.query.page) || 0;
    const limit = parseInt(req.query.limit) || 10;
    const search = req.query.search_query || "";
    const offset = limit * page;

    const totalRows = await Users.count({
        where: {
            [Op.or]: [
                { nama: { [Op.like]: '%' + search + '%' } },
                { email: { [Op.like]: '%' + search + '%' } },
                { nip: { [Op.like]: '%' + search + '%' } }
            ]
        }
    });
    const totalPage = Math.ceil(totalRows / limit);
    const result = await Users.findAll({
        where: {
            [Op.or]: [
                { nama: { [Op.like]: '%' + search + '%' } },
                { email: { [Op.like]: '%' + search + '%' } },
                { nip: { [Op.like]: '%' + search + '%' } }
            ]
        },
        offset,
        limit,
        order: [['id', 'DESC']]
    });
    res.json({
        result,
        page,
        limit,
        totalRows,
        totalPage
    });
}
