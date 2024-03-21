import path from "path";
import fsExtra from "fs-extra";
import { PackageJson } from "type-fest";
import { extraSrc, utilsDestPath } from "../const.js";
import { logger } from "../utils/logger.js";
import { addDependency } from "../utils/addDependency.js";
import { addScript } from "../utils/addScripts.js";

export async function expressInstaller(destDir: string) {
  const expressServerSrc = path.join(extraSrc, "socketio/index.js");
  const expressServerDest = path.join(destDir, "express/index.js");
  const expressDir = path.join(destDir, "express");
  const svelteConfigSrcPath = path.join(
    extraSrc,
    "config/svelte.config.express.js"
  );
  const utilsDir = path.join(destDir, utilsDestPath);
  const viteConfigSrcPath = path.join(
    extraSrc,
    "config/vite.config.express.ts"
  );
  const viteConfigDestPath = path.join(destDir, "vite.config.ts");
  const socketIoPluginSrcPath = path.join(extraSrc, "socketio/socketPlugin.ts");
  const socketIoPluginDestPath = path.join(destDir, "socketPlugin.ts");
  const svelteConfigDestPath = path.join(destDir, "svelte.config.js");
  const socketPageSrcPath = path.join(extraSrc, "pages/+page.socket.svelte");
  const socketPageDestPath = path.join(destDir, "src/routes/+page.svelte");
  const clientSocketSrcPath = path.join(extraSrc, "socketio/clientSocket.ts");
  const clientSocketDestPath = path.join(utilsDir, "clientSocket.ts");

  fsExtra.mkdirSync(utilsDir);
  fsExtra.mkdir(expressDir);

  const pkgJsonPath = path.join(destDir, "package.json");
  const pkgJson = fsExtra.readJSONSync(pkgJsonPath) as PackageJson;
  delete pkgJson.devDependencies!["@sveltejs/adapter-auto"];
  fsExtra.writeJsonSync(pkgJsonPath, pkgJson, { spaces: 2 });

  addDependency(
    ["@types/node", "@types/express", "@sveltejs/adapter-node"],
    true,
    destDir
  );
  addDependency(["express", "socket.io", "socket.io-client"], false, destDir);

  const scripts: { name: string; value: string }[] = [
    {
      name: "dev-express",
      value:
        "HOST=127.0.0.1 PORT=5173  ORIGIN=http://localhost:5173 node express",
    },
  ];
  addScript(destDir, scripts);

  return Promise.allSettled([
    fsExtra.copyFile(viteConfigSrcPath, viteConfigDestPath),
    fsExtra.copyFile(socketIoPluginSrcPath, socketIoPluginDestPath),
    fsExtra.copyFile(socketPageSrcPath, socketPageDestPath),
    fsExtra.copyFile(clientSocketSrcPath, clientSocketDestPath),
    fsExtra.copyFile(expressServerSrc, expressServerDest),
    fsExtra.copyFile(svelteConfigSrcPath, svelteConfigDestPath),
  ])
    .then(() => logger.success("Express configs copied successfully"))
    .catch(() => logger.error("Failed to copy express config"));
}
