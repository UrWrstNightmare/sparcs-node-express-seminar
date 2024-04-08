const authMiddleware = (req, res, next) => {
    if (req.body.ID === process.env.Username && req.body.PW === process.env.Password ) {
        console.log("[AUTH-MIDDLEWARE] Authorized User");
        next();
    }
    else {
        console.log("[AUTH-MIDDLEWARE] Not Authorized User");
        res.status(401).json({ error: "Not Authorized" });
    }
}

module.exports = authMiddleware;