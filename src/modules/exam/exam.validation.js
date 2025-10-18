import joi from "joi";
import { generalFields } from "../../middleware/vaildation.js";

// add Exam validation
export const addExamVal = joi.object({
  title: generalFields.title.trim().min(5).required(),
  description: generalFields.description.optional(),
  duration: generalFields.duration,
  questions: generalFields.questions,
  classLevel: generalFields.classLevel.required(),
  // questions: generalFields.questions.optional(),
  isPublished: generalFields.isPublished,
  startDate: generalFields.startDate.required(),
  endDate: generalFields.endDate.required(),
});

// Update Exam validation
export const updateExamVal = joi.object({
  title: generalFields.title.trim().min(5).optional(),
  description: generalFields.description.optional(),
  duration: generalFields.duration.optional(),
  questions: generalFields.questions.optional(),
  classLevel: generalFields.classLevel.optional(),
  isPublished: generalFields.isPublished.optional(),
  endDate: generalFields.endDate.optional(),
  startDate: generalFields.startDate.optional(),
  examId: generalFields.objectId.required()
});

// Get a specific exam by ID vaildation
export const getExamByIDVal = joi.object({
  examId: generalFields.objectId.required(),
})

// delete exam validation
export const deleteExamVal = joi.object({
  examId: generalFields.objectId.required(),
})