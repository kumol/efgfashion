const DeliveryCharge = require("../../../models/Order/DeliveryCharge");
const { success, notFound, notModified, failure } = require("../../../common/helper/responseStatus")
class DeliveryChargeController {
    async updateDelivery(req,res){
        try{
            let {zoneInsideDhaka,zoneInsideDhakaCharge,zoneOutsideDhaka,zoneOutsideDhakaCharge,origin} = req.body;
            let zone = await DeliveryCharge.findOne({origin: origin});
            let body = {},
                modified,
                newDeliveryCharge;
            zoneInsideDhaka ? body["zoneInsideDhaka"] = zoneInsideDhaka : null;
            zoneInsideDhakaCharge ? body["zoneInsideDhakaCharge"] = zoneInsideDhakaCharge : null;
            zoneOutsideDhaka ? body["zoneOutsideDhaka"] = zoneOutsideDhaka : null;
            zoneOutsideDhakaCharge ? body["zoneOutsideDhakaCharge"] = zoneOutsideDhakaCharge : null;
            origin ? body["origin"] = origin : null;
            if(zone){
                modified = await DeliveryCharge.updateOne({origin: origin},{$set: body});
            }else{
                let delivery = new DeliveryCharge({
                    ...body
                });
                newDeliveryCharge = await delivery.save()
            }
            return zone && modified && modified.matchedCount 
                ? modified.modifiedCount
                ? success(res, "Updated Delivery Charge ", modified)
                : notModified(res, "Not modified", modified)
                : newDeliveryCharge
                ? success(res, "Created delivery charge", newDeliveryCharge)
                : failure(res, "Failed to Create", {});
        }catch(error){
            return failure(res, error.message, error.stack);
        }
    }
    async calculateDeliveryCharge(req,res){
        try{
            let {origin, zone} = req.query;
            let delivery = await DeliveryCharge.findOne({origin: origin}).lean();
            let deliveryCharge = delivery.zoneOutsideDhakaCharge;
            const insideDhakas = JSON.parse(delivery.zoneInsideDhaka)[0];
            if(insideDhakas.indexOf(zone) > -1){
                deliveryCharge = delivery.zoneInsideDhakaCharge;
            }
            return deliveryCharge
                ? success(res, "Delivery charge calculated", {deliveryCharge: deliveryCharge})
                : notFound(res, "No deliveryCharge found ", {deliveryCharge: 0});
        }catch(error){
            return failure(res, error.message, error.stack);
        }
    }

    async getZone(req,res){
        try{
            let zones = require("../../../models/zones.json");
            success(res, "Delivery charge calculated",zones)
        }catch(error){
            return failure(res, error.message, error.stack);
        }
    }
}
module.exports = new DeliveryChargeController();