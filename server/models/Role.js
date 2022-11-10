const mongoose = require('mongoose');

const roleModel = mongoose.model(
    'Role',
    new mongoose.Schema({
        name: String
    })
);

module.exports = roleModel;