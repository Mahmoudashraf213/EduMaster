// import modules
import joi from 'joi';
import { AppError } from '../utils/appError.js';
import { highSchool, questionTypes } from '../utils/constant/enums.js';

export const generalFields = {
    fullName: joi.string(),
    email: joi.string().email(),
    password: joi.string().pattern(new RegExp(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/)),
    cpassword: joi.string().valid(joi.ref('password')),
    confirmPassword: joi.string().valid(joi.ref('newPassword')),
    phoneNumber: joi.string().pattern(new RegExp(/^01[0-2,5]{1}[0-9]{8}$/)),
    classLevel: joi.string().valid(...Object.values(highSchool)),
    DOB: joi.string()
        .regex(/^\d{4}-(0?[1-9]|1[0-2])-(0?[1-9]|[12][0-9]|3[01])$/)
        .message('Date of birth must be in format YYYY-M-D or YYYY-MM-DD'),
    objectId: joi.string().hex().length(24),
    otp: joi.string().length(6),
    title: joi.string(),
    description: joi.string().min(10).max(1000),
    video: joi.string().pattern(new RegExp(/^(https?\:\/\/)?(www\.youtube\.com|youtu\.?be)\/.+$/)),
    type: joi.string().valid(...Object.values(questionTypes)),
    options: joi.array().items(joi.string()).when('type', {
        is: questionTypes.MULTIPLE_CHOICE,
        then: joi.required(),
        otherwise: joi.forbidden(),
    }),
    correctAnswer: joi.string(),
    points: joi.number().min(1),
    duration: joi.number().required().min(10),
    questions: joi.array().items(joi.string().length(24).hex()),
    isPublished: joi.boolean().default(false),
    startDate: joi.date(),
    endDate: joi.date().greater(joi.ref("startDate")),
    answers: joi.array().items(joi.object({
        questionId: joi.string().hex().length(24).required(),
        selectedAnswer: joi.string().required(),
    })).min(1).required(),
    price: joi.number().min(0),
    scheduledDate: joi.date()
        .iso() // صيغة ISO 8601 مثل: "2025-06-21T10:00:00Z"
        .greater('now')
        .required()
        .messages({
            'date.base': 'Scheduled date must be a valid date',
            'date.greater': 'Scheduled date must be in the future',
            'any.required': 'Scheduled date is required'
        })
}

export const isValid = (schema) => {
    return (req, res, next) => {
        let data = { ...req.body, ...req.params, ...req.query }
        const { error } = schema.validate(data, { abortEarly: false })
        if (error) {
            const errorMessage = error.details.map(detail => detail.message).join(', ');
            return next(new AppError(errorMessage, 400));
        }
        next()
    }
}
