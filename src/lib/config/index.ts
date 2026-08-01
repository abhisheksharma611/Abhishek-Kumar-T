import { logger } from "@/lib/logger";

interface AppConfig {
  email: {
    user: string;
    pass: string;
  };
}

let _config: AppConfig | null = null;

function loadConfig(): AppConfig {
  const user = process.env.EMAIL_USER;
  const pass = process.env.EMAIL_PASS;

  if (!user || !pass) {
    const msg = "EMAIL_USER and EMAIL_PASS must be set in environment";
    logger.error("Config validation failed", {
      hasUser: !!user,
      hasPass: !!pass,
    });
    throw new Error(msg);
  }

  return {
    email: { user, pass },
  };
}

export function getConfig(): AppConfig {
  if (!_config) {
    _config = loadConfig();
  }
  return _config;
}

export function hasConfig(): boolean {
  return !!process.env.EMAIL_USER && !!process.env.EMAIL_PASS;
}
