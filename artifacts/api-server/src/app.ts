import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { pinoHttp } from "pino-http";
import { logger } from "./lib/logger";
import { connectMongo } from "./lib/mongo";
import routes from "./routes";

const app = express();

app.use(
  pinoHttp({
    logger,
    autoLogging: { ignore: (req) => req.url === "/api/healthz" },
  })
);

app.use(
  cors({
    origin: true,
    credentials: true,
  })
);

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Connect MongoDB (non-fatal: server starts anyway, routes will 500 until DB is reachable)
connectMongo().catch((err) => {
  logger.error({ err }, "MongoDB connection failed — check MONGO_URL secret. Server will keep running.");
});

app.use("/api", routes);

export default app;
