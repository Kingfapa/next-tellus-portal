import { AxiosError } from "axios";
import { NextApiRequest, NextApiResponse } from "next";
import { logger } from "../../lib/logger";
import { readFile } from "fs/promises"
import { join } from "path"

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    if (req.method !== "GET") {
      throw new Error("Method is not GET...");
    }

    const data = await readFile(join(process.env.DATA_PATH || "./data", "phone-numbers.json"), { encoding: "utf-8" }); // ../../data/phone-numbers.json
    
    res.status(200).json(JSON.parse(data));
  } catch (err) {
    if (err instanceof AxiosError) {
      logger.error((err as AxiosError).response?.data);
    }
    res.status(500).json({ statusCode: 500, message: (err as Error).message });
  }
};

export default handler;
