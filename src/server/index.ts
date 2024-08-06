import { loadEnvConfig } from "@next/env";
loadEnvConfig(
  process.env.INIT_CWD || process.cwd(),
  process.env.NODE_ENV !== "production"
);
import { logger } from "../lib/logger";

logger.info(
  `Starting ${process.env.npm_package_version} in dir ${process.cwd()}`
);

import { createServer } from "http";
import next from "next";
import { queueHandler } from "../lib/QueueHandler";
const { parse } = require("url");

const dev = process.env.NODE_ENV !== "production";
const port = parseInt(process.env.PORT || (dev ? "3000" : "443"), 10);
const hostname = "localhost";

// // when using middleware `hostname` and `port` must be provided below
const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  createServer(async (req, res) => {
    try {
      // Be sure to pass `true` as the second argument to `url.parse`.
      // This tells it to parse the query portion of the URL.
      const parsedUrl = parse(req.url, true);
      await handle(req, res, parsedUrl);
    } catch (err) {
      console.error("Error occurred handling", req.url, err);
      res.statusCode = 500;
      res.end("internal server error");
    }
  })
    .once("error", (err) => {
      logger.error(
        "Could not start the app, please double check your .env.local file"
      );
      process.exit(1);
    })
    .listen(port, async () => {
      await queueHandler.start();
      console.log(`> Ready on http://${hostname}:${port}`);
    });
});
