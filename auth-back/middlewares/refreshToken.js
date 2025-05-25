//校验refresh中间件（只在refresh-token接口检验，从incookie里取）

const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    try {
        const token = req.cookies.refreshToken;
        if (!token) throw new Error('No refresh token');
        const payload = jwt.verify(token, 'refresh_secret');
        req.refreshUser = payload;

        next();

    } catch (error) {
        return res.status(401).json({
            code: 'refreshTokenError',
            msg: 'refreshToken 校验失败'
        })
    }
}