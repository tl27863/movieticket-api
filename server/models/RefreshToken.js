const mongoose = require('mongoose');

const refreshTokenSchema = new mongoose.Schema({
    token: String,
    expiryDate: {
        type: Date,
        default: Date.now() + 3600 * 24 * 3 * 1000
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
});

refreshTokenSchema.index({ createdAt: 1 }, { expireAfterSeconds: 3600 * 24 * 3 });

const refreshToken = mongoose.model('RefreshToken', refreshTokenSchema);

module.exports = refreshToken;