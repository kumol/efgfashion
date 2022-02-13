const { success, failure } = require("../../common/helper/responseStatus");
const Admin = require("../../models/user/Admin");
const bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');

const logIn = async(req,res,next)=>{
    try{
        const {email, password} = req.body;
        if(!email || !password) return res.json({success: false, statusCode: 400, message: "Email and password required"});
        const admin = await Admin.findOne({email: email}).populate({
            path: "role",
            select: "rights"
        }).select("email name phone role password");
        if(!admin){
            return res.json({
                success: false,
                statusCode: 404,
                message: "Wrong email address"
            });
        }

        const passwordMatch = bcrypt.compareSync(password, admin.password);
        if(!passwordMatch) return res.json({success: false, statusCode: 404, message: "Wrong password"});

        const rights = admin.role.rights || [];
        const token = jwt.sign({ id: admin._id, email: admin.email, phone: admin.phone, name: admin.name, role: rights}, process.env.SECRET , { expiresIn: '1h' });
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
    logIn, resetPassword
}