import { Router } from "express";
import { isAuthenticated } from "../../middleware/authentication.js";
import { isAuthorized } from "../../middleware/autheraization.js";
import { roles } from "../../utils/constant/enums.js";
import { isValid } from "../../middleware/vaildation.js";
import { addExamVal, deleteExamVal, getExamByIDVal, updateExamVal } from "./exam.validation.js";
import { asyncHandler } from "../../middleware/asyncHandler.js";
import { addExam, deleteExam, getAllExams, getExamById, updateExam } from "./exam.controller.js";

const examRouter = Router();

// Add exam route
examRouter.post("/",
  isAuthenticated(),
  isAuthorized([roles.ADMIN ,roles.SUPER_ADMIN ]),
  isValid(addExamVal), 
  asyncHandler(addExam) 
);

// Update exam route
examRouter.put("/:examId",
  isAuthenticated(),  
  isAuthorized([roles.ADMIN , roles.SUPER_ADMIN]),  
  isValid(updateExamVal),  
  asyncHandler(updateExam)  
);

// Get all exams route
examRouter.get("/",
  isAuthenticated(),
  isAuthorized([roles.ADMIN , roles.SUPER_ADMIN]),
  asyncHandler(getAllExams)
);


// Get a specific exam by ID route
examRouter.get('/get/:examId',
  isAuthenticated(), 
  isAuthorized([roles.ADMIN, roles.USER , roles.SUPER_ADMIN]),
  isValid(getExamByIDVal),
  asyncHandler(getExamById)
);


// Delete exam route
examRouter.delete('/:examId',
  isAuthenticated(),
  isAuthorized([roles.ADMIN , roles.SUPER_ADMIN]), 
  isValid(deleteExamVal),
  asyncHandler(deleteExam)  
);
export default examRouter;