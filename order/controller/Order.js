const { success, failure } = require("../../common/helper/responseStatus");
const Order = require("../../models/Order/Order");
const uid = require("uniqid");
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
                paymentMethod
            } = req.body;
    
            const orderId = await uid();
            console.log(orderId);
            let dCharge
            if (shippingArea === "Dhaka") {
                dCharge = foundProcessOrder.shippingCharge.insideDhaka
            } else {
                dCharge = foundProcessOrder.shippingCharge.outsideDhaka
            }
    
            const totalAmount = foundProcessOrder.subTotal + dCharge
    
            const orderData = new Order({
                orderCode,
                createdBy: id,
                name,
                email,
                phone,
                shippingArea,
                deliveryAddress,
                postCode,
                postOffice,
                upazila,
                deliveryCharge: dCharge,
                paymentMethod,
                products: foundProcessOrder.products,
                subTotalPrice: foundProcessOrder.subTotal,
                totalPrice: totalAmount,
                isCouponApplied: foundProcessOrder.isCouponApplied,
                coupon: foundProcessOrder.coupon
            })
    
            const order = await orderData.save()
            
            return success(res, "Order placed", order);
        } catch (error) {
            console.log(error);
            return failure(res, error.message, error);
        }
    }
}

module.exports = new OrderController();