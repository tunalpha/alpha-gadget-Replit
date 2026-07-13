import { MongoClient, Db, ObjectId } from "mongodb";
import { logger } from "./logger";

const MONGO_URL = process.env["MONGO_URL"];
const DB_NAME = process.env["DB_NAME"] || "alphabit_gadget";

if (!MONGO_URL) {
  throw new Error("MONGO_URL must be set");
}

let client: MongoClient;
let db: Db;

export async function connectMongo(): Promise<void> {
  if (db) return;
  client = new MongoClient(MONGO_URL!);
  await client.connect();
  db = client.db(DB_NAME);
  logger.info({ dbName: DB_NAME }, "Connected to MongoDB");
}

export function getDb(): Db {
  if (!db) throw new Error("MongoDB not connected. Call connectMongo() first.");
  return db;
}

export { ObjectId };

export function serializeDoc(doc: Record<string, unknown>): Record<string, unknown> {
  if (!doc) return doc;
  const { _id, ...rest } = doc;
  return { id: _id ? _id.toString() : undefined, ...rest };
}
