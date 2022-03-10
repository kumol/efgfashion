const { FileUpload } = require("../common/helper");
const { failure, notFound, notModified, success } = require("../common/helper/responseStatus");
const Banner = require("../models/Banner/Banner");
const BottomBanner = require("../models/Banner/BottomBanner");
const BottomBannerNew = require('../models/Banner/BottomBannerNew');
const mongoose = require("mongoose");
const ERROR_LIST = require('../common/helper/errorList');
const ERROR_MESSAGE = require('../common/helper/errorMessage');
const validator = require('validatorjs')
const fs = require('fs');
const path = require('path')

class BannerController {
    async addBanner(req,res){
        try{
            const validation = new validator(req.body, {
                title: 'required',
                name: 'required',
                details: 'required',
            });
            let file = req.files;
            if(validation.fails() || !file || !file.banner){
                validation.errors.errors.banner = ["The file banner is required"];
                return failure(res, ERROR_MESSAGE.HTTP_NOT_ACCEPTABLE, validation.errors.errors)
            }
            let banner = new Banner({
                ...req.body
            });
            let uploadFile = file ? await FileUpload(file.banner, "./uploads/banner/", banner._id) : '';
            banner.banner = uploadFile;
            banner = await banner.save();
            return banner
                ? res
                    .status(ERROR_LIST.HTTP_OK)
                    .send(success(res, "Banner added", banner))
                : res
                    .status(ERROR_LIST)
                    .send(failure(res, "Failed to create", {}))

        }catch(error){
            return res
                .status(ERROR_LIST.HTTP_INTERNAL_SERVER_ERROR)
                .send(failure(res, error.message, error))
        }
    }
    async getBanner(req,res){
        try{
            let banner = await Banner.findOne({_id: mongoose.Types.ObjectId(req.params.id)});
            return banner
                ? success(res, "Banner Fetched", banner)
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
    async getAllBannerWithoutPagination(req,res){
        try{
            let banner = await Banner.find({})
                .sort({_id: -1})
                .lean();
            return banner
                ? success(res, "Banner Fetched", banner)
                : notFound(res, "No content found", {});
        }
        catch(error){
            return failure(res, error.message, error);
        }
    }
    async editBanner(req,res){
        try{
            const validation = new validator(req.body, {
                title: 'required',
                name: 'required',
                details: 'required',
            });
            let file = req.files;
            if(validation.fails() || !file || !file.banner){
                validation.errors.errors.banner = ["The file banner is required"];
                return failure(res, ERROR_MESSAGE.HTTP_NOT_ACCEPTABLE, validation.errors.errors)
            }
            let updateObj = req.body;
            let uploadFile = file ? await FileUpload(file.banner, "./uploads/banner/", req.params.id) : null;
            uploadFile ? updateObj.banner = uploadFile : null;
            const banner = await Banner.findOne({_id: mongoose.Types.ObjectId(req.params.id)}).lean();
            const modified = await Banner.updateOne({_id: mongoose.Types.ObjectId(req.params.id)},{$set: updateObj});
            return modified.matchedCount
                ? modified.modifiedCount
                ? success(res, "Successfully Updated banner", banner)
                : notModified(res, "Not modified", banner)
                : notFound(res, "No content found", {});
        }catch(error){
            return failure(res, error.message, error);
        }
    }
    async deleteBanner(req,res){
        try{
            const banner = await Banner.findOne({_id: mongoose.Types.ObjectId(req.params.id)}).lean();
            let deleted = await Banner.deleteOne({
                _id: mongoose.Types.ObjectId(req.params.id)
            });
            if(deleted.deletedCount){
                const filePath = path.join(__dirname,'../../',banner.banner);
                if(fs.existsSync(filePath)){
                    fs.unlinkSync(filePath)
                }
            }
            return deleted.deletedCount 
                ? success(res, "Successfully deleted", deleted)
                : notModified(res, "Not deleted", {});
        }catch(error){
            return failure(res, error.message, error);
        }
    }

    //Bottom banner new API methods start 27/02/2022 by Radoan Hossan
    async addBottomBanner(req, res){
        try {
            let file = req.files;
            const validation = new validator(req.body, {
                title: 'required',
                subTitle: 'required',
                details: 'required',
                redirectUrl: 'required|url',
                btnName: 'required'
            });
            if(validation.fails() || !file || !file.banner){
                validation.errors.errors.banner = ["The file banner is required"];
                return failure(res, ERROR_MESSAGE.HTTP_NOT_ACCEPTABLE, validation.errors.errors)
            }
            let banner = new BottomBannerNew({
                ...req.body
            });
            let uploadFile = file ? await FileUpload(file.banner, "./uploads/bottom_banner/", banner._id) : '';
            banner.banner = uploadFile;
            banner = await banner.save();
            return banner
                ? res
                    .status(ERROR_LIST.HTTP_OK)
                    .send(success(res, "Bottom banner added", banner))
                : res
                    .status(ERROR_LIST)
                    .send(failure(res, "Failed to create", {}))

        } catch (err) {
            return failure(res, err.message, err);
        }
    }
    async editBottomBanner(req, res){
        try {
            let file = req.files;
            const validation = new validator(req.body, {
                title: 'required',
                subTitle: 'required',
                details: 'required',
                redirectUrl: 'required',
                btnName: 'required'
            });
            if(validation.fails() || !file || !file.banner){
                validation.errors.errors.banner = ["The file banner is required"];
                return failure(res, ERROR_MESSAGE.HTTP_NOT_ACCEPTABLE, validation.errors.errors)
            }
            let updateObj = req.body;
            let uploadFile = file ? await FileUpload(file.banner, "./uploads/bottom_banner/", req.params.id) : null;
            uploadFile ? updateObj.banner = uploadFile : null;
            const banner = await BottomBannerNew.findOne({_id: mongoose.Types.ObjectId(req.params.id)}).lean();
            const modified = await BottomBannerNew.updateOne({_id: mongoose.Types.ObjectId(req.params.id)},{$set: updateObj});
            return modified.matchedCount
                ? modified.modifiedCount
                    ? success(res, "Successfully bottom banner updated.", modified)
                    : notModified(res, "Not modified", banner)
                : notFound(res, "No content found", {});

        } catch (err) {
            return failure(res, err.message, err);
        }
    }
    async deleteBottomBanner(req,res){
        try{
            const banner = await BottomBannerNew.findOne({_id: mongoose.Types.ObjectId(req.params.id)}).lean();
            let deleted = await BottomBannerNew.deleteOne({
                _id: mongoose.Types.ObjectId(req.params.id)
            });
            if(deleted.deletedCount){
                const filePath = path.join(__dirname,'../../',banner.banner);
                if(fs.existsSync(filePath)){
                    fs.unlinkSync(filePath)
                }
            }
            return deleted.deletedCount
                ? success(res, "Successfully deleted", deleted)
                : notModified(res, "Not deleted", {});
        }catch(error){
            return failure(res, error.message, error);
        }
    }
    async getAllBottomBanner(req,res){
        try{
            let page = req.query.page || 1,
                limit = req.query.limit || 10;
            let banner = await BottomBannerNew.find({})
                .sort({_id: -1})
                .skip((page-1)*limit)
                .limit(limit)
                .lean();
            return banner
                ? success(res, "Bottom Banner Fetched", banner)
                : notFound(res, "No content found", {});
        }
        catch(error){
            return failure(res, error.message, error);
        }
    }
    async getAllBottomBannerWithoutPagination(req,res){
        try{
            let banner = await BottomBannerNew.find({})
                .sort({_id: -1})
                .lean();
            return banner
                ? success(res, "Bottom banner Fetched", banner)
                : notFound(res, "No content found", {});
        }
        catch(error){
            return failure(res, error.message, error);
        }
    }
    async getBottomBannerSingle(req,res){
        try{
            let banner = await BottomBannerNew.findOne({_id: mongoose.Types.ObjectId(req.params.id)});
            return banner
                ? success(res, "Bottom banner Fetched", banner)
                : notFound(res, "No content found", {});
        }catch(error){
            return failure(res, error.message, error.stack);
        }
    }
    //Bottom banner new API methods end 27/02/2022 by Radoan Hossan

    async updateBottomBanner(req,res){
        try{
            let file = req.files;
            let banner = await BottomBanner.find({}).lean(),
                firstFile = file && file.firstFile ? await FileUpload(file.firstFile, "./uploads/banner/", Date.now().toString()+"X") : null,
                secondFile = file && file.secondFile ? await FileUpload(file.secondFile, "./uploads/banner/", Date.now().toString()+"Y") : null,
                thirdFile = file && file.thirdFile ? await FileUpload(file.thirdFile, "./uploads/banner/", Date.now().toString()+"Z") : null;

            let firstBanner = req.body.firstBanner ? JSON.parse(req.body.firstBanner) : null,
                secondBanner = req.body.secondBanner ? JSON.parse(req.body.secondBanner) : null,
                thirdBanner = req.body.thirdBanner ? JSON.parse(req.body.thirdBanner) : null;
            
            firstBanner && firstFile ? firstBanner.banner = firstFile : null;
            secondBanner && secondFile ? secondBanner.banner = secondFile : null;
            thirdBanner && thirdFile ? thirdBanner.banner = thirdFile : null;
            let newBanner = {},
                modified,
                bottomBanner;
            firstBanner ? newBanner["firstBanner"] = firstBanner : null;
            secondBanner ? newBanner["secondBanner"] = secondBanner : null;
            thirdBanner ? newBanner["thirdBanner"] = thirdBanner : null;
            if(banner && banner.length>0){
                modified = await BottomBanner.updateOne({},{$set: newBanner});
            }else{
                bottomBanner = new BottomBanner({
                    ...newBanner
                })
                bottomBanner = await bottomBanner.save();
            }

            return banner && banner.length > 0 && modified && modified.matchedCount 
                ? modified.modifiedCount ? 
                success(res, "Modified", modified)
                : notModified(res, "Not Modified", modified)
                : bottomBanner 
                ? success(res, "Created New Bottom Banner", bottomBanner)
                : failure(res, "failed", {});
        }catch(error){
            return failure(res, error.message, error.stack);
        }
    }
    async getBottomBanner(req,res){
        try{
            let banner = await BottomBanner.findOne({}).select("-__v -_id").lean(),
                bottomBanner = [];
            banner ? Object.entries(banner).forEach(([key,value])=>{
                bottomBanner.push(value);
            }) : [];

            return banner
                ? success(res, "Found banner", bottomBanner)
                : notFound(res, "No content found", []);
        }catch(error){
            return failure(res, error.message, error.stack);
        }
    }
}

module.exports = new BannerController();

// {
//     const moment = require('moment');
// console.log(moment().format('YYYY-MM-DD HH:mm:ss'));
// var converter = require('hex2dec');

// let date = moment();
// // let day = date.format('DD');
// let year = date.format('YYYY');
// let month = Number(date.format('MM'));
// let day = Number(date.format('DD'));
// let hour = Number(date.format('HH'));
// let min = date.format('mm');
// let second = date.format('ss');
// let mlSecond = date.milliseconds();
// let a = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
// let b = 'asdfghjklopXYZESTFmnbvcxOPQzqwertyui';
// let fy = year.slice(0, 2);
// let ly = year.slice(2, 4);

// let value =
//   Number(ly) +
//   19 +
//   fy +
//   a[month] +
//   b[day] +
//   a[hour] +
//   converter.decToHex(min) +
//   second +
//   mlSecond;
// console.log(fy);
// console.log(value);
// console.log(typeof year);

// }