import { lessonRouter, authRouter, userRouter, questionRouter, examRouter } from "./modules/index.js";
import { globalErrorHandling } from "./utils/appError.js";

export const bootStrap = (app, express) => {
    // parse req
    app.use(express.json());
    // routing
    app.use("/auth", authRouter);
    app.use("/user", userRouter);
    app.use("/lesson", lessonRouter);
    app.use("/exam",examRouter)
    app.use("/question",questionRouter);
    // global error
    app.use(globalErrorHandling);
};
