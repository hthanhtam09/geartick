import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import mongoose from "mongoose";

export const GET = async () => {
  try {
    // First check if MONGODB_URI is configured
    const mongoUri = process.env.MONGODB_URI;

    if (!mongoUri) {
      return NextResponse.json(
        {
          success: false,
          message: "MONGODB_URI environment variable is not configured",
          error: "Please add MONGODB_URI to your .env.local file",
          timestamp: new Date().toISOString(),
        },
        { status: 500 }
      );
    }

    // Validate URI format (without exposing the actual URI)
    const isValidUri =
      mongoUri.startsWith("mongodb://") ||
      mongoUri.startsWith("mongodb+srv://");
    if (!isValidUri) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid MongoDB URI format",
          error: "MONGODB_URI must start with 'mongodb://' or 'mongodb+srv://'",
          timestamp: new Date().toISOString(),
        },
        { status: 500 }
      );
    }

    // Test MongoDB connection
    await connectDB();

    // Check connection status
    const connectionState = mongoose.connection.readyState;
    const connectionStates = {
      0: "disconnected",
      1: "connected",
      2: "connecting",
      3: "disconnecting",
    };

    if (connectionState === 1) {
      return NextResponse.json({
        success: true,
        message: "MongoDB connection is healthy",
        status:
          connectionStates[connectionState as keyof typeof connectionStates],
        database: mongoose.connection.db?.databaseName,
        host: mongoose.connection.host,
        timestamp: new Date().toISOString(),
      });
    } else {
      return NextResponse.json(
        {
          success: false,
          message: "MongoDB connection is not ready",
          status:
            connectionStates[connectionState as keyof typeof connectionStates],
          timestamp: new Date().toISOString(),
        },
        { status: 503 }
      );
    }
  } catch (error: unknown) {
    console.error("MongoDB Health Check Failed:", error);

    let errorMessage = "Database connection failed";
    let troubleshooting = "Check your network connection and try again.";

    if (error instanceof Error) {
      if (error.name === "MongooseServerSelectionError") {
        errorMessage = "Cannot connect to MongoDB Atlas";
        troubleshooting =
          "Your IP address is not whitelisted. Add your IP to MongoDB Atlas Network Access.";
      } else if (error.name === "MongooseTimeoutError") {
        errorMessage = "Database connection timed out";
        troubleshooting =
          "Check your network connection or increase timeout settings.";
      } else if (error.message.includes("ENOTFOUND")) {
        errorMessage = "MongoDB server not found";
        troubleshooting = "Check your MONGODB_URI connection string.";
      }
    }

    return NextResponse.json(
      {
        success: false,
        message: errorMessage,
        troubleshooting,
        error:
          process.env.NODE_ENV === "development"
            ? error instanceof Error
              ? error.message
              : "Unknown error"
            : undefined,
        timestamp: new Date().toISOString(),
      },
      { status: 503 }
    );
  }
};
