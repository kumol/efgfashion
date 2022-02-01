/**
 * *****************************************************************
 * Copyright 2022.
 * All Rights Reserved to
 * ANTOOBA TECHNOLOGIES LTD
 * Redistribution or Using any part of source code or binary
 * can not be done without permission of ANTOOBA TECHNOLOGIES LTD
 * *****************************************************************
 *
 * @author - ANTOOBA TECHNOLOGIES LTD
 * @email - info@antoobagroup.com
 * @date: 22/01/2022
 * @time: 4:00 PM
 * ****************************************************************
 */
const NagadPaymentGatewayHelper =  require("./helper/index");
const {success, failure} = require("./helper/responseStatus");
const ERROR_LIST = require("./helper/errorList");
const ERROR_MESSAGE = require("./helper/errorMessage");

const merchantId = "683002007104225";
const amount = 50.55;
const orderId = "LOLLLLLLLLL1216514"
const random = NagadPaymentGatewayHelper.generateRandomString()

class NagadPaymentGateway {
    async test(req, res){
        // try{
            const date = await NagadPaymentGatewayHelper.EncryptDataWithPublicKey("lol")
            const dec = await NagadPaymentGatewayHelper.DecryptDataWithPrivateKey(date)
            return res
                .status(ERROR_LIST.HTTP_OK)
                .send(success(ERROR_MESSAGE.HTTP_OK, {date : date, dec: dec}))
        // } catch (err) {
        //     return res
        //         .status(ERROR_LIST.HTTP_INTERNAL_SERVER_ERROR)
        //         .send(failure(ERROR_MESSAGE.HTTP_INTERNAL_SERVER_ERROR))
        // }
    }
}

module.exports = new NagadPaymentGateway();
