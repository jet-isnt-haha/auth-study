require('dotenv').config();

module.exports = {
    db: {
        host: process.env.DB_HOST || '127.0.0.1',
        port: process.env.DB_PORT || 27017,
        name: process.env.DB_NAME || 'auth'
    },
    redis: {
        url: process.env.REDIS_URL || 'redis://localhost:6379'
    },
    jwt: {
        accessSecret: process.env.JWT_ACCESS_SECRET || 'access_secret',
        refreshSecret: process.env.JWT_REFRESH_SECRET || 'refresh_secret',
        accessExpireIn: '15m',
        refreshExpiresIn: '7d'
    },
    email: {
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    }
}
