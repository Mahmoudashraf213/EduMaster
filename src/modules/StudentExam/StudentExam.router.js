import { Router } from "express";
import { isAuthenticated } from "../../middleware/authentication.js";
import { isAuthorized } from "../../middleware/autheraization.js";
import { roles } from "../../utils/constant/enums.js";
import { isValid } from "../../middleware/vaildation.js";
import { asyncHandler } from "../../middleware/asyncHandler.js";
import { getExamScore, getRemainingTime, getStudentScore, startExam, submitExam } from "./StudentExam.controller.js";
import { getRemainingTimeVal, getStudentScoreVal, startExamVal, submitExamVal } from "./StudentExam.vaildation.js";

const studentExamRouter = Router();

// Route to start an exam
studentExamRouter.post('/start/:examId',
  isAuthenticated(),
  isAuthorized([roles.USER, roles.ADMIN , roles.SUPER_ADMIN]),
  isValid(startExamVal),
  asyncHandler(startExam)
);

// Route to submit answers for an exam
studentExamRouter.post('/submit/:examId',
  isAuthenticated(),
  isAuthorized([roles.USER, roles.ADMIN , roles.SUPER_ADMIN]),
  isValid(submitExamVal),
  asyncHandler(submitExam)
);

// remaining time 
studentExamRouter.get('/exams/remaining-time/:examId',
  isAuthenticated(),
  isAuthorized([roles.USER, roles.ADMIN , roles.SUPER_ADMIN]),
  isValid(getRemainingTimeVal),
  asyncHandler(getRemainingTime)
)

// get all student exam 
studentExamRouter.get('/exams/:examId',
  isAuthenticated(),
  isAuthorized([roles.ADMIN , roles.SUPER_ADMIN]),
  asyncHandler(getExamScore)
)

// get score to student 
studentExamRouter.get('/exams/score/:examId',
  isAuthenticated(),
  isAuthorized([roles.USER, roles.ADMIN , roles.SUPER_ADMIN]),
  isValid(getStudentScoreVal),
  asyncHandler(getStudentScore)
)


export default studentExamRouter;