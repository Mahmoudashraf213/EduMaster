import { Schema, model, Types } from "mongoose";

const lessonPurchaseSchema = new Schema({
    user: {
        type: Types.ObjectId,
        ref: "User",
        required: true
    },
    lesson: {
        type: Types.ObjectId,
        ref: "Lesson",
        required: true
    },
    paidAt: {
        type: Date,
        default: Date.now
    },
    amount: {
        type: Number,
        required: true
    },
    transactionId: {
        type: String,
        required: true
    }
}, { timestamps: true });
lessonPurchaseSchema.index({ user: 1, lesson: 1 }, { unique: true });

export const LessonPurchase = model("LessonPurchase", lessonPurchaseSchema);
