import { Router } from "express";
import { isValid } from "../../middleware/vaildation.js";
import { forgotPasswordVal, resetPasswordVal, updatePasswordVal, updateUserVal } from "./user.validation.js";
import { deleteUser, forgotPassword, getProfile, resetPassword, updatePassword, updateUser } from "./user.controller.js";
import { asyncHandler } from "../../middleware/asyncHandler.js";
import { roles } from "../../utils/constant/enums.js";
import { isAuthorized } from "../../middleware/autheraization.js";
import { isAuthenticated } from "../../middleware/authentication.js";


const userRouter = Router()

// forgot password
userRouter.post('/forgot-password', isValid(forgotPasswordVal), asyncHandler(forgotPassword));
// reset password
userRouter.post('/reset-password', isValid(resetPasswordVal), asyncHandler(resetPassword));

// update user acount
userRouter.put('/:userId',
    isAuthenticated(),
    isAuthorized([roles.USER, roles.ADMIN , roles.SUPER_ADMIN]),
    isValid(updateUserVal),
    asyncHandler(updateUser)
)
// delete user 
userRouter.delete('/',
    isAuthenticated(),
    isAuthorized([roles.ADMIN, roles.USER , roles.SUPER_ADMIN]),
    asyncHandler(deleteUser)
)
// get profile
userRouter.get('/',
    isAuthenticated(),
    isAuthorized([roles.USER, roles.ADMIN , roles.SUPER_ADMIN]),
    asyncHandler(getProfile)
)

// update password
userRouter.patch('/update-password',
    isAuthenticated(),
    isAuthorized([roles.USER, roles.ADMIN , roles.SUPER_ADMIN]),
    isValid(updatePasswordVal),
    asyncHandler(updatePassword)
)

export default userRouter