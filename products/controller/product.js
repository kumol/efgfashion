const { success } = require("../../common/helper/responseStatus");
const Product = require("../../models/product/product");

class ProductController{
    async addNewProduct(req,res){
        try{

        }catch(error){

        }
    }
    async getProduct(req,res){
        try{
            const product = await Product.find({}).exec();
            return success(res, "Product fetched", product);
        }catch(error){
            return failure(res, error.message, error);
        }
    }
}

module.exports = new ProductController();