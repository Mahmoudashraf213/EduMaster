import cors from 'cors';
import { lessonRouter, authRouter, userRouter, questionRouter, examRouter, adminRouter, studentExamRouter } from "./modules/index.js";
import { globalErrorHandling } from "./utils/appError.js";

export const bootStrap = (app, express) => {
    // parse req
    app.use(express.json());
    // cors edit
    const corsOptions = {
        origin: '*',
        methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
        credentials: true,
    };
    app.use(cors(corsOptions));

    // routing
    app.use("/auth", authRouter);
    app.use("/user", userRouter);
    app.use("/lesson", lessonRouter);
    app.use("/exam", examRouter);
    app.use("/question", questionRouter);
    app.use("/admin", adminRouter);
    app.use("/studentExam", studentExamRouter);

    // global error
    app.use(globalErrorHandling);
};
