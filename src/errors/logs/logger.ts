import { createLogger, format, transports } from "winston";

const { combine, timestamp, printf } = format;

const fileFormat = printf(({ level, message, timestamp }) => {
  return `${timestamp} [${level}]: ${message}`;
});

const consoleFormat = printf(({ level, timestamp }) => {
  return `${timestamp} [${level}]: Error detected and logged`;
});

const logger = createLogger({
  level: "info",
  format: combine(
    timestamp(),
    format.metadata({ fillExcept: ["message", "level", "timestamp", "label"] })
  ),
  transports: [
    new transports.Console({
      level: "error",
      format: combine(timestamp(), consoleFormat),
    }),
    new transports.File({
      filename: "logs/error.log",
      level: "error",
      format: combine(timestamp(), fileFormat),
    }),
    new transports.File({
      filename: "logs/combined.log",
      format: combine(timestamp(), fileFormat),
    }),
  ],
});

export default logger;
