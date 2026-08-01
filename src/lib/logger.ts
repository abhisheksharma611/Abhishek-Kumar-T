type LogLevel = "debug" | "info" | "warn" | "error";

interface LogEntry {
  level: LogLevel;
  message: string;
  context?: Record<string, unknown>;
  timestamp: string;
}

function formatEntry(entry: LogEntry): string {
  const prefix = `[${entry.timestamp}] [${entry.level.toUpperCase()}]`;
  const context = entry.context ? ` ${JSON.stringify(entry.context)}` : "";
  return `${prefix} ${entry.message}${context}`;
}

function createEntry(level: LogLevel, message: string, context?: Record<string, unknown>): LogEntry {
  return {
    level,
    message,
    context,
    timestamp: new Date().toISOString(),
  };
}

export const logger = {
  debug(message: string, context?: Record<string, unknown>) {
    if (process.env.NODE_ENV === "development") {
      console.debug(formatEntry(createEntry("debug", message, context)));
    }
  },

  info(message: string, context?: Record<string, unknown>) {
    console.info(formatEntry(createEntry("info", message, context)));
  },

  warn(message: string, context?: Record<string, unknown>) {
    console.warn(formatEntry(createEntry("warn", message, context)));
  },

  error(message: string, context?: Record<string, unknown>) {
    console.error(formatEntry(createEntry("error", message, context)));
  },
};
