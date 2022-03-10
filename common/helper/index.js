const { failure, success } = require("./responseStatus");

const moment = require('moment');
const converter = require('hex2dec');
class Helper {
    async FileUpload (data, path, name){
        try {
            const image = data;
            const extension = image.name.split('.')[1];
    
            const newName = name + '.' + extension;
            const uploadPath = path + newName;
            
            const moveFile = image.mv(uploadPath);
            if (moveFile) return path.split('.')[1] + newName
        } catch (error) {
            if (error) return error
        }
    }
    async UniqueCode(){
        try {
            let data = generateUniqueId({ length: 8, useLetters: false })
            let checkAvaliable = await Order.findOne({ orderCode: data })
            if (checkAvaliable) {
                UniqueCode()
            }
            return data
    
        } catch (error) {
            return error
        }
    }

    
    async fileUploaderForProduct(req,res){
        try{
            let {type, productId} = req.body;
            const files = req.files.files;
            const length = files ? files.length : 0;

            let i = 0;
            let names = [];
            productId = productId ? productId : await uniqueId("P");

            if(files && !files.length){
                names.push( await uploadFile(files, "./uploads/product/", productId, "T"))
            }
            if(files && length>0){
                for(i=0;i<length; i++){
                    names.push( await uploadFile(files[i], "./uploads/product/", productId, i))
                }
            }
            return success(res, "File uploaded", {productId: productId, large: names, small: type == "productImage" ? names : [], type: type});
        }catch(error){
            console.log(error);
            return failure(res, error.message, error)
        }
    }

}

module.exports = new Helper();


const uploadFile = async(data, path, productId, index)=>{
    try {
        const image = data
        const extension = image.name.split('.')[1];
        const newName = productId+"_"+Date.now() +index+ '.' + extension;
        const uploadPath = path + newName;
        const moveFile = image.mv(uploadPath);
        if (moveFile) return path.split('.')[1] + newName;
    } catch (error) {
        if (error) return error
    }
}

const uniqueId = async(id)=>{
    let date = moment();
    let year = date.format('YYYY');
    let month = Number(date.format('MM'));
    let week = date.format('ww');
    let day = Number(date.format('DD'));
    let hour = Number(date.format('HH'));
    let min = date.format('mm');
    let second = date.format('ss');
    let mlSecond = date.milliseconds();
    let a = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let c = 'CFWEJMNOPQ',
    d = 'ZXBSGIYAKF';
    let fy = year.slice(0, 2);
    let ly = year.slice(2, 4);
    mlSecond = mlSecond.toString();

    let uniqueIdCode =
    Number(ly) +
    19 +
    // d[+ly[0]] +
    fy +
    a[month] +
    // week +
    day +
    a[hour] +
    min+
    //converter.decToHex(min).toString().toUpperCase() +
    second +
    converter.decToHex(mlSecond).toUpperCase()+id;

    return uniqueIdCode;
}