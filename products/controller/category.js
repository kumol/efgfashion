const mongoose = require("mongoose");
const { success, failure, notFound, notModified } = require("../../common/helper/responseStatus");
const Category = require("../../models/product/category");
const Helper = require("../../common/helper/index");
class CategoryController{
    async addNewCategory(req,res){
        try{
            const file = req.files;
            const isExist = await Category.countDocuments({name: req.body.name});
            if(isExist) return res.status(400).json({success: false, statusCode: 400, message: "Category already exist"});
            let category = new Category({
                ...req.body
            });
            const uploadFile = await Helper.FileUpload(file.banner, './upload/category/banner/', category._id);
            category.id = category._id;
            category.banner = uploadFile
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
            const file = req.files;
            const uploadFile = file && file.banner ? await Helper.FileUpload(file.banner, './upload/category/banner/', req.params.id) : null;

            let {product, addProduct, removeProduct, ...body} = req.body,
               updatedObj = {},
               pushObj = addProduct ? {"products": product} : null,
               pullObj = removeProduct ? {"products": product } : null,
               setObj = body ? {...body} : null;
            
            uploadFile ? setObj["banner"] = uploadFile : null;
            pushObj ? updatedObj["$push"] = pushObj : null;
            pullObj ? updatedObj["$pull"] = pullObj : null;
            setObj ? updatedObj["$set"] = setObj : null;

            
            let modified = await Category.updateOne({_id: mongoose.Types.ObjectId(req.params.id)}, updatedObj);
            const category = modified.matchedCount ? await Category.findOne({_id: mongoose.Types.ObjectId(req.params.id)}).lean() : {};
            return modified.matchedCount
                ? modified.modifiedCount
                ? success(res, "Successfull Updated Category", category)
                : notModified(res, "Not modified", modified)
                : notFound(res, "No content found", {});
        }catch(error){
            return failure(res, error.message, error);
        }
    }
}
module.exports = new CategoryController();