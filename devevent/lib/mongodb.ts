import mongoose, { Mongoose } from "mongoose";

/**
 * Mongoose connection helper for the Next.js App Router.
 *
 * In development, Next.js hot-reloads modules on every change, which would
 * otherwise create a new database connection each time. To avoid exhausting
 * MongoDB's connection pool, we cache the connection (and any in-flight
 * connect promise) on the global object so it's reused across reloads.
 */

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
    throw new Error(
        "Please define the MONGODB_URI environment variable inside .env.local"
    );
}

// Shape of the cached connection stored on `globalThis`.
interface MongooseCache {
    conn: Mongoose | null;
    promise: Promise<Mongoose> | null;
}

// Extend the Node.js global type so TypeScript knows about our cache field.
declare global {
    // eslint-disable-next-line no-var
    var mongooseCache: MongooseCache | undefined;
}

// Reuse the cache if it already exists (survives HMR in development).
const cached: MongooseCache =
    global.mongooseCache ?? { conn: null, promise: null };

if (!global.mongooseCache) {
    global.mongooseCache = cached;
}

/**
 * Returns a connected Mongoose instance, creating the connection on first
 * call and reusing it on subsequent calls.
 */
export async function connectToDatabase(): Promise<Mongoose> {
    // Already connected — return the cached instance immediately.
    if (cached.conn) {
        return cached.conn;
    }

    // Connection in progress — await the existing promise instead of starting
    // a new one so concurrent callers share a single handshake.
    if (!cached.promise) {
        cached.promise = mongoose
            .connect(MONGODB_URI!, {
                // Disable buffering so failed queries surface immediately instead of
                // hanging until a connection is (maybe) established.
                bufferCommands: false,
            })
            .then((mongooseInstance) => mongooseInstance);
    }

    try {
        cached.conn = await cached.promise;
    } catch (error) {
        // Reset the promise so the next call can retry the connection.
        cached.promise = null;
        throw error;
    }

    return cached.conn;
}

export default connectToDatabase;
