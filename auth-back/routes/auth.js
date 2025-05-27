// const express = require('express');
// const jwt = require('jsonwebtoken');
// const { v4: uuidv4 } = require('uuid');
// const router = express.Router();
// const UserModel = require('../models/user.model');
// const { redisClient } = require('../utils');



// router.post('/login', async (req, res) => {
//     try {
//         const { email, password } = req.body;

//         //查找用户
//         const user = await UserModel.findOne({ email });
//         if (!user) {
//             return res.status(401).json({ code: 'emailorpwderror', msg: '用户不存在' })
//         }
//         //校验密码
//         const isMatch = await user.comparePassword(password);

//         if (!isMatch) {
//             return res.status(401).json({
//                 code: 'emailorpwderror',
//                 msg: '密码错误'
//             })
//         }

//         //生成accessToken和refreshToken

//         //payload的两个参数放必要、非敏感，用于鉴权和权限相关内容
//         const accessToken = jwt.sign(
//             { userId: user._id, role: user.role },
//             'access_secret',
//             { expiresIn: '15m' }
//         )

//         //生成refreshToken（随机字符串）
//         const refreshToken = uuidv4();

//         //存入Redis，设置过期时间（通常来说是7天与其cookie时间一致也与Redis的性质相符
//         await redisClient.set(
//             `refreshToken:${refreshToken}`,
//             JSON.stringify({ userId: user._id, userAgent: req.header['user-agent'] }),
//             { EX: 7 * 24 * 60 * 60 }
//         )

//         //设置refresh-token的cookie，使其相对安全
//         res.cookie('refreshToken', refreshToken, {
//             httpOnly: true,
//             // secure:true
//             sameSite: 'strict',//只允许同源请求携带，防止CSRF
//             maxAge: 7 * 24 * 60 * 60 * 1000
//         })
//         //返回accessToken和用户信息
//         return res.json({
//             code: 'success',
//             msg: 'login success',
//             data: {
//                 accessToken,
//                 user: {
//                     id: user._id,
//                     email: user.email,
//                     name: user.name,
//                     role: user.role
//                 }
//             }
//         })
//     } catch (error) {
//         console.log(error);
//         return res.status(500).json({
//             code: 'serverError',
//             msg: '服务器错误'
//         })
//     }
// })

// module.exports = router