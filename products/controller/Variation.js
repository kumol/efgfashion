const { failure, success, notModified, notFound } = require("../../common/helper/responseStatus");
const Variation = require("../../models/product/Variation");
const mongoose = require("mongoose");
const Product = require("../../models/product/product");
const { FileUpload } = require("../../common/helper");
const validator = require('validatorjs');
const ERROR_MESSAGE = require("../../common/helper/errorMessage");

class VariationController {
    async createVariation(req,res){
        try {
            let validation = new validator(req.body, {
                name: "required",
                values: "array|required"
            });
            if(validation.fails()){
                return failure(res, ERROR_MESSAGE.HTTP_NOT_ACCEPTABLE, validation.errors.errors)
            }
            let variation = new Variation(req.body);
            variation = await variation.save();
            return variation
                ? success(res, "Variation created", variation)
                : failure(res, "Failed to create", {});
        } catch(error) {
            failure(res, "Failed to create variation", {});
        }
    }
    async getSingleVariation(req,res){
        try {
            const variation = await Variation.findOne({_id: mongoose.Types.ObjectId(req.params.id)});
            return variation
                ? success(res, "Variation Fetched", variation)
                : notFound(res, "No content found", {});
        } catch(error) {
            failure(res, "Failed to find variation", {});
        }
    }
    async getVariation(req,res){
        try{
            const limit = req.query.limit || 10,
                page = req.query.page || 1,
                total = await Variation.countDocuments({});
            const variation = await Variation.find({})
                .sort({_id: -1})
                .skip(limit * (page-1))
                .lean();
            return variation ? success(
                res,
                "Fetched variation",
                {
                    total: total,
                    page: page,
                    limit: limit,
                    variation: variation
                }) : notFound(
                res,
                "No content found",
                {
                    total: total,
                    page: page,
                    limit: limit,
                    variation: variation || []
                }
            );
        }catch(error){
            failure(res, "Failed to fetch variation", {});
        }
    }
    async deleteVariation(req,res){
        try{
            let deleted = await Variation.deleteOne({
                _id: mongoose.Types.ObjectId(req.params.id)
            });
            return deleted.deletedCount
                ? success(res, "Successfully deleted", deleted)
                : notModified(res, "Not deleted", {});
        }catch(error){
            return failure(res, error.message, error);
        }
    }
    async updateVariation(req,res){
        try{
            let validation = new validator(req.body, {
                name: "required",
                values: "array|required"
            });
            if(validation.fails()){
                return failure(res, ERROR_MESSAGE.HTTP_NOT_ACCEPTABLE, validation.errors.errors)
            }
            const modified = await Variation.updateOne({
                _id: mongoose.Types.ObjectId(req.params.id)
            },{
                $set: req.body
            });
            const variation = await Variation.findOne({_id: mongoose.Types.ObjectId(req.params.id)}).lean();
            return modified.matchedCount
                ? modified.modifiedCount
                    ? success(res, "Successfully Updated Variation", variation)
                    : notModified(res, "Not modified", {})
                : notFound(res, "No content found", {});
        }catch(error){
            return failure(res, error.message, error);
        }
    }
}

module.exports = new VariationController();