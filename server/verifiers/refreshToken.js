const RefreshToken = require('../models/RefreshToken');
const { v4: uuidv4 } = require('uuid');

async function createRefreshToken(user) {
    let _token = uuidv4();

    let _refreshToken = new RefreshToken({
        token: _token,
        user: user._id,
    });

    let refreshToken = await _refreshToken.save();
    return refreshToken.token;
}

function verifyRefreshExpire(token) {
    return token.expiryDate.getTime() < new Date().getTime();
}

module.exports.createRefreshToken = createRefreshToken;
module.exports.verifyRefreshExpire = verifyRefreshExpire;