import axios, { AxiosInstance } from "axios";
import { loadConfig } from "./config";
import { logger } from "./logger";
import { queueHandler } from "./QueueHandler";
import { formSchema } from "./schema";
import https from "https";
export interface IResult {
  result: { number: string; success: boolean };
}
export class TellusAPI {
  private instance: AxiosInstance;
  constructor() {
    const { ENDPOINT, USERNAME, PASSWORD } = loadConfig(process.env.NODE_ENV);
    logger.info(`Loaded Endpoint: ${ENDPOINT}`);
    this.instance = axios.create({
      baseURL: ENDPOINT,
      auth: {
        username: USERNAME,
        password: PASSWORD,
      },
      httpsAgent: new https.Agent({
        rejectUnauthorized: false,
      }),
    });
  }

  async createCall(formData: Record<any, any>, addToQueueIfFail: boolean) {
    try {
      logger.info("creating call");
      const { data } = await this.instance.post<IResult>(
        `/api/global/external_portal/create`,
        await formSchema.validate(formData),
        {
          headers: {
            Accept: "application/json",
            "Accept-Encoding": "identity", // https://github.com/axios/axios/issues/5298
          },
        }
      );
      logger.info(`Created ${data.result.number}`);
      return data;
    } catch (err) {
      logger.error((err as Error).message);
      // WARNING: This can trigger recursive
      if (addToQueueIfFail) {
        await queueHandler.add(formData);
        throw new Error("Added to queue");
      } else {
        const errMsg = `Failed to create call ${(err as Error).message}`;
        logger.error(errMsg);
        throw new Error(errMsg);
      }
    }
  }
}

export const tellusAPI = new TellusAPI();
