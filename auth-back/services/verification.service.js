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
        if (!savedCode || saveEmailCode !== code) {
            throw new Error('验证码无效或已过期');
        }

        //验证成功后删除
        await redisClient.del(`email_code:${email}`);
    };

    return {
        generateEmailCode,
        saveEmailCode,
        verifyEmailCode,
    };

};

module.exports = createVerificationService;