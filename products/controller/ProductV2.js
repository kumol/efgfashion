const { success, failure, notModified } = require("../../common/helper/responseStatus");
const Product = require("../../models/product/ProductV2");
const mongoose = require("mongoose");
const { FileUpload } = require("../../common/helper");
const Category = require("../../models/product/category");
const Brand = require("../../models/product/Brand");
class ProductController{
    async addNewProduct(req,res){
        try{
        //     let { 
        //         name,
        //         banglaName,
        //         sku,
        //         barcodeType,
        //         unit,
        //         brand,
        //         category,
        //         subcategory,
        //         business_locations = [""],
        //         manageStock,
        //         alertQuantity,
        //         description,
        //         shortDescription,
        //         featuredImage,
        //         galleryImages,
        //         weight,
        //         length,
        //         width,
        //         height,
        //         customFields,
        //         applicableTax,
        //         sellingPriceTax,
        //         productType,
        //         variation,
        //         published,
        //         stockAmount
        // } = req.body;

            const { id } = req.user;
            let {category, brand, productId, ...body} = req.body;
            
            if(!productId) {
                return res.status(400).json({
                    success: false,
                    statusCode: 400,
                    message: "You Cannot create product without any image."
                });
            }
            let newProduct = new Product({
                ...body,
                category: category,
                brand: brand,
                productId: productId,
                createdBy: id
            });
            
            const product = await newProduct.save();
            product ? await Category.updateOne({
                    _id: mongoose.Types.ObjectId(category)
                },{
                    $push:{
                        products: product._id
                }}) : null;
            // Update category with new product
            product? await Brand.updateOne(
                { 
                    _id: mongoose.Types.ObjectId(product.brand) },
                { 
                    $push: { products: product._id },
                    $inc: {productCount: 1}
                })
                .exec() : null;
            return success(res,"Product Created", product);
        }catch(error){
            return failure(res, error.message, error);
        }
    }

    //  ***********  get all product *********** //

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
        } catch(error){
            return failure(res, error.message, {});
        }
    }
//  ***********  get single product *********** //
    getSignle = async(req,res,next)=>{
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
        } catch(error){
            return failure(res, error.message, {});
        }
    }

    async updateProduct(req,res){
        try{
            const { id } = req.user;
            let {category, brand, ...updateObj} = req.body;

            updateObj["updatedBy"] = id;
            const oldProduct = category || brand ? await Product.findOne({
                _id: mongoose.Types.ObjectId(req.params.id)
            }).select("category brand") : null;

            category ? updateObj["category"] = category : null;
            brand ? updateObj["brand"] = brand : null;

            const modified = await Product.updateOne({
                _id: mongoose.Types.ObjectId(req.params.id)
            },{
                $set: updateObj
            });

            //Remove product from category

            if(modified && modified.modifiedCount && category && oldProduct) {
                await Category.updateOne(
                    { _id: mongoose.Types.ObjectId(oldProduct.category) },
                    { $pull: { products: req.params.id } }
                ).exec();
                
                await Category.updateOne(
                    { _id: mongoose.Types.ObjectId(category) },
                    { $push: { products: req.params.id } }
                ).exec()
            }
            // Update Brand with new product

            if(modified && modified.modifiedCount && brand && oldProduct){
                await Brand.updateOne({
                    _id: mongoose.Types.ObjectId(oldProduct.brand)
                },{
                    $pull: { products: req.params.id },
                    $inc: { productCount: -1 }
                }).exec();

                await Brand.updateOne({
                    _id: mongoose.Types.ObjectId(brand)
                },{
                    $push: { products: req.params.id },
                    $inc: { productCount: 1 }
                })
            }

            const product = await Product.findOne({
                _id: mongoose.Types.ObjectId(req.params.id)
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
            const product = await Product.findOne({
                    _id: mongoose.Types.ObjectId(req.params.id)
                })
                .select("category brand")
                .lean();

            let deleted = await Product.deleteOne({
                _id: mongoose.Types.ObjectId(req.params.id)
            });
            product && deleted && deleted.deletedCount 
                ? await Category.updateOne({
                    _id: mongoose.Types.ObjectId(product.category)
                },{
                    $pull:{
                        products: req.params.id
                    }
                })
                : null;
        // Update category with new product
            product && deleted && deleted.deletedCount 
                ? await Brand.findOneAndUpdate({
                        _id: mongoose.Types.ObjectId(product.brand)
                    },{ 
                        $pull: { products: req.params.id },
                        $inc: {productCount: -1}
                    }).exec()
                : null;
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

    async getProductByCategory(req, res) {
        try {
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
                .sort({ _id: -1 })
                .skip((page - 1) * limit)
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
        } catch (error) {
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