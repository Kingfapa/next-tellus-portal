import { AxiosError } from "axios";
import { NextApiRequest, NextApiResponse } from "next";
import { logger } from "../../lib/logger";
import { readFile } from "fs/promises";
import { join } from "path";
import { IPhoneNumberBoxProps } from "src/components/Modal/PhoneModal";

export interface IPhoneNumberApiResponse {
  records: IPhoneNumberBoxProps[];
}

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    if (req.method !== "GET") {
      throw new Error("Method is not GET...");
    }

    const data = await readFile(
      join(process.env.DATA_PATH || "./data", "phoneNumbers.json"),
      { encoding: "utf-8" }
    ); // ../../data/phoneNumbers.json

    res.status(200).json(JSON.parse(data));
  } catch (err) {
    if (err instanceof AxiosError) {
      logger.error((err as AxiosError).response?.data);
    }
    res.statusMessage = (err as Error).message;
    res.status(500).json({ message: (err as Error).message });
  }
};

export default handler;
