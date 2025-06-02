//路由层分发路由

const express = require('express');
const router = express.Router();
const UserModel = require('../models/user.model');
const { redisClient } = require('../utils');
const createAuthService = require('../services/auth.service');
const createAuthController = require('../controllers/auth.controller');
const createEmailSendService = require('../services/email-send.service');
const createVerificationService = require('../services/verification.service');
const { emailCodeLimiter } = require('../middlewares');


//依赖注入(通过工厂函数注入依赖,便于测试和维护)
const authService = createAuthService({ userModel: UserModel, redisClient });

const emailSendService = createEmailSendService();

const verificationService = createVerificationService({ redisClient })

const authController = createAuthController({ authService, verificationService, emailSendService });

//登录路由
router.post('/login', authController.login);

//发送邮箱验证码路由
router.post('/email-code', emailCodeLimiter, authController.sendEmailCode);

//注册路由
router.post('/register', authController.register);

module.exports = router;