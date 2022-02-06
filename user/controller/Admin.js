const mongoose = require("mongoose");
const { success, failure, notFound, notModified } = require("../../common/helper/responseStatus");
const Admin = require("../../models/user/Admin");
const bcrypt = require('bcryptjs');

class AdminController {
    async addNewAdmin(req,res){
        try{
            let {email, phone, password, ...body} = req.body;
            const existEmail = await Admin.countDocuments({ email: email });
            if (existEmail){
                return res.status(422).json({
                    status: false,
                    message: 'Email already used.'
                })
            }
            const existPhone = await Admin.countDocuments({ phone: phone });
            if (existPhone){
                return res.status(422).json({
                    status: false,
                    message: 'Phone already used.'
                })
            }

            const hashPassword = await bcrypt.hash(password, 10);
            body.password = hashPassword;
            body.email = email;
            body.phone = phone;

            let admin = new Admin({
                ...body
            });
            admin = await admin.save();
            return success(res, "Admin created", admin);
        }catch(error){
            return failure(res, error.message, error);
        }
    }
    async getAllAdmin(req,res){
        try{
            const admin = await Admin.find({})
                .populate({
                    path: "role",
                    select: "rights role"
                })
                .exec();
            return admin 
                ? success(res, "Fetched All Admin", admin)
                : notFound(res, "No Admin found", []);
        }catch(error){
            return failure(res, error.message, error);
        }
    }
    async getSingleAdmin(req,res){
        try{
            const admin = await Admin.findOne({_id: mongoose.Types.ObjectId(req.params.id)})
                .populate({
                    path: "role",
                    select: "rights role"
                })
                .exec();
            return admin 
                ? success(res, "Fetched Admin", admin)
                : notFound(res, "No Admin found", []);
        }catch(error){
            return failure(res, error.message, error);
        }
    }
    async editAdmin(req,res){
        try{
            let {email, phone, password, updateObj={}} = req.body;
            const existEmail = await Admin.countDocuments({ email: email });
            if (existEmail){
                return res.status(422).json({
                    status: false,
                    message: 'Email already used.'
                })
            }
            const existPhone = await Admin.countDocuments({ phone: phone });
            if (existPhone){
                return res.status(422).json({
                    status: false,
                    message: 'Phone already used.'
                })
            }
            password ? password = await bcrypt.hash(password, 10) : null;
            password ? updateObj.password = password : null;
            email ? updateObj.email = email : null;
            phone ? updateObj.phone = phone : null;

            const modified = await Admin.updateOne({
                _id: mongoose.Types.ObjectId(req.params.id)
            },{$set: updateObj}).lean().exec();
            
            return modified.matchedCount
                ? modified.modifiedCount
                ? success(res, "Successfully updated", modified) 
                : notModified(res, "Not modified", {})
                : notFound(res, "No content found", {});
        }catch(error){
            return failure(res, error.message, error);
        }
    }
    async deleteAdmin(req,res){
        try{
            const deleted = await Admin.deleteOne({
                _id: mongoose.Types.ObjectId(req.params.id)
            });
            return deleted.deletedCount 
                ? success(res, "Successfully deleted", deleted)
                : notModified(res, "Not deleted", {});
        }catch(error){
            return failure(res, error.message, error);
        }
    }
}

module.exports = new AdminController();