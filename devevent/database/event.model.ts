import mongoose, { Schema, Model, HydratedDocument, CallbackError } from "mongoose";

/**
 * Attributes stored on an Event document. Timestamps are managed by Mongoose.
 */
export interface IEvent {
    title: string;
    slug: string;
    description: string;
    overview: string;
    image: string;
    venue: string;
    location: string;
    date: string;
    time: string;
    mode: string;
    audience: string;
    agenda: string[];
    organizer: string;
    tags: string[];
    createdAt: Date;
    updatedAt: Date;
}

export type EventDocument = HydratedDocument<IEvent>;

// Reusable validator for required, non-empty strings (trim-aware).
const requiredString = {
    type: String,
    required: true,
    trim: true,
    validate: {
        validator: (value: string) => value.trim().length > 0,
        message: "{PATH} must be a non-empty string",
    },
};

// Reusable validator for required, non-empty string arrays.
const requiredStringArray = {
    type: [String],
    required: true,
    validate: {
        validator: (value: string[]) =>
            Array.isArray(value) && value.length > 0 && value.every((v) => v.trim().length > 0),
        message: "{PATH} must contain at least one non-empty string",
    },
};

const EventSchema = new Schema<IEvent>(
    {
        title: requiredString,
        // Slug is auto-generated in the pre-save hook; unique index enforced below.
        slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
        description: requiredString,
        overview: requiredString,
        image: requiredString,
        venue: requiredString,
        location: requiredString,
        date: requiredString,
        time: requiredString,
        mode: requiredString,
        audience: requiredString,
        agenda: requiredStringArray,
        organizer: requiredString,
        tags: requiredStringArray,
    },
    { timestamps: true }
);

// Explicit unique index on slug (redundant with `unique: true` but self-documenting).
EventSchema.index({ slug: 1 }, { unique: true });

/**
 * Convert an arbitrary string into a URL-friendly slug.
 * Lowercases, strips diacritics, and collapses non-alphanumeric runs into hyphens.
 */
function slugify(input: string): string {
    return input
        .normalize("NFKD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");
}

/**
 * Normalize a date string to ISO 8601 (`YYYY-MM-DD`).
 * Throws if the input cannot be parsed as a valid date.
 */
function normalizeDate(input: string): string {
    const parsed = new Date(input);
    if (Number.isNaN(parsed.getTime())) {
        throw new Error(`Invalid date value: "${input}"`);
    }
    return parsed.toISOString().slice(0, 10);
}

/**
 * Normalize a time string to 24-hour `HH:mm` format.
 * Accepts `H:mm`, `HH:mm`, `HH:mm:ss`, or `h:mm AM/PM`.
 */
function normalizeTime(input: string): string {
    const trimmed = input.trim();

    const twelveHour = /^(\d{1,2}):(\d{2})\s*(AM|PM)$/i.exec(trimmed);
    if (twelveHour) {
        const [, hourStr, minuteStr, meridiem] = twelveHour;
        let hour = parseInt(hourStr, 10) % 12;
        if (meridiem.toUpperCase() === "PM") hour += 12;
        const minute = parseInt(minuteStr, 10);
        if (minute < 0 || minute > 59) throw new Error(`Invalid time value: "${input}"`);
        return `${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`;
    }

    const twentyFourHour = /^(\d{1,2}):(\d{2})(?::\d{2})?$/.exec(trimmed);
    if (twentyFourHour) {
        const hour = parseInt(twentyFourHour[1], 10);
        const minute = parseInt(twentyFourHour[2], 10);
        if (hour < 0 || hour > 23 || minute < 0 || minute > 59) {
            throw new Error(`Invalid time value: "${input}"`);
        }
        return `${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`;
    }

    throw new Error(`Invalid time value: "${input}"`);
}

/**
 * Pre-save hook:
 *  - Regenerates the slug only when the title changes (or on initial insert).
 *  - Normalizes `date` to ISO and `time` to 24-hour format when modified.
 */
EventSchema.pre("save", function (next) {
    try {
        if (this.isModified("title") || this.isNew) {
            this.slug = slugify(this.title);
        }
        if (this.isModified("date") || this.isNew) {
            this.date = normalizeDate(this.date);
        }
        if (this.isModified("time") || this.isNew) {
            this.time = normalizeTime(this.time);
        }
        next();
    } catch (error) {
        next(error as CallbackError);
    }
});

// Reuse the compiled model across hot reloads in development.
const Event: Model<IEvent> =
    (mongoose.models.Event as Model<IEvent>) || mongoose.model<IEvent>("Event", EventSchema);

export default Event;
