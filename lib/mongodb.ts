import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI!;

if (!MONGODB_URI) {
  throw new Error(
    "Please define the MONGODB_URI environment variable inside .env.local"
  );
}

interface MongooseConnection {
  conn: mongoose.Connection | null;
  promise: Promise<mongoose.Connection> | null;
}

// Add mongoose property to NodeJS.Global interface
declare global {
  // eslint-disable-next-line no-var
  var mongoose: MongooseConnection | undefined;
}

let cached: MongooseConnection = global.mongoose || {
  conn: null,
  promise: null,
};

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

const connectDB = async (retries = 3): Promise<mongoose.Connection> => {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
      // Connection timeout settings to prevent long waits
      serverSelectionTimeoutMS: 10000, // 10 seconds
      socketTimeoutMS: 45000, // 45 seconds
      connectTimeoutMS: 10000, // 10 seconds
      // Retry settings
      maxPoolSize: 10,
      minPoolSize: 5,
      maxIdleTimeMS: 30000,
      // Additional stability options
      retryWrites: true,
      retryReads: true,
    };

    cached.promise = mongoose
      .connect(MONGODB_URI, opts)
      .then((mongoose) => {
        console.log("✅ Connected to MongoDB Atlas successfully");
        return mongoose.connection;
      })
      .catch((error) => {
        console.error("❌ MongoDB connection error:", error.message);

        // Provide specific guidance based on error type
        if (error.name === "MongooseServerSelectionError") {
          console.error(
            "🚨 SOLUTION: Add your IP address to MongoDB Atlas Network Access:"
          );
          console.error("   1. Go to https://cloud.mongodb.com");
          console.error("   2. Navigate to Network Access");
          console.error("   3. Click 'Add IP Address'");
          console.error("   4. Click 'Add Current IP Address'");
          console.error("   5. Click 'Confirm'");
        }

        // Reset the promise so we can retry
        cached.promise = null;
        throw error;
      });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    console.error("❌ Failed to establish MongoDB connection:", e);

    // Retry logic for transient errors
    if (
      retries > 0 &&
      e instanceof Error &&
      e.name !== "MongooseServerSelectionError"
    ) {
      console.log(`🔄 Retrying connection... (${retries} attempts remaining)`);
      await new Promise((resolve) => setTimeout(resolve, 2000)); // Wait 2 seconds
      return connectDB(retries - 1);
    }

    throw e;
  }

  return cached.conn;
};

export default connectDB;
