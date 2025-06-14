
import mongoose from "mongoose";


if (!MONGODB_URI) {
    throw new Error("Please define mongo_URI in ev")
}

let cached = global.monogoose

if (!cached) {
    cached = global.monogoose = { conn: null, promise: null }
}

export async function connectToDatabase() {
    if (cached.conn) {
        return cached.conn;
    }
    if (!cached.promise) {

        const opts = {
            bufferCommands: true,
            // maxPollSize: 10
        }
        mongoose.connect(MONGODB_URI, opts).then(() => mongoose.connection);
    }

    try {
        cached.conn = await cached.promise
    }
    catch (error) {
        cached.promise = null;
        throw error
    }
    return cached.conn
}