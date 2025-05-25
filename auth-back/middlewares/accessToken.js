//校验accessToken的中间件以来保护业务接口

const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    try {
        const authHeader = req.get('Authorization');
        if (!authHeader) throw new Error('No token');
        const token = authHeader.split(' ')[1];
        const payload = jwt.verify(token, 'access_secret');
        req.currUser = payload;//{userId,role}

        next();

    } catch (error) {
        return res.status(401).json({
            code: 'accessTokenError',
            msg: 'accessToken 校验失败',
        })
    }
}