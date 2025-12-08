import { Router } from 'express';
import { isAuthenticated } from '../../middleware/authentication.js';
import { isAuthorized } from '../../middleware/autheraization.js';
import { roles } from '../../utils/constant/enums.js';
import { isValid } from '../../middleware/vaildation.js';
import { addQuestionVal, deleteQuestionVal, getQuestionByIdVal, updateQuestionVal } from './question.vaildation.js';
import { asyncHandler } from '../../middleware/asyncHandler.js';
import { addQuestion, deleteQuestion, getAllQuestions, getQuestionById, updateQuestion } from './question.controller.js';


const questionRouter = Router();

// Add question
questionRouter.post('/',
    isAuthenticated(),
    isAuthorized([roles.ADMIN , roles.SUPER_ADMIN]),
    isValid(addQuestionVal),
    asyncHandler(addQuestion) 
);


// Update question route
questionRouter.put("/:questionId",
    isAuthenticated(), 
    isAuthorized([roles.ADMIN , roles.SUPER_ADMIN]),  
    isValid(updateQuestionVal), 
    asyncHandler(updateQuestion)  
);

// Get all questions route
questionRouter.get('/',
    isAuthenticated(), 
    isAuthorized([roles.ADMIN , roles.SUPER_ADMIN , roles.USER]),  
    asyncHandler(getAllQuestions)  
);

// Get a specific question by ID route
questionRouter.get('/get/:questionId',
    isAuthenticated(), 
    isAuthorized([roles.ADMIN , roles.USER , roles.SUPER_ADMIN]),
    isValid(getQuestionByIdVal),  
    asyncHandler(getQuestionById)  
);

// Delete question route
questionRouter.delete('/:questionId',
    isAuthenticated(),  
    isAuthorized([roles.ADMIN , roles.SUPER_ADMIN]), 
    isValid(deleteQuestionVal),
    asyncHandler(deleteQuestion) 
);
export default questionRouter;
