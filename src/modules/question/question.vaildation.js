import joi from 'joi';
import { generalFields } from '../../middleware/vaildation.js';


//  add question validation
export const addQuestionVal = joi.object({
    text: generalFields.title.required(),
    type: generalFields.type.required(),
    options: generalFields.options, 
    correctAnswer: generalFields.correctAnswer.required(),
    exam: generalFields.objectId.required(),
    points: generalFields.points.required(),
});

// Update Question validation
export const updateQuestionVal = joi.object({
    text: generalFields.title.optional().trim().min(5),
    type: generalFields.type.optional(),
    options: generalFields.options.optional(),
    correctAnswer: generalFields.correctAnswer.optional().required(),
    points: generalFields.points.optional().min(1),
    exam: generalFields.objectId.optional(),
    questionId: generalFields.objectId.required()
});

// get specific question validation
export const getQuestionByIdVal = joi.object({
    questionId: generalFields.objectId.required(),    
})

// delete question validation
export const deleteQuestionVal = joi.object({
    questionId: generalFields.objectId.required(),    
})