const { success, failure, notModified } = require("../../common/helper/responseStatus");
const Product = require("../../models/product/product");
const mongoose = require("mongoose");
const { FileUpload } = require("../../common/helper");
class ProductController{
    async addNewProduct(req,res){
        try{
            let { tags, ...body } = req.body;
            const file = req.files;
            
            tags = JSON.parse(tags);
            const newProduct = {
                ...body,
                tags
            }
            let product = new Product(newProduct);
            const uploadFile = file ? await FileUpload(file.largeThumbnail, "./upload/product/", product._id) : "";
            product["thumbnail"] = {
                large: uploadFile,
                small: uploadFile
            }
            product = await product.save();
            return success(res,"Product Created", product);
        }catch(error){
            return failure(res, error.message, error)
        }
    }
    async getProduct(req,res){
        try{
            let page = +req.query.page || 1;
            let limit = +req.query.limit || 10;
            const product = await Product.find({})
                .sort({_id: -1})
                .skip((page-1)*limit)
                .limit(limit)
                .populate({
                    path:"category",
                    select:"name _id"
                })
                .exec();
            return product 
                ? success(res, "Product fetched", product)
                : notFound(res, "No content found", []); 
        }catch(error){
            return failure(res, error.message, error);
        }
    }
    async getSignle(req,res){
        try{
            const product = await Product.findOne({
                _id: req.params.id
            })
                .populate({
                    path: "category",
                    select: "name _id"
                });
            return product 
                ? success(res, "Product Found", product)
                : notFound(res, "No content found", {}); 
        }catch(error){
            return failure(res, error.message, error);
        }
    }
    async getProductByCategory(req,res){
        try{
            let limit = +req.query.limit || 10;
            let page = +req.query.page || 1;
            const product = await Product
                .find({category: mongoose.Types.ObjectId(req.params.id)})
                .sort({_id: -1})
                .skip((page-1)*limit)
                .limit(limit)
                .exec();
            return product
                ? success(res, "Product Found", product)
                : notFound(res, "No content found", {});
        }catch(error){
            return failure(res, error.message, error);
        }
    }
    async updateProduct(req,res){
        try{
            const file = req.files;
            let {tags, largeThumbnail, ...updateObj} = req.body;
            tags ? tags = JSON.parse(tags) : null;
            const uploadFile = file ? await FileUpload(file.largeThumbnail, "./upload/product/", req.params.id) : null;
            let thumbnail = {};
            uploadFile ? thumbnail["large"] = uploadFile : null;
            uploadFile ? thumbnail["small"] = uploadFile : null;
            thumbnail ? updateObj.thumbnail = thumbnail : null;
            tags ? updateObj.tags = tags : null;
            const modified = await Product.updateOne({
                _id: mongoose.Types.ObjectId(req.params.id)
            },{
                $set: updateObj
            });
            const product = await Product.findOne({_id: mongoose.Types.ObjectId(req.params.id)}).lean();
            return modified.matchedCount 
                ? modified.modifiedCount
                ? success(res, "Successfull Updated Product", product)
                : notModified(res, "Not modified", {})
                : notFound(res, "No content found", {});
        }catch(error){
            return failure(res, error.message, error);
        }
    }
    async deleteProduct(req,res){
        try{
            let deleted = await Product.deleteOne({
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

module.exports = new ProductController();