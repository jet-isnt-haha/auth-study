const rateLimit = require('express-rate-limit');

const normalizeEmail = (email) => {
    if (!email || typeof email !== 'string') return null;
    return email.toLowerCase().trim();
};

const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

/**
 * 邮箱验证码频率限制中间件
 * windowMs: 时间窗口，单位毫秒
 * limit: 在时间窗口内允许的最大请求次数
 */
const createEmailCodeLimiter = () => {
    return rateLimit({
        windowMs: 60 * 1000, // 1分钟
        max: 3, // 每个IP每分钟最多3次
        statusCode: 429, // Too Many Requests
        standardHeaders: true, // 启用 RateLimit-* 头
        legacyHeaders: false, // 禁用 X-RateLimit-* 头
        keyGenerator: (req) => {
            const email = normalizeEmail(req.body.email);
            if (email && isValidEmail(email)) {
                return `email:${email}`;
            }
            return `ip:${req.ip}`;
        },//指定限流标准，若有email则指定限流邮箱，若无则指定ip为限流标准
        /*   skip: (req) => {
              // 可以根据条件跳过限制，比如白名单
              return process.env.NODE_ENV === 'development';
          }, */
        skip: (req) => {
            // 跳过本机请求（localhost 或 127.0.0.1 或 ::1）
            return req.ip === '127.0.0.1' || req.ip === '::1';
        },
        handler: (req, res) => {
            res.status(429).json({
                code: 'error',
                message: 'You have exceeded the rate limit for this API.',
                data: null
            });
        }
    });
};


module.exports = createEmailCodeLimiter();