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

// MongoDB error interface
interface MongoServerError extends Error {
  code?: number;
  codeName?: string;
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

        // Handle authentication errors specifically
        const mongoError = error as MongoServerError;
        if (error.name === "MongoServerError" && mongoError.code === 8000) {
          console.error(
            "🔐 AUTHENTICATION ERROR: Invalid username or password"
          );
          console.error("🚨 SOLUTION: Update your MONGODB_URI in .env.local:");
          console.error("   1. Go to https://cloud.mongodb.com");
          console.error("   2. Navigate to Database Access");
          console.error("   3. Click 'Edit' on your database user");
          console.error("   4. Click 'Edit Password' and set a new password");
          console.error("   5. Copy the new connection string");
          console.error(
            "   6. Update MONGODB_URI in .env.local with the new password"
          );
          console.error("");
          console.error(
            "   Current URI format: mongodb+srv://username:password@cluster..."
          );
          console.error("   Make sure the username and password are correct!");
        }

        // Handle other common errors
        if (error.name === "MongoParseError") {
          console.error(
            "🔗 INVALID CONNECTION STRING: Check your MONGODB_URI format"
          );
          console.error(
            "   Format should be: mongodb+srv://username:password@cluster..."
          );
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

    // Retry logic for transient errors (but not auth errors)
    const mongoError = e as MongoServerError;
    if (
      retries > 0 &&
      e instanceof Error &&
      e.name !== "MongooseServerSelectionError" &&
      !(e.name === "MongoServerError" && mongoError.code === 8000)
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
