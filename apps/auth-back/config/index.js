require('dotenv').config();
const ms = require('ms');

module.exports = {
    db: {
        host: process.env.DB_HOST || '127.0.0.1',
        port: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 27017,
        name: process.env.DB_NAME || 'auth'
    },
    redis: {
        url: process.env.REDIS_URL || 'redis://localhost:6379',
        prefix: {
            emailCode: (email) => `email_code:${email}`,
            userToken: (userId) => `user:${userId}:token`,
            refreshToken: (token) => `refresh:${token}`
        }
    },
    jwt: {
        accessSecret: process.env.JWT_ACCESS_SECRET || 'access_secret',
        refreshSecret: process.env.JWT_REFRESH_SECRET || 'refresh_secret',
        accessExpiresIn: process.env.JWT_ACCESS_EXPIRESIN || '15m',
        refreshExpiresIn: ms(process.env.JWT_REFRESH_EXPIRESIN || '7d')
    },
    email: {
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
        emailExpiresIn: ms(process.env.EMAIL_EXPIRESIN || '60s'),
        sendMail: {
            from: `<${process.env.EMAIL_USER}>`,
            subject: '[Jet-verified_code]',
            html: (code) => `
            <div style="padding: 20px; background-color: #f8f9fa; border-radius: 5px;">
            <h2 style="color: #333;">您的验证码是：</h2>
            <h1 style="color: #007bff; font-size: 32px; letter-spacing: 5px;">${code}</h1>
            <p style="color: #666;">验证码10分钟内有效，请勿泄露给他人。</p>
            <p style="color: #999; font-size: 12px; margin-top: 20px;">此邮件由系统自动发送，请勿回复。</p>
            </div>
            `
        }
    }
}
