//服务层处理业务逻辑
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const config = require('../config');



//创建认证服务工厂函数
const createAuthService = ({ userModel, redisClient }) => {
    //私有方法
    const validateUser = async (email, password) => {
        const user = await userModel.findOne({ email });
        if (!user) {
            const error = new Error('用户不存在');
            error.status = 401;
            error.code = 'emailorpwderror';
            throw error;
        }
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            const error = new Error('密码错误');
            error.status = 401;
            error.code = 'emailorpwderror';
            throw error;
        }
        return user;
    }


    const generateTokens = (userId, role) => {
        const accessToken = jwt.sign(
            { userId, role },
            config.jwt.accessSecret,
            { expiresIn: config.jwt.accessExpireIn }
        );

        const refreshToken = uuidv4();

        return { accessToken, refreshToken };
    }

    const updateRefreshToken = async (refreshToken, userId, userAgent) => {
        //先查找该用户现有的token
        const oldToken = await redisClient.get(`user:${userId}:token`);

        //如果存在旧的refreshToken，删除它
        if (oldToken) {
            await redisClient.del(`refresh:${oldToken}`);
        }


        //保存新的refreshToken
        await redisClient.set(
            `refresh:${refreshToken}`,
            JSON.stringify({ userId, userAgent }),
            { EX: 7 * 24 * 60 * 60 }
        )

        //更新用户的refreshToken映射（该机制防止同一端多次登录产生多个refreshtoken与用户信息的键值对在redis中）
        await redisClient.set(
            `user:${userId}:token`,
            refreshToken,
            { EX: 7 * 24 * 60 * 60 }
        )
    }

    //公开方法
    const login = async (email, password, userAgent) => {
        const user = await validateUser(email, password);

        const tokens = generateTokens(user._id, user.role);
        await updateRefreshToken(tokens.refreshToken, user._id, userAgent);
        return {
            tokens,
            user: {
                id: user._id,
                email: user.email,
                name: user.name,
                role: user.role
            }
        }
    }
    return {
        login
    };
}

module.exports = createAuthService;