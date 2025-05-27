//控制器处理请求/响应;
const config = require('../config');



const createAuthController = ({ authService }) => {
    const login = async (req, res) => {
        try {
            const { email, password } = req.body;
            const userAgent = req.headers['user-agent'];
            const result = await authService.login(email, password, userAgent);
            res.cookie('refreshToken', result.tokens.refreshToken, {
                httpOnly: true,
                // secure:true
                sameSite: 'strict',//只允许同源请求携带，防止CSRF
                maxAge: 7 * 24 * 60 * 60,//** 配置修改处*/
            })
            return res.json({
                code: 'success',
                msg: 'login success',
                data: {
                    accessToken: result.tokens.accessToken,
                    user: result.user
                }
            });

        } catch (error) {
            console.log('gggg');
            return res.status(error.status || 500).json({
                code: error.code || 'serverError',
                msg: error.message || '服务器错误'
            })
        }
    };

    return {
        login
    };
}

module.exports = createAuthController;