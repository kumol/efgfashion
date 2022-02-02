const success = (res, message, data = {}) => {
    const response = {
        success: true,
        statusCode: 200,
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
        statusCode: 304,
        message: "Not modified",
        body: data
    });
}
const notFound = (res, message, data) => {
    return res.json({
        success: false,
        statusCode: 204,
        message: "No content found",
        body: data
    });
}
const failure = (res, message, errors = {}) => {
    return res.json({
        success: false,
        statusCode: 500,
        message: message,
        errors: errors.stack
    });
}

module.exports = {success, notModified, notFound, failure}
