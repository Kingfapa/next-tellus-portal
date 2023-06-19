import { loadEnvConfig } from "@next/env";
loadEnvConfig(
  process.env.INIT_CWD || process.cwd(),
  process.env.NODE_ENV !== "production"
);
import { logger } from "../lib/logger";
import { loadConfig } from "../lib/config";

logger.info(
  `Starting ${process.env.npm_package_version} in dir ${process.cwd()}`
);

import https from "https";
import http from "http";
import express from "express";
import next from "next";
import { queueHandler } from "../lib/QueueHandler";
import { readFile } from "fs-extra";

const dev = process.env.NODE_ENV !== "production";
const port = parseInt(process.env.PORT || (dev ? "3000" : "443"), 10);
const hostname = "localhost";

// // when using middleware `hostname` and `port` must be provided below
const app = next({ dev, hostname, port });
const nextHandle = app.getRequestHandler();

(async () => {
  try {
    // Next.js compile
    await app.prepare();

    // Create Express server and attach nextjs routes
    const server = express();
    server.all("*", (req, res) => nextHandle(req, res));

    if (!dev) {
      const { HTTPS_SSL_CERT, HTTPS_SSL_KEY } = loadConfig(process.env.NODE_ENV);

      https
        .createServer(
          {
            cert: await readFile(HTTPS_SSL_CERT!.toString()),
            key: await readFile(HTTPS_SSL_KEY!.toString()),
          },
          server
        )
        .listen(port);
    } else {
      http.createServer(server).listen(port);
    }
    // start queue
    await queueHandler.start();
    console.log(`> Ready on http://localhost:${port}`);
  } catch (error) {
    logger.error("Could not start the app, please double check your .env.local file")
    process.exit(1);
  }
})();
