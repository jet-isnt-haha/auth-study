module.exports = function (sucess, error) {
    if (typeof error !== 'function') {
        error = () => {
            console.log('connection failed');
        }
    }

    //导入 mongoose
    const mongoose = require('mongoose');

    //导入配置项
    const { DBHOST, DBPORT, DBNAME } = require('../config/index');

    //连接mongodb服务
    mongoose.connect(`mongodb://${DBHOST}:${DBPORT}/${DBNAME}`);

    //设置回调
    mongoose.connection.once('open', () => {
        sucess();
    })

    mongoose.connection.on('error', () => {
        error();
    })

    mongoose.connection.on('close', () => {
        console.log('connection closed');
    })
}