const { success, failure } = require("../../common/helper/responseStatus");
const Product = require("../../models/product/product");
const mongoose = require("mongoose");
class ProductController{
    async addNewProduct(req,res){
        try{
            let { largeThumbnail, ...body } = req.body;
            const smallThumbnail = largeThumbnail;
            const newProduct = {
                ...body,
                thumbnail:{
                    large: largeThumbnail,
                    small: smallThumbnail
                }
            }
            let product = new Product(newProduct);
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
            let limit = +query.limit || 10;
            let page = +query.page || 1;
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
            let { thumbnail, ...updateObj} = req.body;
            thumbnail.large ? thumbnail.small = thumbnail.large : null;
            updateObj.thumbnail = updateObj.thumbnail ? thumbnail : null;
            const modified = Product.updateOne({
                _id: mongoose.Types.ObjectId(req.params.id)
            },{
                $set: updateObj
            });
            return modified.n 
                ? modified.nModified
                ? success(res, "Successfull Updated Product", {})
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
            console.log(deleted);
            return success(res, "Deleted", deleted);
        }catch(error){
            return failure(res, error.message, error);
        }
    }
}

module.exports = new ProductController();