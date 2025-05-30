//控制器处理请求/响应;

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
            return res.status(error.status || 500).json({
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
                code: 'success',
                msg: 'verified code has sended',
            })
        } catch (error) {
            return res.status(500).json({
                code: 'error',
                msg: error.message || 'failed to send',

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
                code: 'success',
                msg: 'register success',
            })

        } catch (error) {
            return res.status(error.status || 500).json({
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