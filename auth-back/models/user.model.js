//模型层处理数据
const mongoose = require('mongoose');
const bcrypt = require('bcrypt')


const UsersSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    name: { type: String, default: '1234' },
    role: { type: String, enum: ['user', 'admin'], default: 'user' },
    isActive: { type: Boolean, default: false },
    createAt: { type: Date, default: Date.now },
    lastLoginAt: Date
})

//密码加密
UsersSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password, 10);
    next();
})

//比较密码

UsersSchema.methods.comparePassword = function (candidatePassword) {
    return bcrypt.compare(candidatePassword, this.password);
}

module.exports = mongoose.model('User', UsersSchema);