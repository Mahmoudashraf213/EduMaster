import { LessonPurchase, User } from "../../../db/index.js";
import { Lesson } from "../../../db/models/lessonModel.js";
import { createOrder, getAuthToken, getPaymentKey } from "../../services/payment.js";
import { buildLessonFilter } from "../../utils/apiFeatures.js";
import { AppError } from "../../utils/appError.js";
import { roles } from "../../utils/constant/enums.js";
import { messages } from "../../utils/constant/messages.js";

// add lesson 
export const addLesson = async (req, res, next) => {
    // get data from req 
    let { title, description, video, classLevel, price, scheduledDate } = req.body;
    title = title.toLowerCase()
    // check existance
    const existLesson = await Lesson.findOne({ title });
    if (existLesson) {
        return next(new AppError(messages.lesson.alreadyExist, 400));
    }
    // prepare data
    const lesson = new Lesson({
        title,
        description,
        video,
        classLevel,
        price,
        scheduledDate,
        createdBy: req.authUser._id
    })
    // add to db
    const addedLesson = await lesson.save()
    // handel fail
    if (!addedLesson) {
        return next(new AppError(messages.lesson.failToCreate, 500))

    }
    // send res
    return res.status(201).json({
        message: messages.lesson.created,
        success: true,
        data: addedLesson
    })
}

// update lesson
export const updateLesson = async (req, res, next) => {
    // get data from req
    const { lessonId } = req.params;
    let { title, description, video, classLevel, price, scheduledDate } = req.body;
    title = title.toLowerCase()
    // check existance 
    const lessonExist = await Lesson.findById(lessonId)
    if (!lessonExist) {
        return next(new AppError(messages.lesson.notExist, 404))
    }
    // check name exist 
    const titleExist = await Lesson.findOne({ title, _id: { $ne: lessonId } });
    if (titleExist) {
        return next(new AppError(messages.lesson.alreadyExist, 400));
    }
    // update if provided
    if (title) lessonExist.title = title;
    if (description) lessonExist.description = description;
    if (video) lessonExist.video = video;
    if (classLevel) lessonExist.classLevel = classLevel;
    if (price !== undefined) lessonExist.price = price;
    if (scheduledDate) lessonExist.scheduledDate = scheduledDate;
    // save update 
    const lessonUpdated = await lessonExist.save()
    // handel fail 
    if (!lessonUpdated) {
        return next(new AppError(messages.lesson.failToUpdate, 500))
    }
    // send res
    return res.status(200).json({
        message: messages.lesson.updated,
        success: true,
        data: lessonUpdated
    })
}

// get lessons to spesefic classLevel
export const getLessons = async (req, res, next) => {
    const { role, classLevel } = req.authUser;

    const filter = buildLessonFilter(req.query, role, classLevel);

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const sortBy = req.query.sortBy || 'createdAt';
    const sortOrder = req.query.sortOrder === 'asc' ? 1 : -1;

    const lessons = await Lesson.find(filter)
        .sort({ [sortBy]: sortOrder })
        .skip(skip)
        .limit(limit);

    const total = await Lesson.countDocuments(filter);

    res.status(200).json({
        message: "Lessons fetched successfully",
        success: true,
        data: lessons,
        pagination: {
            total,
            page,
            totalPages: Math.ceil(total / limit),
        }
    });
};

// get lesson by id
export const getLessonById = async (req, res, next) => {
    // get data from req
    const { lessonId } = req.params;
    const classLevel = req.authUser.classLevel
    const user = req.authUser;
    // check existance
    const lessonExist = await Lesson.findById(lessonId)
    // handel fail
    if (!lessonExist) {
        return next(new AppError(messages.lesson.notExist, 404))
    }
    // check classLevel only for users
    if (req.authUser.role === roles.USER && lessonExist.classLevel !== req.authUser.classLevel) {
        return next(new AppError(messages.user.unauthorized, 403));
    }
    // 4. If lesson is paid, check if the user purchased it
    if (lessonExist.isPaid) {
        const hasAccess = await LessonPurchase.findOne({
            user: user._id,
            lesson: lessonId
        });

        if (!hasAccess) {
            return next(new AppError("You need to purchase this lesson to access it", 403));
        }
    }
    // send res
    return res.status(200).json({
        message: messages.lesson.fetchedSuccessfully,
        success: true,
        data: lessonExist
    })
}

// delete lesson 
export const deleteLesson = async (req, res, next) => {
    // get data from req
    const { lessonId } = req.params;
    // check existance
    const lessonExist = await Lesson.findById(lessonId)
    if (!lessonExist) {
        return next(new AppError(messages.lesson.notExist, 404))
    }
    // delete lesson 
    const deleteLesson = await Lesson.findByIdAndDelete(lessonId)
    // handel fail
    if (!deleteLesson) {
        return next(new AppError(messages.lesson.failToDelete, 500))
    }
    // send res
    return res.status(200).json({
        message: messages.lesson.deleted,
        success: true
    })
}

// // pay lesson
// export const payLesson = async (req, res, next) => {
//     // get data from req
//     const { lessonId } = req.params;
//     const userId = req.authUser._id;
//     // check existance ,paid
//     const lesson = await Lesson.findById(lessonId);
//     if (!lesson || !lesson.isPaid) {
//         return next(new AppError("Lesson not found or it's free", 404))
//     }
//     const user = await User.findById(userId);
//     if (!user) {
//         return next(new AppError("User not found", 404));
//     }

//     // Construct billing data based on user information
//     const billingData = {
//         apartment: "NA",
//         email: user.email,                  // Use user's email
//         floor: "NA",
//         first_name: user.fullName,          // Use user's full name
//         last_name: 'NA',
//         street: "NA",                       // Use street address (assuming you have an address field)
//         building: "NA",
//         phone_number: user.phoneNumber,     // User's phone number
//         shipping_method: "NA",
//         city: "Cairo",                      // City (use default value if not provided)
//         country: "EG",                      // Ensure the correct country code
//         state: "NA"
//     };
//     // acreate auth token
//     const authToken = await getAuthToken();
//     if (!authToken) {
//         return next(new AppError('Failed to authenticate with payment provider', 500));
//     }
//     // create order
//     const orderId = await createOrder(authToken, userId, lesson.price * 100);
//     if (!orderId) {
//         return next(new AppError('Failed to create order', 500));
//     }
//     // get paymentkey
//     const paymentKey = await getPaymentKey(authToken, orderId, lesson.price * 100, billingData);
//     if (!paymentKey) {
//         return next(new AppError('Failed to get payment key', 500));
//     }
//     // console.log("Generated paymentKey:", paymentKey);
//     // create url
//     const paymentUrl = `https://accept.paymob.com/api/acceptance/iframes/${process.env.IFRAME_ID}?payment_token=${paymentKey}`;

//     // send res 
//     res.status(200).json({
//         message: 'Payment URL generated successfully',
//         success: true,
//         paymentUrl
//     });
// }

export const payLesson = async (req, res, next) => {
    const { lessonId } = req.params;
    const userId = req.authUser._id;

    // 1. check lesson
    const lesson = await Lesson.findById(lessonId);
    if (!lesson || !lesson.isPaid) {
        return next(new AppError("Lesson not found or it's free", 404));
    }

    // 2. get user
    const user = await User.findById(userId);
    if (!user) {
        return next(new AppError("User not found", 404));
    }

    // 3. billing data
    const billingData = {
        apartment: "NA",
        email: user.email,
        floor: "NA",
        first_name: user.fullName,
        last_name: 'NA',
        street: "NA",
        building: "NA",
        phone_number: user.phoneNumber,
        shipping_method: "NA",
        city: "Cairo",
        country: "EG",
        state: "NA"
    };

    // 4. paymob integration
    const authToken = await getAuthToken();
    const orderId = await createOrder(authToken, userId, lesson.price * 100);
    const paymentKey = await getPaymentKey(authToken, orderId, lesson.price * 100, billingData);

    const paymentUrl = `https://accept.paymob.com/api/acceptance/iframes/${process.env.IFRAME_ID}?payment_token=${paymentKey}`;

    // ✅ 5. record payment immediately (simulate paid)
    const existingPurchase = await LessonPurchase.findOne({ user: userId, lesson: lessonId });
    if (!existingPurchase) {
        await LessonPurchase.create({
            user: userId,
            lesson: lessonId,
            paidAt: new Date(),
            amount: lesson.price,
            transactionId: orderId.toString() // just use Paymob order ID as mock transaction ID
        });
    }

    // 6. send URL
    return res.status(200).json({
        message: 'Payment URL generated and lesson access granted (simulated)',
        success: true,
        paymentUrl
    });
};


// verify payment
export const verifyPayment = async (req, res, next) => {
    const { lessonId } = req.params;
    const userId = req.authUser._id;

    const lesson = await Lesson.findById(lessonId);
    if (!lesson || !lesson.isPaid) {
        return next(new AppError("Lesson not found or it's free", 404));
    }

    const existingPurchase = await LessonPurchase.findOne({ user: userId, lesson: lessonId });
    if (existingPurchase) {
        return res.status(200).json({
            message: "You already have access to this lesson",
            success: true,
            data: existingPurchase
        });
    }

    const newPurchase = await LessonPurchase.create({
        user: userId,
        lesson: lessonId,
        amount: lesson.price,
        transactionId: "manual-confirm-" + Date.now()
    });

    return res.status(201).json({
        message: "Lesson unlocked successfully",
        success: true,
        data: newPurchase
    });
};

// Get all lessons the user has purchased
export const getPurchasedLessons = async (req, res, next) => {
    const userId = req.authUser._id;

    const purchases = await LessonPurchase.find({ user: userId })
        .populate('lesson'); // populate lesson data

    // Extract only lessons
    const lessons = purchases.map(p => p.lesson);

    return res.status(200).json({
        message: 'Purchased lessons retrieved successfully',
        success: true,
        data: lessons,
    });
};