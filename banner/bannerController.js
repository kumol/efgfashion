const { FileUpload } = require("../common/helper");
const { failure, notFound, notModified, success } = require("../common/helper/responseStatus");
const Banner = require("../models/Banner/Banner");
const mongoose = require("mongoose");
class BannerController {
    async addBanner(req,res){
        try{
            let file = req.files;
            let banner = new Banner({
                ...req.body
            });
            let uploadFile = file ? await FileUpload(file.banner, "./upload/banner/", banner._id) : '';
            banner.banner = uploadFile;
            banner = await banner.save();
            return banner 
                ? success(res, "Banner added", banner)
                : failure(res, "Failed to create", {});
        }catch(error){
            return failure(res, error.message, error);
        }
    }
    async getBanner(req,res){
        try{
            let banner = await Banner.findOne({_id: mongoose.Types.ObjectId(req.params.id)});
            return banner
                ? success(res, "Banner Fatched", banner)
                : notFound(res, "No content found", {});
        }
        catch(error){
            return failure(res, error.message, error);
        }
    }
    async getAllBanner(req,res){
        try{
            let page = req.query.page || 1,
                limit = req.query.limit || 10;
            let banner = await Banner.find({})
                .sort({_id: -1})
                .skip((page-1)*limit)
                .limit(limit)
                .lean();
            return banner
                ? success(res, "Banner Fatched", banner)
                : notFound(res, "No content found", {});
        }
        catch(error){
            return failure(res, error.message, error);
        }
    }
    async editBanner(req,res){
        try{
            let file = req.files;
            let updateObj = req.body;
            let uploadFile = file ? await FileUpload(file.banner, "./upload/banner/", req.params.id) : null;
            uploadFile ? updateObj.banner = uploadFile : null;
            const modified = await Banner.updateOne({_id: mongoose.Types.ObjectId(req.params.id)},{$set: updateObj});
            const banner = await Banner.findOne({_id: mongoose.Types.ObjectId(req.params.id)}).lean();
            return modified.matchedCount
                ? modified.modifiedCount
                ? success(res, "Successfull Updated banner", banner)
                : notModified(res, "Not modified", banner)
                : notFound(res, "No content found", {});
        }catch(error){
            return failure(res, error.message, error);
        }
    }
    async deleteBanner(req,res){
        try{
            let deleted = await Banner.deleteOne({
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

module.exports = new BannerController();