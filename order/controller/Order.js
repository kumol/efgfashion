const { success, failure, notFound, notModified } = require("../../common/helper/responseStatus");
const Order = require("../../models/Order/Order");
const uid = require("uniqid");
const mongoose = require("mongoose");
class OrderController{
    async placeOrder(req, res, next){
        try {
            const { id } = req.user
            const {
                name,
                email,
                phone,
                shippingArea,
                deliveryAddress,
                postCode,
                postOffice,
                upazila,
                paymentMethod,
                deliveryCharge,
                subTotalPrice,
                status,
                isCouponApplied,
                coupon,
                products,
                amountPaid
            } = req.body;
    
            const orderId = await uid();
            // if (shippingArea === "Dhaka") {
            //     dCharge = shippingCharge.insideDhaka
            // } else {
            //     dCharge = shippingCharge.outsideDhaka
            // }
    
            let paymentStatus;
            const totalPrice = subTotalPrice + deliveryCharge;
            if(amountPaid == totalPrice) {
                paymentStatus = "paid"
            }

            const orderData = new Order({
                orderCode : orderId,
                user: req.user.id,
                name,
                email,
                phone,
                shippingArea,
                deliveryAddress,
                postCode,
                postOffice,
                upazila,
                deliveryCharge: deliveryCharge,
                paymentMethod,
                products: products,
                subTotalPrice: subTotalPrice,
                totalPrice: totalPrice,
                isCouponApplied: isCouponApplied,
                status: status
            })
    
            const order = await orderData.save()
            
            return success(res, "Order placed", order);
        } catch (error) {
            console.log(error);
            return failure(res, error.message, error);
        }
    }
    async getAllOrder(req,res,next){
        try{
            let page = req.query.page || 1,
                limit = req.query.limit || 10,
                total = await Order.countDocuments({});

            let order = await Order.find({})
                .sort({_id: -1})
                .skip((page-1)*limit)
                .limit(limit)
                .populate({
                    "path": "user",
                    "select": "name email phone"
                })
                .lean({});
            return order ? success(res, "Fetched order", {
                total: total,
                page: page,
                limit: limit,
                order: order
            }) : notFound(res, "No content found", {tota: total,
                limit: limit, 
                page: page
            });
        }catch(error){
            return failure(res, error.message, error);
        }
    }
    async getSingleOrder(req,res,next){
        try{
            let order = await Order.findOne({_id: mongoose.Types.ObjectId(req.params.id)}).populate({
                "path": "user",
                "select": "name email phone"
            })
                .lean({});
            return order ? success(res, "Fetched order", order)
                : notFound(res, "No content found", {});
        }catch(error){
            return failure(res, error.message, error);
        }
    }
    async updateOrder(req,res){
        try{
            let {...updateObj } = req.body;
            let {id} = req.params;
            const modified = await Order.updateOne({
                _id: mongoose.Types.ObjectId(id)
            },{
                $set: updateObj
            });
            const order = modified.matchedCount
                ? await Order.findOne({_id: mongoose.Types.ObjectId(req.params.id)})
                .populate({
                    "path": "user",
                    "select": "name email phone"
                })
                .lean({}) : {};
            return modified.matchedCount 
                ? modified.modifiedCount
                ? success(res, "Successfull Updated Order", order)
                : notModified(res, "Not modified", order)
                : notFound(res, "No content found", {});
        }catch(error){
            return failure(res, error.message, error);
        }
    }
    async deleteOrder(req,res,next){
        try{
            let deleted = await Order.deleteOne({
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

module.exports = new OrderController();