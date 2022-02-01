const mongoose = require("mongoose");
const { success, failure } = require("../../common/helper/responseStatus");
const User = require("../../models/user/user");

class UserController {
    async registerUser(req,res){
        try{
            const user = await User.create({...req.body});
            return res.status(200).json(success("User registered", user));
        }catch(error){
            return res.status(500).json(failure(error.message, error));
        }
    }
    async getUser(req,res){
        try{
            const user = await User.find({});
            return res.status(200).json(success("User fetched", user));
        }catch(error){
            return res.status(500).json(failure(error.message, error));
        }
    }
    async deleteUser(req,res){
        try{
            const { id } = req.params;
            const user = await User.deleteOne({_id: mongoose.Types.ObjectId(id)});
            return res.status(200).json(success("User fetched", user));
        }catch(error){
            return res.status(500).json(failure(error.message, error));
        }
    }
}

module.exports = new UserController();