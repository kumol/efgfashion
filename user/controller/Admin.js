const mongoose = require("mongoose");
const { success, failure, notFound, notModified } = require("../../common/helper/responseStatus");
const Admin = require("../../models/user/Admin");

class AdminController {
    async addNewAdmin(req,res){
        try{
            let admin = new Admin({
                ...req.body
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
            const admin = await Admin.findOne({_id: req.params.id})
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
            let updateObj = req.body;
            const modified = await Admin.updateOne({
                _id: mongoose.Types.ObjectId(req.params.id)
            },{$set: updateObj}).exec();
            return modified.n
                ? modified.nModified
                ? success(res, "Successfully updated") 
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
            return success(res, "Successfully deleted", {});
        }catch(error){
            return failure(res, error.message, error);
        }
    }
}

module.exports = new AdminController();