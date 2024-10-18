import { User } from "../../DB/index.js"
import { AppError } from "../utils/appError.js"
import { status } from "../utils/constant/enums.js"
import { messages } from "../utils/constant/messaeges.js"
import { verifyToken } from "../utils/token.js"

export const isAuthenticated = () => {
    return async (req, res, next) => {
        // token from headers
        const { token } = req.headers
        if (!token) {
            return next(new AppError("token not provided", 401))
        }
        // decoded token 
        const payload = verifyToken({ token })
        // if token is valid
        if (payload.message) {
            return next(new AppError(payload.message, 401))
        }
        // check user exist 
        const authUser = await User.findOne({ _id: payload._id, status: status.VERIFIED })
        if (!authUser) {
            return next(new AppError(messages.user.notExist, 404))
        }
        // set user to req
        req.authUser = authUser
        next()
    }
}