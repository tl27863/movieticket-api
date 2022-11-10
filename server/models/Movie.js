const mongoose = require('mongoose');

const movieSchema = new mongoose.Schema({
    title: String,
    dateReleased: Date,
    director: String,
    durationMinute: Number,
    synopsis: String,
    posterUrl: String,
    bannerUrl: String
},
{
    toJSON: {
        virtuals: true
    },
    toObject: {
        virtuals: true
    }
});

movieSchema.virtual('ScreeningList', {
    ref: 'Screening',
    localField: '_id',
    foreignField: 'movie',
    justOne: false
});

const movie = mongoose.model('Movie', movieSchema);

module.exports = movie;