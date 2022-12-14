import { readdir, readFile, rm } from "fs/promises";
import { formSchema } from "./schema";
import { logger } from "./logger";
import { tellusAPI } from "./TellusAPI";
import { mkdirp, move, outputFile } from "fs-extra";
import { join } from "path";
import { ValidationError } from "yup";

export class QueueHandler {
  active: boolean;
  path: string;
  failed_path: string;
  constructor(
    public config: {
      waitTime: number;
    }
  ) {
    this.active = false;
    this.path = process.env.DATA_PATH
      ? join(process.env.DATA_PATH, "/queue")
      : "./data/queue";
    this.failed_path = process.env.FAILED_DATA_PATH
      ? join(process.env.FAILED_DATA_PATH, "/failed")
      : "./data/failed";
  }

  async start() {
    if (!this.active) {
      logger.info("Starting Queue...");
      try {
        setInterval(async () => {
          await this.read();
        }, this.config.waitTime);
        this.active = true;
      } catch (error) {
        logger.log({
          level: "error",
          message: (error as Error).message,
        });
      }
    }
  }

  async read() {
    try {
      logger.info("Checking queue...");
      const queueFiles = await readdir(this.path);
      for (const fileName of queueFiles) {
        const data = await readFile(`${this.path}/${fileName}`, "utf-8");
        try {
          const form = await formSchema.validate(JSON.parse(data));
          const { result } = await tellusAPI.createCall(form, false);
          if (result.number) {
            await this.remove(fileName);
          }
        } catch (error) {
          if (error instanceof ValidationError) {
            logger.error(
              `Queue validation error: ${
                (error as Error).message
              } -> moving to failed...`
            );
            await this.remove(fileName);
          } else {
            logger.error(`Queue error: ${(error as Error).message}`);
          }
        }
      }
    } catch (err) {
      if ((err as Error).message.includes("no such file or directory")) {
        logger.info("No queue directory, creating...");
        // No dir have to create one
        await mkdirp(this.path);
      } else {
        logger.error((err as Error).message);
      }
    }
  }

  async add(data: any) {
    try {
      // maybe read the directory to double check for dupes?
      await outputFile(`${this.path}/${Date.now()}.json`, JSON.stringify(data));
    } catch (error) {
      logger.error((error as Error).message);
    }
  }

  async move(filename: string) {
    try {
      await move(`${this.path}/${filename}`, `${this.failed_path}/${filename}`);
    } catch (error) {
      logger.error((error as Error).message);
    }
  }

  async remove(filename: string) {
    try {
      await rm(`${this.path}/${filename}`);
    } catch (error) {
      logger.error((error as Error).message);
    }
  }
}

export const queueHandler = new QueueHandler({
  // try to use env file, default is 15 min if DEV 5
  waitTime: process.env.QUEUE_TIMER
    ? parseInt(process.env.QUEUE_TIMER)
    : process.env.NODE_ENV === "development"
    ? 5000
    : 1000 * 60 * 15,
});
