const mongoose = require('mongoose');

const ticketSchema = new mongoose.Schema({
    seatNumber: Number,
    datePurchased: {
        type: Date,
        default: Date.now
    },
    isUsed: {
        type: Boolean,
        default: false
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    screening: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Screening',
        required: true
    }
},
{
    toJSON: {
        virtuals: true
    },
    toObject: {
        virtuals: true
    }
});

ticketSchema.virtual('TicketScreeningDetail', {
    ref: 'Screening',
    localField: 'screening',
    foreignField: '_id',
    justOne: false
});

const ticketModel = mongoose.model('Ticket', ticketSchema);

module.exports = ticketModel;


