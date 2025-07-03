import { model, Schema, Types } from "mongoose";
import { highSchool } from "../../src/utils/constant/enums.js";

// schema
const lessonSchema = new Schema({
    title: {
        type: String,
        trim: true,
        required: true
    },
    description: {
        type: String,
        trim: true,
        required: true
    },
    video: {
        type: String,
        required: true
    },
    classLevel: {
        type: String,
        required: true,
        enum: Object.values(highSchool),
    },
    price: {
        type: Number,
        default: 0
    },
    isPaid: {
        type: Boolean,
        default: false
    },
    scheduledDate: {
        type: Date,
        required: true
    },
    createdBy: {
        type: Types.ObjectId,
        ref: 'User',
        required: true
    }
}, { timestamps: true })

// Middleware to set isPaid based on price
lessonSchema.pre('save', function (next) {
    // Check if price is explicitly provided
    if (this.price >= 0) {
        this.isPaid = this.price > 0; // true if price > 0, false otherwise
    }
    next();
});


// model 
export const Lesson = model('Lesson', lessonSchema);