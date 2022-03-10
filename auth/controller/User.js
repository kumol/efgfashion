const bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');
const User = require('../../models/user/user');
const {failure, success} = require("../../common/helper/responseStatus")

const logIn = async(req,res,next)=>{
    try{
        const {email, phone, password} = req.body;
        if(!phone || !password) return res.json({success: false, statusCode: 400, message: "Email and password required"});
        
        let query = {};
        email ? query["email"] = email : null;
        phone ? query["phone"] = phone : null;
        const user = await User.findOne(query)
            .select("email name phone password");
        if(!user){
            
            return res.json({
                success: false,
                statusCode: 404,
                message: "Wrong phone or email address"
            });
        }

        const passwordMatch = bcrypt.compareSync(password, user.password);
        if(!passwordMatch) return res.json({success: false, statusCode: 404, message: "Wrong password"});

        const token = jwt.sign({ id: user._id, email: user.email, phone: user.phone, name: user.name}, process.env.JWT_SECRET , { expiresIn: '1h' });
        return success(res, "Login Successful", {token: token});
    }catch(error){
        return failure(res, "Failed login", {});
    }
}

const resetPassword = async(req,res,next)=>{
    try{

    }catch(error){

    }
}

module.exports = {
    logIn,
    resetPassword
}