const authMiddleware = (req, res, next) => {
    const {ID, PW }=req.body;
    if (ID === process.env.API_ID && PW === process.env.API_PW){
        console.log("[AUTH-MIDDLEWARE] Authorized User");
        next();
    }
        
}

module.exports = authMiddleware;