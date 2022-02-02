import { success } from "../../common/helper/responseStatus";

const Category = require("../../models/product/category");

export class CategoryController{
    async addNewCategory(req,res){
        try{

        }catch(error){
            
        }
    }
    async getAllCategory(req,res){
        try{

        }catch(error){
            
        }
    }
    async removeCategory(req,res){
        try{
            Category.deleteOne({_id: req.params.id});
            return res.json(success("Category Deleted", {}));
        }catch(error){
            
        }
    }
}