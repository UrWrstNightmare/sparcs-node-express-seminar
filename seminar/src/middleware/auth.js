const authMiddleware = (req, res, next) => {
    const { id, passwd } = req.body;
    if (id === process.env.ID && passwd === process.env.PASSWD) {
        console.log("[AUTH-MIDDLEWARE] Authorized User");
        next();
    }
    else {
        console.log("[AUTH-MIDDLEWARE] Not Authorized User");
        res.status(401).json({ error: "Not Authorized" });
    }
}

module.exports = authMiddleware;