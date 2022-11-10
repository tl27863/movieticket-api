const router = require('express').Router();
const Movie = require('../models/Movie');
const Screening = require('../models/Screening');
const Ticket = require('../models/Ticket');
const { movieValidation, screeningValidation, ticketValidation } = require('../verifiers/validation');
const { authToken, authRole } = require('../verifiers/tokenVerify');

router.post('/movie', authToken, authRole, async (req,res) => {
    const{ error } = movieValidation(req.body);
    if(error) return res.status(400).send({message: "invalidInput"});

    const duplicate = await Movie.findOne({title: req.body.title});
    if(duplicate) return res.status(400).send({message: "movieExist"});

    const dateReleased = new Date(req.body.dateReleased);

    const movie = new Movie({
        title: req.body.title,
        dateReleased: dateReleased,
        director: req.body.director,
        durationMinute: req.body.durationMinute,
        synopsis: req.body.synopsis,
        posterUrl: req.body.posterUrl,
        bannerUrl: req.body.bannerUrl
    });

    try {
        await movie.save();
        return res.status(200).send({message: "movieAdded"})
    } catch(err) {
        return res.status(502).send({message: "dbIssue"});
    }
});

router.post('/screening', authToken, authRole, async (req,res) => {
    const{ error } = screeningValidation(req.body);
    if(error) return res.status(400).send({message: "invalidInput"});

    const movie = await Movie.findOne({title: req.body.movie});
    if(!movie) return res.status(400).send({message: "NmovieExist"});

    const timeStart = new Date(req.body.timeStart);
    const timeEnd = new Date(req.body.timeEnd);

    const screening = new Screening({
        theater: req.body.theater,
        seatCount: req.body.seatCount,
        timeStart: timeStart,
        timeEnd: timeEnd,
        movie: movie._id
    });

    try {
        await screening.save();
        return res.status(200).send({message: "screeningAdded"})
    } catch(err) {
        return res.status(502).send({message: "dbIssue"});
    }
});

router.post('/ticket', authToken, authRole, async (req,res) => {
    const{ error } = ticketValidation(req.body);
    if(error) return res.status(400).send(error);

    const screening = await Screening.findById(req.body.screening);
    if(!screening) return res.status(400).send({message: "NscreeningExist"});

    const ticket = new Ticket({
        seatNumber: req.body.seatNumber,
        user: req.user._id,
        screening: screening._id
    });

    try {
        await ticket.save();
        return res.status(200).send({message: "ticketAdded"})
    } catch(err) {
        return res.status(502).send({message: "dbIssue"});
    }
});

router.get('/movie/list', authToken, async (req,res) => {
    try {
        let idx = 1;
        const list = await Movie.find({}, 'title director durationMinute bannerUrl');
        const movies = {};
        list.forEach((movie) => {
            movies[idx++] = movie;
        });
        res.status(200).send(movies);
    } catch(err){
        return res.status(502).send({message: "dbIssue"});
    }
    
})

router.get('/movie/screening', authToken, async (req,res) => {
    try {
        const movieId = req.body.movieId;
        const list = await Movie.findById(movieId)
            .populate('ScreeningList');
        res.status(200).send(list);
    } catch(err){
        return res.status(502).send(err);
    }
    
});

router.get('/screening/ticket', authToken, async (req,res) => {
    try {
        const screeningId = req.body.screeningId;
        const list = await Screening.findById(screeningId)
            .populate('AssignedTicket');
        res.status(200).send(list);
    } catch(err){
        return res.status(502).send(err);
    }
    
});

router.get('/user/ticket', authToken, async (req,res) => {
    try {
        let idx = 0;
        const userId = req.user._id;
        const ticket = await Ticket.find({ user: userId })
            .populate({
                path: 'TicketScreeningDetail',
                select: '-seatCount',
                populate: {
                    path: 'TicketMovieDetail',
                    select: 'title posterUrl bannerUrl'
                }
            });

        idx = 1;
        const tickets = {};
        ticket.forEach((tix) => {
            tickets[idx] = {
                id: tix._id,
                seatNumber: tix.seatNumber,
                datePurchased: tix.datePurchased,
                isUsed: tix.isUsed,
                theater: tix.TicketScreeningDetail[0].theater,
                timeStart: tix.TicketScreeningDetail[0].timeStart,
                timeEnd: tix.TicketScreeningDetail[0].timeEnd,
                title: tix.TicketScreeningDetail[0].TicketMovieDetail[0].title,
                posterUrl: tix.TicketScreeningDetail[0].TicketMovieDetail[0].posterUrl,
                bannerUrl: tix.TicketScreeningDetail[0].TicketMovieDetail[0].bannerUrl
            }
            idx++;
        })
        res.status(200).send(tickets);
    } catch(err){
        return res.status(502).send(err);
    }
    
})

module.exports = router;