const nodemailer = require('nodemailer');
const config = require('../config');
const { ERRORS } = require('../constants');

//发送邮件服务
const createEmailSendService = () => {

    const transporter = nodemailer.createTransport({
        host: config.email.host,//QQ邮箱的SMTP服务器
        port: config.email.port,//QQ邮箱的SMTP端口
        secure: true,
        auth: {
            user: config.email.user,//发件人邮箱
            pass: config.email.pass,//邮箱授权码
        }
    })

    const sendVerificationCode = async (toEmail, code) => {
        try {
            await transporter.sendMail({
                from: config.email.sendMail.from,//发件人
                to: toEmail,//收件人
                subject: config.email.sendMail.subject,
                html: config.email.sendMail.html(code) //邮件内容
            });
            return true;
        } catch (error) {
            console.error('Fail to send', error);
            throw ERRORS.AUTH.EMAIL_CODE_SEND_FAILED;
        }

    };

    return { sendVerificationCode };

}

module.exports = createEmailSendService;