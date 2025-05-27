//路由层分发路由

const express = require('express');
const router = express.Router();
const UserModel = require('../models/user.model');
const { redisClient } = require('../utils');
const createAuthService = require('../services/auth.service');
const createAuthController = require('../controllers/auth.controller');

//依赖注入(通过工厂函数注入依赖,便于测试和维护)
const authService = createAuthService({ userModel: UserModel, redisClient });

const authController = createAuthController({ authService });

router.post('/login', authController.login);

module.exports = router;