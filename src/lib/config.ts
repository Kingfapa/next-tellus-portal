import { logger } from "./logger";
import { configSchema } from "./schema";

export const loadConfig = (NODE_ENV: "development" | "production" | "test") => {
  try {
    const isProd = NODE_ENV === "production";
    return configSchema.validateSync({
      ENDPOINT: isProd ? process.env.TELLUS_ENDPOINT : process.env.DEV_TELLUS_ENDPOINT,
      USERNAME: isProd ? process.env.TELLUS_USERNAME : process.env.DEV_TELLUS_USERNAME,
      PASSWORD: isProd ? process.env.TELLUS_PASSWORD : process.env.DEV_TELLUS_PASSWORD,
      HTTPS_SSL_CERT: isProd ? process.env.HTTPS_SSL_CERT : "",
      HTTPS_SSL_KEY: isProd ? process.env.HTTPS_SSL_KEY : ""
    });
  } catch (error) {
    logger.error(error);
    throw new Error(
      "Could not LoadConfig, probably a validationError, double check your .env.local file"
    );
  }
};
