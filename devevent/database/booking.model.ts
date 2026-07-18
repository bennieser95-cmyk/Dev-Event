import mongoose, { Schema, Model, Types, HydratedDocument, CallbackError } from "mongoose";
import Event from "./event.model";

/**
 * Attributes stored on a Booking document. Timestamps are managed by Mongoose.
 */
export interface IBooking {
    eventId: Types.ObjectId;
    email: string;
    createdAt: Date;
    updatedAt: Date;
}

export type BookingDocument = HydratedDocument<IBooking>;

// RFC 5322-lite email regex — good enough for form validation without false-negatives on common addresses.
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const BookingSchema = new Schema<IBooking>(
    {
        // Reference to the parent Event; indexed for efficient lookups by event.
        eventId: {
            type: Schema.Types.ObjectId,
            ref: "Event",
            required: true,
            index: true,
        },
        email: {
            type: String,
            required: true,
            trim: true,
            lowercase: true,
            validate: {
                validator: (value: string) => EMAIL_REGEX.test(value),
                message: "{VALUE} is not a valid email address",
            },
        },
    },
    { timestamps: true }
);

/**
 * Pre-save hook: ensure the referenced Event actually exists before persisting
 * the booking. Prevents dangling references from clients passing stale IDs.
 */
BookingSchema.pre("save", async function (next) {
    try {
        if (this.isNew || this.isModified("eventId")) {
            const exists = await Event.exists({ _id: this.eventId });
            if (!exists) {
                throw new Error(`Referenced Event "${this.eventId.toString()}" does not exist`);
            }
        }
        next();
    } catch (error) {
        next(error as CallbackError);
    }
});

// Reuse the compiled model across hot reloads in development.
const Booking: Model<IBooking> =
    (mongoose.models.Booking as Model<IBooking>) ||
    mongoose.model<IBooking>("Booking", BookingSchema);

export default Booking;
