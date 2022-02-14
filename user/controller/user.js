const mongoose = require("mongoose");
const { success, failure } = require("../../common/helper/responseStatus");
const User = require("../../models/user/user");
const bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');

class UserController {
    async registerUser(req,res){
        try{
            const file = req.files;
            let {password, email, phone, ...body} = req.body;
            const existEmail = await User.countDocuments({ email: email });
            if (existEmail){
                return res.status(422).json({
                    status: false,
                    message: 'Email already used.'
                })
            }
            const existPhone = await User.countDocuments({ phone: phone });
            if (existPhone){
                return res.status(422).json({
                    status: false,
                    message: 'Phone already used.'
                })
            }
            body.phone = phone;
            body.email = email;
            const hashPassword = await bcrypt.hash(password, 10);
            body.password = hashPassword;
            let user = new User(body);
            const uploadFile = file ? await FileUpload(file.image, "./upload/user/", user._id) : null;
            uploadFile ? user.image = uploadFile : null;
            user = await user.save();
            const token = jwt.sign({ 
                id: user._id,
                email: user.email,
                phone: user.phone,
                name: user.name,
                image: user.image
            }, process.env.SECRET , { expiresIn: '1h' });
            return success(res, "User registered", {token: token});
        }catch(error){
            return failure(res, error.message, error);
        }
    }


    async getUser(req,res){
        try{
            const user = await User.find({});
            return res.status(200).json(success("User fetched", user));
        }catch(error){
            return res.status(500).json(failure(error.message, error));
        }
    }

    async deleteUser(req,res){
        try{
            const { id } = req.params;
            const deleted = await User.deleteOne({_id: mongoose.Types.ObjectId(id)});
            return deleted.deletedCount 
                ? success(res, "Successfully deleted", deleted)
                : notModified(res, "Not deleted", {});
        }catch(error){
            return failure(res, error.message, error);
        }
    }
}

module.exports = new UserController();