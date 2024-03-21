import path from "path";
import { extraSrc, authDestPath, utilsDestPath } from "../const.js";
import fsExtra from "fs-extra";
import { addDependency } from "../utils/addDependency.js";
import { logger } from "../utils/logger.js";
import { writeEnv } from "../utils/writeEnv.js";

export async function copyAuth(destDir: string, orm: "drizzle" | "prisma") {
  const env = `GITHUB_CLIENT_ID=""\nGITHUB_CLIENT_SECRET=""`;
  writeEnv(destDir, env);

  const routesSourcePath = path.join(extraSrc, `auth/${orm}`);
  const routesDestinationPath = path.join(destDir, "src/routes/auth");

  const githubSourcePath = path.join(extraSrc, "auth/auth/github.ts");
  const githubDestinationPath = path.join(destDir, authDestPath, "github.ts");

  const authUtilsSourcePath = path.join(extraSrc, "auth/utils/authUtils.ts");
  const authUtilsDestinationPath = path.join(
    destDir,
    utilsDestPath,
    "authUtils.ts"
  );

  const utilsDir = path.join(destDir, utilsDestPath);

  if (!fsExtra.existsSync(utilsDir)) {
    fsExtra.mkdirSync(utilsDir);
  }

  addDependency(["arctic"], false, destDir);

  return Promise.allSettled([
    fsExtra.copyFile(githubSourcePath, githubDestinationPath),
    fsExtra.copyFile(authUtilsSourcePath, authUtilsDestinationPath),
    fsExtra.copy(routesSourcePath, routesDestinationPath),
  ])
    .then(() => logger.success("Auth files copied successfully"))
    .catch(() => logger.error("Failed to copy Auth files."));
}
