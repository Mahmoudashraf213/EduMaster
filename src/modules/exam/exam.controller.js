import { Exam, Question } from "../../../db/index.js";
import { AppError } from "../../utils/appError.js";
import { messages } from "../../utils/constant/messages.js";

// add exam
export const addExam = async (req, res, next) => {
  // Get data from the request
  const { title, description, duration, questions, classLevel, isPublished, startDate, endDate } = req.body;

  // Check if an exam with the same title already exists
  const existingExam = await Exam.findOne({ title });
  if (existingExam) {
    return next(new AppError(messages.exam.alreadyExist, 400));
  }

  // Prepare data for the new exam
  const exam = new Exam({
    title,
    description,
    duration,
    questions,
    createdBy: req.authUser._id,
    classLevel,
    isPublished,
    startDate,
    endDate,
  });

  // Save the exam to the database
  const createdExam = await exam.save();
  if (!createdExam) {
    return next(new AppError(messages.exam.failToCreate, 500));
  }

  // Populate the questions field
  const populatedExam = await createdExam.populate([{ path: 'questions' }]);

  // Send response
  return res.status(201).json({
    message: messages.exam.created,
    success: true,
    data: populatedExam,
  });
};

// Logic for when a student starts the exam
export const startExamForStudent = (exam, studentStartTime) => {
  // Calculate student's end time based on the start time and the exam duration
  const studentEndTime = new Date(new Date(studentStartTime).getTime() + exam.duration * 60000);
  return {
    studentStartTime,
    studentEndTime,
  };
};

// update exam
export const updateExam = async (req, res, next) => {
  const { examId } = req.params; // Get exam ID from params
  let {
    title,
    description,
    duration,
    questions,
    classLevel,
    isPublished,
    endDate,
    startDate
  } = req.body; // Get exam data from request body

  title = title ? title.toLowerCase() : null;

  // Check if the exam exists
  const examExist = await Exam.findById(examId);
  if (!examExist) {
    return next(new AppError(messages.exam.notExist, 404));
  }

  // Check if the title is already in use by another exam
  if (title) {
    const titleExist = await Exam.findOne({ title, _id: { $ne: examId } });
    if (titleExist) {
      return next(new AppError(messages.exam.alreadyExist, 400));
    }
  }

  // Update fields if they are provided in the request
  if (title) examExist.title = title;
  if (description) examExist.description = description;
  if (duration) examExist.duration = duration;
  if (questions) examExist.questions = questions;
  if (classLevel) examExist.classLevel = classLevel;
  if (typeof isPublished !== "undefined") examExist.isPublished = isPublished;
  if (endDate) examExist.endDate = endDate;
  if (startDate) examExist.startDate = startDate;

  // Save the updated exam
  const examUpdated = await examExist.save();
  if (!examUpdated) {
    return next(new AppError(messages.exam.failToUpdate, 500));
  }

  // Send response with the updated exam
  return res.status(200).json({
    message: messages.exam.updated,
    success: true,
    data: examUpdated,
  });
};


// get all exams 
export const getAllExams = async (req, res, next) => {
  // Fetch all exams with populated questions
  const exams = await Exam.find().populate("questions");

  if (!exams) {
    return next(new AppError(messages.exam.failToFetch, 500));
  }

  // Send response
  return res.status(200).json({
    message: messages.exam.fetchedSuccessfully,
    success: true,
    data: exams,
  });
};

// get exam by id 
export const getExamById = async (req, res, next) => {
  // Get the exam ID from the request params
  const { examId } = req.params;

  // Find the exam by ID and populate it to questions 
  const examExist = await Exam.findById(examId)
    .populate('questions')
  // .populate('createdBy'); 

  // If exam does not exist
  if (!examExist) {
    return next(new AppError(messages.exam.notExist, 404));
  }

  // Send response with the fetched exam
  return res.status(200).json({
    message: messages.exam.fetchedSuccessfully,
    success: true,
    data: examExist,
  });
};

// delete exam 
export const deleteExam = async (req, res, next) => {
  // Get the exam ID from the request params
  const { examId } = req.params;

  // Check if the exam exists
  const examExist = await Exam.findById(examId);
  if (!examExist) {
    return next(new AppError(messages.exam.notExist, 404));
  }

  // Delete all related questions that belong to the exam
  await Question.deleteMany({ exam: examId });

  // Delete the exam itself
  const deleteExam = await Exam.findByIdAndDelete(examId);
  if (!deleteExam) {
    return next(new AppError(messages.exam.failToDelete, 500));
  }

  // Send response
  return res.status(200).json({
    message: messages.exam.deleted,
    success: true
  });
};