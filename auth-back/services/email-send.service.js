const nodemailer = require('nodemailer');
const config = require('../config');

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
                from: `<${config.email.user}>`,//发件人
                to: toEmail,//收件人
                subject: '[Jet-verified_code]',
                html: `
                  <div style="padding: 20px; background-color: #f8f9fa; border-radius: 5px;">
                        <h2 style="color: #333;">您的验证码是：</h2>
                        <h1 style="color: #007bff; font-size: 32px; letter-spacing: 5px;">${code}</h1>
                        <p style="color: #666;">验证码10分钟内有效，请勿泄露给他人。</p>
                        <p style="color: #999; font-size: 12px; margin-top: 20px;">此邮件由系统自动发送，请勿回复。</p>
                    </div>
            `//邮件内容
            });
            return true;
        } catch (error) {
            console.error('Fail to send', error);
            throw new Error('emailcode failed to send');
        }

    };

    return { sendVerificationCode };

}

module.exports = createEmailSendService;