const mongoose = require("mongoose");
const { success, failure } = require("../../common/helper/responseStatus");
const Category = require("../../models/product/category");
class CategoryController{
    async addNewCategory(req,res){
        try{
            let category = await Category.create(...req.body).exec();
            return success(res, "Category Created", category);
        }catch(error){
            return failure(res, error.message, error);
        }
    }
    async getAllCategory(req,res){
        try{

        }catch(error){
            return failure(res, error.message, error);
        }
    }
    async removeCategory(req,res){
        try{
            Category.deleteOne({_id: mongoose.Types.ObjectId(req.params.id)});
            return success(res, "Category Deleted", {});
        }catch(error){
            return failure(res, error.message, error);
        }
    }
    async getSingleCategory(req,res){
        try{

        }catch(error){
            return failure(res, error.message, error);
        }
    }
}
module.exports = new CategoryController();