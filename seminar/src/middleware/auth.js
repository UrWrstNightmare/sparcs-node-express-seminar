const authMiddleware = (req, res, next) => {
    console.log(process.env)
    if (req.body.id === process.env.USER && req.body.pw === process.env.USER) {
        console.log("[AUTH-MIDDLEWARE] Authorized User");
        next();
    }
    else {
        console.log("[AUTH-MIDDLEWARE] Not Authorized User");
        res.status(401).json({ error: "Not Authorized" });
    }
}

module.exports = authMiddleware;