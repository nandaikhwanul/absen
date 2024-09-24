import Users from "../models/UserModel.js";
import jwt from "jsonwebtoken";

export const refreshToken = async (req, res) => {
    try {
        const refreshToken = req.cookies.refreshToken;
        if (!refreshToken) return res.sendStatus(401);

        const user = await Users.findOne({ where: { refresh_token: refreshToken } });
        if (!user) return res.sendStatus(403);

        jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, decoded) => {
            if (err) return res.sendStatus(403);
            const userId = user.id;
            const nama = user.nama;
            const email = user.email;
            const nip = user.nip; // Get nip from the user object

            const accessToken = jwt.sign({ userId, nama, email, nip }, process.env.ACCESS_TOKEN_SECRET, {
                expiresIn: '60s'
            });
            res.json({ accessToken });
        });
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
}
