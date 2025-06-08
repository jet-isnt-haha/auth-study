//控制器处理请求/响应;
const { SUCCESS } = require('../constants');
const config = require('../config');

const createAuthController = ({ authService, verificationService, emailSendService }) => {
    const login = async (req, res) => {
        try {
            const { email, password } = req.body;
            const userAgent = req.headers['user-agent'];
            const result = await authService.login(email, password, userAgent);

            res.cookie('refreshToken', result.tokens.refreshToken, {
                httpOnly: true,
                // secure:true
                sameSite: 'strict',//只允许同源请求携带，防止CSRF
                maxAge: config.jwt.refreshExpiresIn,
            })
            return res.json({
                ...SUCCESS.LOGIN,
                data: {
                    accessToken: result.tokens.accessToken,
                    user: result.user
                }
            });

        } catch (error) {
            return res.status(error.status).json({
                code: error.code || 'serverError',
                msg: error.message || '服务器错误'
            })
        }
    };

    const sendEmailCode = async (req, res) => {
        try {
            const { email } = req.body;
            const code = verificationService.generateEmailCode();

            await Promise.all([
                verificationService.saveEmailCode(email, code),
                emailSendService.sendVerificationCode(email, code)
            ])
            return res.json({
                ...SUCCESS.EMAIL_CODE
            })
        } catch (error) {
            return res.status(error.status).json({
                code: error.code,
                msg: error.message,
            })
        }
    };


    const register = async (req, res) => {
        try {
            const { email, password, confirmPassword, emailCode, captcha } = req.body;

            const ansCaptcha = req.session.captcha;
            delete req.session.captcha;

            await Promise.all([
                verificationService.verifyEmailCode(email, emailCode),
                verificationService.verifyConfirmPassword(confirmPassword, password),
                verificationService.verifyCaptcha(captcha, ansCaptcha),
            ])

            await authService.register(email, password);
            return res.json({
                ...SUCCESS.REGISTER
            })

        } catch (error) {
            return res.status(error.status).json({
                code: error.code || 'serverError',
                msg: error.message || '服务器错误'
            })
        }
    }

    return {
        login,
        sendEmailCode,
        register,
    };
}

module.exports = createAuthController;