const authMiddleware = (req, res, next) => {
    const json = process.env.ACCOUNT;
    const obj = JSON.parse(json);
    if (req.body.id === obj.id && req.body.pw === obj.pw) {
        console.log("[AUTH-MIDDLEWARE] Authorized User");
        console.log(obj.id);
        next();
    }
    else {
        console.log("[AUTH-MIDDLEWARE] Not Authorized User");
        res.status(401).json({ error: "Not Authorized" });
    }
}

module.exports = authMiddleware;