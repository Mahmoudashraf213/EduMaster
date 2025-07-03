import { roles } from "./constant/enums.js";

export const buildLessonFilter = (query, userRole, userClassLevel) => {
    const {
        title,
        classLevel,
        isPaid,
        priceMin,
        priceMax,
        scheduledAfter,
        scheduledBefore,
    } = query;

    const filter = {};

    // Filter by class level
    if (userRole !== roles.ADMIN) {
        filter.classLevel = userClassLevel;
    } else if (classLevel) {
        filter.classLevel = classLevel;
    }

    // Title search
    if (title) {
        filter.title = { $regex: title, $options: 'i' };
    }

    // isPaid flag
    if (typeof isPaid !== 'undefined') {
        filter.isPaid = isPaid.toString() === 'true';
    }

    // Price range
    if (priceMin || priceMax) {
        filter.price = {};
        if (priceMin) filter.price.$gte = Number(priceMin);
        if (priceMax) filter.price.$lte = Number(priceMax);
    }

    // Scheduled date
    const scheduledFilter = {};
    if (scheduledAfter) {
        const after = new Date(scheduledAfter);
        if (!isNaN(after)) scheduledFilter.$gte = after;
    }
    if (scheduledBefore) {
        const before = new Date(scheduledBefore);
        if (!isNaN(before)) scheduledFilter.$lte = before;
    }
    if (Object.keys(scheduledFilter).length > 0) {
        filter.scheduledDate = scheduledFilter;
    }

    return filter;
};
