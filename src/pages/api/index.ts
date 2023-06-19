import { AxiosError } from "axios";
import { NextApiRequest, NextApiResponse } from "next";
import { tellusAPI } from "src/lib/TellusAPI";
import { logger } from "../../lib/logger";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    if (req.method !== "POST") {
      throw new Error("Method is not POST...");
    }

    const data = await tellusAPI.createCall(req.body, true);

    res.status(200).json(data);
  } catch (err) {
    if (err instanceof AxiosError) {
      logger.error((err as AxiosError).response?.data);
    }
    res.status(500).json({ statusCode: 500, message: (err as Error).message });
  }
};

export const config = {
  api: {
    bodyParser: {
      sizeLimit: "6mb", // <-- #https://stackoverflow.com/questions/70503440/how-to-override-the-4mb-api-routes-body-size-limit
    },
  },
};

export default handler;
