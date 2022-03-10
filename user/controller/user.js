const mongoose = require("mongoose");
const { success, failure, notFound } = require("../../common/helper/responseStatus");
const User = require("../../models/user/user");
const bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');
const {FileUpload} = require("../../common/helper/index");
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
            const uploadFile = file ? await FileUpload(file.image, "./uploads/user/", user._id) : null;
            uploadFile ? user.image = uploadFile : null;
            user = await user.save();

            const token = jwt.sign({ 
                id: user._id,
                email: user.email,
                phone: user.phone,
                name: user.name,
                image: user.image
            }, process.env.JWT_SECRET , { expiresIn: '1h' });
            return success(res, "User registered", {token: token});
        }catch(error){
            return failure(res, error.message, error);
        }
    }


    async getUser(req,res){
        try{
            let page = req.query.page || 1;
            let limit = req.query.limit || 10;
            let total = await User.countDocuments({});
            const user = await User.find({})
                .sort({_id: -1})
                .skip((page-1)*limit)
                .limit(limit);
            return user ? success(res, "User fetched", {
                page: page,
                limit: limit,
                total: total,
                user
            })
                : notFound(res, "No user found", {
                    page: page,
                    limit: limit,
                    total: total,
                    user: []
                });
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
    async editUser(req,res,next){
        try{
            let {id} = req.params;
            let userId = req.user.id;
            let userPhone = req.user.phone;
            let selectedUser = await User.findOne({_id: mongoose.Types.ObjectId(userId)});
            if(selectedUser.phone != userPhone){
                return res.status(403).json({
                    status: false,
                    message: 'You have no access.'
                })
            }
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
            phone ? body.phone = phone : null;
            email ? body.email = email : null;
            let hashPassword ;
            password ? hashPassword = await bcrypt.hash(password, 10) : null;
            hashPassword ? body.password = hashPassword : null;
            
            const uploadFile = file ? await FileUpload(file.image, "./uploads/user/", id) : null;
            uploadFile ? body.image = uploadFile : null;

            let modified = body ? await User.updateOne({_id: mongoose.Types.ObjectId(id)}, {$set: body}) : {modifiedCount: 0, matchedCount: 1};
            let user = await User.findOne({_id: mongoose.Types.ObjectId(id)}).lean();
            return modified.matchedCount 
                ? modified.modifiedCount
                ? success(res, "Successfull Updated user", user)
                : notModified(res, "Not modified", user)
                : notFound(res, "No user found", {});
        }catch(error){
            return failure(res, error.message, error);
        }
    }
    async getSingleUser(req,res,next){
        try{
            let {id} = req.params;
            let user = await User.findOne({_id: mongoose.Types.ObjectId(id)}).lean();
            return user
                ? success(res, "Fetched user ", user)
                : failure(res, "No user found", {});
        }catch(error){
            return failure(res, error.message, error);
        }
    }
}


module.exports = new UserController();