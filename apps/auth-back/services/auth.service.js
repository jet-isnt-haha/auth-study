//服务层处理业务逻辑
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const { ERRORS } = require('../constants');
const config = require('../config');



//创建认证服务工厂函数
const createAuthService = ({ userModel, redisClient }) => {
    //私有方法
    const validateUser = async (email, password) => {
        const user = await userModel.findOne({ email });
        if (!user) {
            throw ERRORS.AUTH.USER_NOT_FOUND;
        }
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            throw ERRORS.AUTH.INVALID_CREDENTIALS;
        }
        return user;
    };


    const generateTokens = (userId, role) => {
        const accessToken = jwt.sign(
            { userId, role },
            config.jwt.accessSecret,
            { expiresIn: config.jwt.accessExpiresIn }
        );

        const refreshToken = uuidv4();

        return { accessToken, refreshToken };
    };

    const updateRefreshToken = async (refreshToken, userId, userAgent) => {
        //先查找该用户现有的token
        const oldToken = await redisClient.get(config.redis.prefix.userToken(userId));

        //如果存在旧的refreshToken，删除它
        if (oldToken) {
            await redisClient.del(config.redis.prefix.refreshToken(oldToken));
        }


        //保存新的refreshToken
        await redisClient.set(
            config.redis.prefix.refreshToken(refreshToken),
            JSON.stringify({ userId, userAgent }),
            { EX: config.jwt.refreshExpiresIn }
        )

        //更新用户的refreshToken映射（该机制防止同一端多次登录产生多个refreshtoken与用户信息的键值对在redis中）
        await redisClient.set(
            config.redis.prefix.userToken(userId),
            refreshToken,
            { EX: config.jwt.refreshExpiresIn }
        )
    };



    //公开方法
    const login = async (email, password, userAgent) => {

        try {
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
        } catch (error) {
            if (error.code) {
                throw error;
            } else {
                throw ERRORS.AUTH.LOGIN_FAILED;
            }
        }

    };

    const register = async (email, password) => {
        try {
            const user = await userModel.create({
                email,
                password,
                name: uuidv4().slice(-6).toString(),
            })
            return user;
        } catch (error) {
            if (error.code === 11000 && error.keyPattern && error.keyPattern.email) {
                throw ERRORS.AUTH.EXISTED_USER;
            }
            else {
                throw ERRORS.AUTH.REGISTER_FAILED;
            }
        }

    }
    return {
        login,
        register
    };
}

module.exports = createAuthService;