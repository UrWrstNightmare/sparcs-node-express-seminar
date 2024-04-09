const authMiddleware = (req, res, next) => {
    key=process.env.API_KEY || process.env.USER;
    if (req.body.id === key && req.body.pw === key) {
        console.log("[AUTH-MIDDLEWARE] Authorized User");
        next();
    }
    else {
        console.log("[AUTH-MIDDLEWARE] Not Authorized User");
        res.status(401).json({ error: "Not Authorized" });
    }
}

module.exports = authMiddleware;