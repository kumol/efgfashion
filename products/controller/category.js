const mongoose = require("mongoose");
const { success, failure, notFound, notModified } = require("../../common/helper/responseStatus");
const Category = require("../../models/product/category");
class CategoryController{
    async addNewCategory(req,res){
        try{
            let category = new Category({
                ...req.body
            });
            category.id = category._id;
            category = await category.save();
            return success(res, "Category Created", category);
        }catch(error){
            return failure(res, error.message, error);
        }
    }
    async getAllCategory(req,res){
        try{
            let category = await Category.find({}).populate("products").exec();
            return category 
                ? success(res, "Category Found", category)
                : notFound(res, "No content found", []);
        }catch(error){
            return failure(res, error.message, error);
        }
    }
    async removeCategory(req,res){
        try{
            const deleted = await Category.deleteOne({_id: mongoose.Types.ObjectId(req.params.id)});
            return deleted.deletedCount 
                ? success(res, "Successfully deleted", deleted)
                : notModified(res, "Not deleted", {});
        }catch(error){
            return failure(res, error.message, error);
        }
    }
    async getSingleCategory(req,res){
        try{
            let category = await Category.find({}).populate("products").exec();
            return category 
                ? success(res, "Category Found", category)
                : notFound(res, "No Content Found", []);
        }catch(error){
            return failure(res, error.message, error);
        }
    }
    async updateCategory(req,res){
        try{
            let {product, addProduct, removeProduct, ...body} = req.body,
               updatedObj = {},
               pushObj = addProduct ? {"products": product} : null,
               pullObj = removeProduct ? {"products": product } : null,
               setObj = body ? {...body} : null;
            pushObj ? updatedObj["$push"] = pushObj : null;
            pullObj ? updatedObj["$pull"] = pullObj : null;
            setObj ? updatedObj["$set"] = setObj : null;

            let updated = await Category.updateOne({_id: mongoose.Types.ObjectId(req.params.id)}, updatedObj);
            return updated.n 
                ? updated.nModified
                ? success(res, "Successfull Updated Category", {})
                : notModified(res, "Not modified", {})
                : notFound(res, "No content found", {});
        }catch(error){
            return failure(res, error.message, error);
        }
    }
}
module.exports = new CategoryController();