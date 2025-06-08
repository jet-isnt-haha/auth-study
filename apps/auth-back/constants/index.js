const errorCode = require('./errorCode');
const successCode = require('./successCode');


const handleSuccessCode = (successCode) => Object.fromEntries(
    Object.entries(successCode).map(([key, value]) => [key, { ...value, status: 200, code: 0 }])
)


module.exports = {
    ERRORS: { ...errorCode },
    SUCCESS: { ...handleSuccessCode(successCode) }
}