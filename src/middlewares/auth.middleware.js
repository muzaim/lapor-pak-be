const{ verifyToken } = require('../utils/jwt');
const userModel = require("../models/user.model");

async  function authenticateToken(req, res, next){
    const authHeader = req.headers ['authorization'];
    const token = authHeader && authHeader .split (' ')[1]

    if (!token){
        return res.status(401).json({message: 'acces token missing'});
    }

    try{
        const decoded = verifyToken(token);
        const user = await UserModel.finduserById(decoded.id);

        if (!user){
            return res.status(401).json ({message: 'user not found or invalid token'});
        }
        req.user = user;
        next();
    }catch (error){
        return res.status(401).json({message: 'invalid or expired token'});
    }

}
module.exports = authenticateToken;
