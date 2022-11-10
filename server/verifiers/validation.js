const Joi = require('@hapi/Joi');

const registerValidation = (data) => {
    const registerSchema = Joi.object({
        fullName: Joi.string()
            .min(6)
            .required(),
        email: Joi.string()
            .min(6)
            .required()
            .email(),
        password: Joi.string()
            .min(6)
            .required()
    });
    return registerSchema.validate(data);
};

const loginValidation = (data) => {
    const loginSchema = Joi.object({
        email: Joi.string()
            .min(6)
            .required()
            .email(),
        password: Joi.string()
            .min(6)
            .required()
    });
    return loginSchema.validate(data);
};

const movieValidation = (data) => {
    const movieSchema = Joi.object({
        title: Joi.string()
            .required(),
        dateReleased: Joi.date()
            .iso()
            .required(),
        director: Joi.string()
            .min(6)
            .required(),
        durationMinute: Joi.number()
            .required(),
        synopsis: Joi.string()
            .required(),
        posterUrl: Joi.string()
            .required(),
        bannerUrl: Joi.string()
            .required()
    });
    return movieSchema.validate(data);
};

const screeningValidation = (data) => {
    const screeningSchema = Joi.object({
        theater: Joi.string()
            .required(),
        seatCount: Joi.number()
            .required(),
        timeStart: Joi.date()
            .iso()
            .required(),
        timeEnd: Joi.date()
            .iso()
            .required(),
        movie: Joi.string()
            .required()
    });
    return screeningSchema.validate(data);
};

const ticketValidation = (data) => {
    const ticketSchema = Joi.object({
        seatNumber: Joi.number()
            .required(),
        screening: Joi.string()
            .required()
    });
    return ticketSchema.validate(data);
};

module.exports.registerValidation = registerValidation;
module.exports.loginValidation = loginValidation;
module.exports.movieValidation = movieValidation;
module.exports.screeningValidation = screeningValidation;
module.exports.ticketValidation = ticketValidation;