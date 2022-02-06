const mongoose = require("mongoose");
const { success, failure, notFound, notModified } = require("../../common/helper/responseStatus");
const Role = require("../../models/user/Role");
class RoleController{
    async addNewRole(req,res){
        try{
            let role = new Role({
                ...req.body
            });
            role = await role.save();
            return success(res, "Role created", role);
        }catch(error){
            return failure(res, error.message, error.stack);
        }
    }
    async getRoles(req,res){
        try{
            const role = await Role.find({}).exec();
            return role 
                ? success(res, "Role Fetched", role) 
                : notFound(res, "Role not found", []);
        }catch(error){
            return failure(res, error.message, error.stack);
        }
    }
    async getSingleRole(req,res){
        try{
            const role = await Role.findOne({
                _id: mongoose.Types.ObjectId(req.params.id)
            }).exec();
            return role 
                ? success(res, "Role Fetched", role) 
                : notFound(res, "Role not found", {});
        }catch(error){
            return failure(res, error.message, error.stack);
        }
    }
    async updateRole(req,res){
        try{
            let {right, addRight, removeRight, roleBody} = req.body;
            let updateObj = {},
                pullObj = {},
                pushObj = {},
                setObj = {};
            pushObj = addRight ? {rights: right} : null;
            pullObj = removeRight ? {rights: right} : null;
            setObj = roleBody ? roleBody : null;

            pushObj ? updateObj["$addToSet"] = pushObj : null;
            pullObj ? updateObj["$pull"] = pullObj : null;
            setObj ? updateObj["$set"] = setObj : null;

            const modified = await Role.updateOne({
                _id: mongoose.Types.ObjectId(req.params.id)
            }, updateObj);
            return modified.matchedCount 
                ? modified.modifiedCount
                ? success(res, "Updated successful", {})
                : notModified(res, "Not modified", {})
                : notFound(res, "No content found", {});
        }catch(error){
            return failure(res, error.message, error.stack);
        }
    }
    async deleteRole(req,res){
        try{
            const deleted = await Role.deleteOne({_id: mongoose.Types.ObjectId(req.params.id)});
            return deleted.deletedCount
                ? success(res, "Successfully deleted" , deleted) 
                : notModified(res, "Not deleted", {});
        }catch(error){
            return failure(res, error.message, error.stack);
        }
    }
}

module.exports = new RoleController();