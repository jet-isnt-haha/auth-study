const { ERRORS } = require('../constants');
const config = require('../config');
//验证码服务
const createVerificationService = ({ redisClient }) => {


    const generateEmailCode = () => {
        return Math.floor(Math.random() * 900000 + 100000).toString().slice(-6);
    };

    const saveEmailCode = async (email, code) => {
        await redisClient.set(
            config.redis.prefix.emailCode(email),
            code,
            { EX: config.email.emailExpiresIn }
        )
    };

    const verifyEmailCode = async (email, code) => {
        const savedCode = await redisClient.get(config.redis.prefix.emailCode(email));
        if (!savedCode || savedCode !== code) {
            throw ERRORS.AUTH.INVALID_EMAIL_CODE;
        }

        //验证成功后删除
        await redisClient.del(config.redis.prefix.emailCode(email));
    };

    const verifyConfirmPassword = async (confirmPassword, password) => {
        return new Promise((resolve, reject) => {
            if (confirmPassword === password) {
                resolve();
            } else {
                reject(ERRORS.AUTH.INVALID_CONFIRM_PWD);
            }
        })
    };

    const verifyCaptcha = async (captcha, ansCaptcha) => {
        return new Promise((resolve, reject) => {
            if (ansCaptcha === captcha) {
                resolve();
            } else {
                reject(ERRORS.AUTH.INVALID_CAPTCHA);
            }
        })
    }

    return {
        generateEmailCode,
        saveEmailCode,
        verifyEmailCode,
        verifyConfirmPassword,
        verifyCaptcha,
    };

};

module.exports = createVerificationService;