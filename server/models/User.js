const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: true,
        min: 6,
        max: 127
    },
    email: {
        type: String,
        required: true,
        min: 6,
        max: 255
    },
    password: {
        type: String,
        required: true,
        min: 8,
        max: 1024 
    },
    date: {
        type: Date,
        default: Date.now
    },
    roles: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Role'
        }
    ]
},
{
    toJSON: {
        virtuals: true
    },
    toObject: {
        virtuals: true
    }
});

userSchema.virtual('TicketHistory', {
    ref: 'Ticket',
    localField: '_id',
    foreignField: 'user',
    justOne: false
})

const userModel = mongoose.model('User', userSchema);

module.exports = userModel;