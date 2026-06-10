import mongoose from "mongoose";

let memoryServer;

export async function connectDatabase() {
  const uri = process.env.MONGODB_URI;

  try {
    await mongoose.connect(uri, { serverSelectionTimeoutMS: 2500 });
    console.log(`MongoDB connected: ${uri}`);
    return { mode: "configured", uri };
  } catch (error) {
    const allowFallback =
      process.env.NODE_ENV !== "production" &&
      process.env.USE_MEMORY_DB !== "false";

    if (!allowFallback) throw error;

    console.warn(`Configured MongoDB unavailable: ${error.message}`);
    console.warn("Starting embedded MongoDB for local development...");

    const { MongoMemoryServer } = await import("mongodb-memory-server");
    memoryServer = await MongoMemoryServer.create({
      instance: { dbName: "novalearn" }
    });
    const memoryUri = memoryServer.getUri();
    await mongoose.connect(memoryUri);
    console.log(`Embedded MongoDB connected: ${memoryUri}`);
    return { mode: "embedded", uri: memoryUri };
  }
}

export async function disconnectDatabase() {
  await mongoose.disconnect();
  if (memoryServer) await memoryServer.stop();
}
