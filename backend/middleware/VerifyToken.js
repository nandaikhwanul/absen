import jwt from "jsonwebtoken";

export const verifyToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (token == null) return res.sendStatus(401);

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
        if (err) return res.sendStatus(403);
        
        // Attach decoded properties to the request object
        req.email = decoded.email;
        req.nama = decoded.nama;
        req.nip = decoded.nip; // Include nip here

        next();
    });
};
