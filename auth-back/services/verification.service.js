const { redisClient } = require("../utils");

//验证码服务
const createVerificationService = ({ redisClient }) => {

    const generateEmailCode = () => {
        return Math.floor(Math.random() * 900000 + 100000).toString().slice(-6);
    };

    const saveEmailCode = async (email, code) => {
        await redisClient.set(
            `email_code:${email}`,
            code,
            { EX: 10 * 60 }
        )
    };

    const verifyEmailCode = async (email, code) => {
        const savedCode = await redisClient.get(`email_code:${email}`);
        if (!savedCode || savedCode !== code) {
            throw new Error('验证码无效或已过期');
        }
        //验证成功后删除
        await redisClient.del(`email_code:${email}`);
    };

    const verifyConfirmPassword = async (confirmPassword, password) => {
        return new Promise((resolve, reject) => {
            if (confirmPassword === password) {
                resolve();
            } else {
                reject(new Error("Confirm password does not match password"));
            }
        })
    };

    const verifyCaptcha = async (captcha, ansCaptcha) => {
        return new Promise((resolve, reject) => {
            if (ansCaptcha === captcha) {
                resolve();
            } else {
                reject(new Error("captcha is not correct"));
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