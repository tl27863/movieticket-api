const mongoose = require('mongoose');

const screeningSchema = new mongoose.Schema({
    theater: String,
    seatCount: Number,
    timeStart: Date,
    timeEnd: Date,
    movie: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Movie',
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

screeningSchema.virtual('AssignedTicket', {
    ref: 'Ticket',
    localField: '_id',
    foreignField: 'screening',
    justOne: false
})

screeningSchema.virtual('TicketMovieDetail', {
    ref: 'Movie',
    localField: 'movie',
    foreignField: '_id',
    justOne: false
})

const screening = mongoose.model('Screening', screeningSchema);

module.exports = screening;
