const { success, failure, notModified } = require("../../common/helper/responseStatus");
const Product = require("../../models/product/product");
const mongoose = require("mongoose");
const { FileUpload } = require("../../common/helper");
const Category = require("../../models/product/category");
const Brand = require("../../models/product/Brand");
class ProductController{
    async addNewProduct(req,res){
        try{
            const { id } = req.user
            let { tags, category, brand, ...body } = req.body;
            const file = req.files;
            
            tags ? tags = JSON.parse(tags) : null;
            const newProduct = {
                ...body,
                tags,
                category: category,
                brand: brand,
                createdBy: id
            }
            let product = new Product(newProduct);
            const uploadFile = file ? await FileUpload(file.largeThumbnail, "./uploads/product/", product._id) : "";
            const secondFile = file && file.secondImage ? await FileUpload(file.secondImage, "./uploads/product/", req.params.id+"2") : "";
            const thirdFile = file && file.thirdImage ? await FileUpload(file.thirdImage, "./uploads/product/", req.params.id+"3") : "";
            const fourthFile = file && file.fourthImage ? await FileUpload(file.fourthImage, "./uploads/product/", req.params.id+"4") : "";
            product["thumbnail"] = {
                large: uploadFile,
                small: uploadFile
            }
            product["secondImage"] = secondFile;
            product["thirdImage"] = thirdFile;
            product["fourthImage"] = fourthFile;

            product = await product.save();
            product ? await Category.updateOne({
                _id: mongoose.Types.ObjectId(category)
            },{
                $push:{
                    products: product._id
            }}) : null;
            // Update category with new product
            product? await Brand.findOneAndUpdate(
                { _id: mongoose.Types.ObjectId(product.brand) },
                { $push: { products: product._id } },
                { new: true }
            ).exec() : null;
            product ? await Brand.updateOne({
                _id: mongoose.Types.ObjectId(brand)
            },{
                $inc: {productCount: 1}
            }) : null;
            return success(res,"Product Created", product);
        }catch(error){
            return failure(res, error.message, error)
        }
    }
    async getProduct(req,res){
        try{
            let page = +req.query.page || 1;
            let limit = +req.query.limit || 10;
            const total = await Product.countDocuments({});
            const product = await Product.find({})
                .sort({_id: 1})
                .skip((page-1)*limit)
                .limit(limit)
                .populate({
                    path:"category",
                    select:"name _id"
                })
                .populate({
                    path: "brand",
                    select: "title _id"
                })
                .lean();
            return product 
                ? success(res, "Product fetched", {
                    page: page,
                    limit: limit,
                    total: total,
                    product
                })
                : notFound(res, "No content found", {
                    page: page,
                    limit: limit,
                    total: total,
                    product: []
                }); 
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
                })
                .populate({
                    path: "brand",
                    select: "title _id"
                })
                .lean();
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
            const total = await Product.countDocuments({
                category: mongoose.Types.ObjectId(req.params.id)
            });
            const product = await Product
                .find({
                    category: mongoose.Types.ObjectId(req.params.id)
                })
                .populate({
                    path: "category",
                    select: "name _id"
                })
                .populate({
                    path: "brand",
                    select: "title _id"
                })
                .sort({_id: -1})
                .skip((page-1)*limit)
                .limit(limit)
                .exec();
            return product 
                ? success(res, "Product fetched", {
                    page: page,
                    limit: limit,
                    total: total,
                    product
                })
                : notFound(res, "No content found", {
                    page: page,
                    limit: limit,
                    total: total,
                    product: []
                }); 
        }catch(error){
            return failure(res, error.message, error);
        }
    }
    async updateProduct(req,res){
        try{
            const { id } = req.user
            const file = req.files;
            let {tags, ...updateObj} = req.body;
            let thumbnail;
            tags ? tags = JSON.parse(tags) : null;

            const uploadFile = file ? await FileUpload(file.largeThumbnail, "./uploads/product/", req.params.id) : null;
            const secondFile = file && file.secondImage ? await FileUpload(file.secondImage, "./uploads/product/", req.params.id+"2") : null;
            const thirdFile = file && file.thirdImage ? await FileUpload(file.thirdImage, "./uploads/product/", req.params.id+"3") : null;
            const fourthFile = file && file.fourthImage ? await FileUpload(file.fourthImage, "./uploads/product/", req.params.id+"4") : null;
            uploadFile ? thumbnail = {} : null;
            uploadFile ? thumbnail["large"] = uploadFile : null;
            uploadFile ? thumbnail["small"] = uploadFile : null;

            secondFile ? updateObj["secondImage"] = secondFile : null;
            thirdFile ? updateObj["thirdImage"] = thirdFile : null;
            fourthFile ? updateObj["fourthImage"] = fourthFile : null;

            thumbnail ? updateObj.thumbnail = thumbnail : null;
            tags ? updateObj.tags = tags : null;
            updateObj["updatedBy"] = id;
            const productOld = await Product.findOne({
                _id: mongoose.Types.ObjectId(req.params.id)
            })

            const modified = await Product.updateOne({
                _id: mongoose.Types.ObjectId(req.params.id)
            },{
                $set: updateObj
            });
            const product = await Product.findOne({
                _id: mongoose.Types.ObjectId(req.params.id)
            })
            .populate({
                path: "category",
                select: "_id"
            })
            .populate({
                path: "brand",
                select: "title _id"
            })
            .lean();
            //Remove product from category
            modified.modifiedCount ? await Category.findOneAndUpdate(
                { _id: mongoose.Types.ObjectId(productOld.category._id) },
                { $pull: { products: { $in: [`${product._id}`] } } },
                { multi: true }
            ).exec() : null;
            // Update category with new product
            modified.modifiedCount ? await Category.findOneAndUpdate(
                { _id: mongoose.Types.ObjectId(product.category._id) },
                { $push: { products: product._id } },
                { new: true }
            ).exec() : null;

            //Remove product from category
            modified.modifiedCount ? await Brand.findOneAndUpdate(
                { _id: mongoose.Types.ObjectId(productOld.brand._id) },
                { $pull: { products: { $in: [`${product._id}`] } } },
                { multi: true }
            ).exec() : null;
            // Update category with new product
            modified.modifiedCount ? await Brand.findOneAndUpdate(
                { _id: mongoose.Types.ObjectId(product.brand._id) },
                { $push: { products: product._id } },
                { new: true }
            ).exec() : null;

            return modified.matchedCount 
                ? modified.modifiedCount
                ? success(res, "Successfull Updated Product", product)
                : notModified(res, "Not modified", product)
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

    async searchProduct(req,res){
        try{
            let page = +req.query.page || 1;
            let limit = +req.query.limit || 20;
            const {titleText} = req.body;
            const total = await Product.countDocuments({
                title: {$regex: titleText, $options: "i"}
            });
            const product = await Product
                .find({
                    title: {$regex: titleText, $options: "i"}
                })
                .sort({_id: -1})
                .skip((page-1)*limit)
                .limit(limit)
                .populate({
                    path:"category",
                    select:"name _id"
                })
                .populate({
                    path: "brand",
                    select: "title _id"
                })
                .lean();
            return product 
                ? success(res, "Product fetched", {
                    page: page,
                    limit: limit,
                    total: total,
                    product
                })
                : notFound(res, "No content found", {
                    page: page,
                    limit: limit,
                    total: total,
                    product: []
                }); 
        }catch(error){
            return failure(res, error.message, error);
        }
    }

    async filterProduct(req,res){
        try{
            let limit = +req.query.limit || 10;
            let page = +req.query.page || 1,
                filterQuery = req.query;
            let query = {},
                category = filterQuery.category 
                    ? mongoose.Types.ObjectId(filterQuery.category) : null,
                brand = filterQuery.brand 
                    ? mongoose.Types.ObjectId(filterQuery.brand) : null,
                lowerPrice = filterQuery.lowerPrice >= 0 
                    ? filterQuery.lowerPrice : null,
                upperPrice = filterQuery.upperPrice >= 0
                    ? filterQuery.upperPrice : null,
                tags = filterQuery.tags ? filterQuery.tags : null;
                
            category ? query.category = category : null;
            brand ? query.brand = brand : null;
            (lowerPrice != (null || undefined)) && (upperPrice != (null || undefined))
                ? query["$and"] = [{price: {$gte: lowerPrice}}, {price: {$lte: upperPrice}}]
                : null;
            tags ? query["tags"] = {$in: tags} : null;
            
            const total = await Product.countDocuments(query);
            const product = await Product
                .find(query)
                .populate({
                    path: "category",
                    select: "name _id"
                })
                .populate({
                    path: "brand",
                    select: "title _id"
                })
                .sort({_id: -1})
                .skip((page-1)*limit)
                .limit(limit)
                .exec();
            return product 
                ? success(res, "Product fetched", {
                    page: page,
                    limit: limit,
                    total: total,
                    product
                })
                : notFound(res, "No content found", {
                    page: page,
                    limit: limit,
                    total: total,
                    product: []
                }); 
        }catch(error){
            return failure(res, error.message, error);
        }
    }
}

module.exports = new ProductController();