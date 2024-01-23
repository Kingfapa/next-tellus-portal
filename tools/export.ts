import { mkdirp, copy } from "fs-extra";
import path from "path";
import { exec, spawn } from "child_process";

(async () => {
  console.log("Building export...");

  // TARGET DIR
  const TARGET_DIR = path.join(
    "//slldrifttools01.gaia.sll.se",
    "tellus",
    "builds"
  );

  // naming convention ex: "next-tellus-portal-0.0.1"
  const VERSION_DIR = `${process.env.npm_package_name}-${process.env.npm_package_version}`;
  const BUILD_DIR = path.join("builds", VERSION_DIR);

  try {
    await mkdirp(BUILD_DIR);

    const toCopy = [
      "dist",
      ".next",
      "public",
      "package.json",
      ".env.local",
      "schema",
    ];

    toCopy.forEach(async (contentName) => {
      await copy(contentName, path.join(BUILD_DIR, contentName));
    });

    console.log("Downloading packages, this can take a while...\n");
    const child = spawn("yarn install --production", {
      cwd: BUILD_DIR,
      shell: true,
      stdio: "inherit",
    });

    child.on("close", async (code) => {
      console.log(`Moving files to "${TARGET_DIR}" this can take a while`);

      process.on("SIGINT", () => {
        exec("taskkill /F /T /PID " + process.pid);
      });

      const transfer = spawn(
        `robocopy ${BUILD_DIR} ${path.join(TARGET_DIR, VERSION_DIR)} /MIR`,
        {
          cwd: process.cwd(),
          shell: true,
          stdio: "inherit",
        }
      );

      transfer.on("close", (code) => {
        exec(`start ${TARGET_DIR}`);
        // exec(`rm -rf ${BUILD_DIR}`); uncomment this if we want to clear the local version
      });
    });
  } catch (error) {
    console.log(error);
    throw error;
  }
})();
