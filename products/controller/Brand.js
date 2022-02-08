const { failure, success, notFound } = require("../../common/helper/responseStatus");
const Brand = require("../../models/product/Brand");
const mongoose = require("mongoose");
const Product = require("../../models/product/product");

class BrandController {
    async createNewBrand(req,res){
        try{
            let {title, logo, productCount} = req.body;
            let newBrand = {};
            title ? newBrand["title"] = title : null;
            logo ? newBrand["logo"] = logo : null;
            productCount ? newBrand["productCount"] = productCount : null;
            let brand = new Brand(newBrand);
            brand = await brand.save();
            return brand 
                ? success(res, "Brand created", brand)
                : failure(res, "Failed to create", {});
        }catch(error){
            console.log(error);
            failure(res, "Failed to create brand", {});
        }
    }
    async getSingleBrand(req,res){
        try{
            const brand = await Brand.findOne({_id: mongoose.Types.ObjectId(req.params.id)});
            const products = brand ? Product.find({brand: mongoose.Types.ObjectId(req.params.id)}) : [];
            brand ? brand["products"] = products : null;
            return brand
                ? success(res, "Brand Fatched", brand)
                : notFound(res, "No content found", {});
        }catch(error){
            failure(res, "Failed to find brand", {});
        }
    }
    async getBrand(req,res){
        try{
            const limit = req.query.limit || 10,
                page = req.query.page || 1,
                total = await Brand.countDocuments({});
            const brand = await Brand.findOne({})
                .sort({_id: -1})
                .skip(limit * (page-1))
                .lean();
            return brand ? success(
                res,
                "Fetched brand",
                {
                    total: total,
                    page: page,
                    limit: limit,
                    brand: brand
            }) : notFound(
                res,
                "No content found",
                {
                    total: total,
                    page: page,
                    limit: limit,
                    brand: brand || []
                }
            );
        }catch(error){
            failure(res, "Failed to fetch brand", {});
        }
    }
    async deleteBrand(req,res){
        try{
            let deleted = await Brand.deleteOne({
                _id: mongoose.Types.ObjectId(req.params.id)
            });
            return deleted.deletedCount 
                ? success(res, "Successfully deleted", deleted)
                : notModified(res, "Not deleted", {});
        }catch(error){
            return failure(res, error.message, error);
        }
    }
    async updateBrand(req,res){
        try{
            let { title , logo, productCount} = req.body;
            let updateObj = {};
            title ? updateObj["title"] = title : null;
            logo ? updateObj["logo"] = logo : null;
            productCount ? updateObj["productCount"] = productCount : null;

            const modified = await Brand.updateOne({
                _id: mongoose.Types.ObjectId(req.params.id)
            },{
                $set: updateObj
            });
            return modified.matchedCount
                ? modified.modifiedCount
                ? success(res, "Successfull Updated Brand", {})
                : notModified(res, "Not modified", {})
                : notFound(res, "No content found", {});
        }catch(error){
            return failure(res, error.message, error);
        }
    }
}

module.exports = new BrandController();