require('dotenv').config()

const authMiddleware = (req, res, next) => {
    if (req.body.credentialID === process.env.id && req.body.credentialPW === process.env.pw) {
        console.log("[AUTH-MIDDLEWARE] Authorized User");
        next();
    }
    else {
        console.log(process.env.id, process.env.pw);
        console.log("[AUTH-MIDDLEWARE] Not Authorized User");
        res.status(401).json({ error: "Not Authorized" });
    }
}

module.exports = authMiddleware;