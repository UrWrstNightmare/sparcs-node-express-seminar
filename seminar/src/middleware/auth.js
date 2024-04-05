const authMiddleware = (req, res, next) => {
    if ((req.body.credentialID == process.env.USERNAME) && (req.body.credentialPW == process.env.PASSWORD)) {
        console.log("[AUTH-MIDDLEWARE] Authorized User");
        next();
    }
    else {
        console.log("[AUTH-MIDDLEWARE] Not Authorized User");
        res.status(401).json({ error: "Not Authorized" });
    }
}

module.exports = authMiddleware;