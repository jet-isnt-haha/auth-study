const express = require('express');
const svgCaptcha = require('svg-captcha');
const router = express.Router();


router.get('/captcha', (req, res) => {
    const captcha = svgCaptcha.create();
    req.session.captcha = captcha.text;

    res.type('svg');
    res.send(captcha.data);
})

module.exports = router;