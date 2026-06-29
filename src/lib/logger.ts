import pino from "pino";

const logger = pino({
  level: process.env.LOG_LEVEL || "info",
  transport:
    process.env.NODE_ENV === "development"
      ? { target: "pino-pretty", options: { colorize: true } }
      : undefined,
  redact: {
    paths: ["req.headers.cookie", "req.headers.authorization", "password", "passwordHash"],
    censor: "[REDACTED]",
  },
  serializers: {
    req: (req) => ({
      method: req.method,
      url: req.url,
    }),
    err: pino.stdSerializers.err,
  },
});

export function createContextLogger(context: string) {
  return logger.child({ context });
}

export default logger;
