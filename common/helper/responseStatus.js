const ERROR_LIST = require('./errorList')
const ERROR_MESSAGE = require('./errorMessage')

const success = (res, message, data = {}) => {
    const response = {
        success: true,
        statusCode: ERROR_LIST.HTTP_OK,
        message: message,
        body: ""
    }
    response.body = Array.isArray(data) || typeof data === "object"
    ? data : {status: Number.isInteger(data)? true : data}

    return res.json(response);
}

const notModified = (res, message, data = {}) => {
    return res.json({
        success: false,
        statusCode: ERROR_LIST.HTTP_NOT_MODIFIED,
        message: ERROR_MESSAGE.HTTP_NOT_MODIFIED,
        body: data
    });
}
const notFound = (res, message, data) => {
    return res.json({
        success: false,
        statusCode: ERROR_LIST.HTTP_NO_CONTENT,
        message: ERROR_MESSAGE.HTTP_NO_CONTENT,
        body: data
    });
}
const failure = (res, message, errors = {}) => {
    return res.json({
        success: false,
        statusCode: ERROR_LIST.HTTP_INTERNAL_SERVER_ERROR,
        message: message,
        errors: errors
    });
}

module.exports = {success, notModified, notFound, failure}
