//业务错误码

module.exports = {

    //认证错误（1000-1999）
    AUTH: {
        INVALID_EMAIL_CODE: {
            code: 1002,
            status: 400,
            message: "邮箱验证码错误或已过期",
        },
        INVALID_CAPTCHA: {
            code: 1003,
            status: 400,
            message: "图形验证码错误或已过期"
        },
        INVALID_CONFIRM_PWD: {
            code: 1004,
            status: 400,
            message: "无效的确认密码"
        },
        EXISTED_USER: {
            code: 1005,
            status: 400,
            message: "用户已存在"
        },
        REGISTER_FAILED: {
            code: 1006,
            status: 500,
            message: "用户注册失败"
        },
        INVALID_CREDENTIALS: {
            code: 1007,
            status: 400,
            message: '账号或密码错误'
        },
        USER_NOT_FOUND: {
            code: 1008,
            status: 400,
            message: "用户不存在"
        },
        LOGIN_FAILED: {
            code: 1009,
            status: 500,
            message: "登录失败"
        },
        EMAIL_CODE_SEND_FAILED: {
            code: 1010,
            status: 500,
            message: "邮箱验证码发送失败"
        }


    },

    //业务错误(2000-2999)
    USER: {



    }


}