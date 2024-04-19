import path from "path";
import { extraSrc, authDestPath, serverUtilsDestPath } from "../const.js";
import fsExtra from "fs-extra";
import { addDependency } from "../utils/addDependency.js";
import { logger } from "../utils/logger.js";
import { writeEnv } from "../utils/writeEnv.js";

export async function copyAuth(destDir: string, orm: "drizzle" | "prisma") {
  const env = `GITHUB_CLIENT_ID=""\nGITHUB_CLIENT_SECRET=""\nAPI_EMAIL=""`;
  writeEnv(destDir, env);

  const routesSourcePath = path.join(extraSrc, `auth/${orm}`);
  const routesDestinationPath = path.join(destDir, "src/routes/auth");

  const githubSourcePath = path.join(extraSrc, "auth/auth/github.ts");
  const githubDestinationPath = path.join(destDir, authDestPath, "github.ts");

  const emailSourcePath = path.join(extraSrc, "auth/auth/email.ts");
  const emailDestinationPath = path.join(destDir, authDestPath, "email.ts");

  const authUtilsSourcePath = path.join(extraSrc, "auth/utils/authUtils.ts");
  const authUtilsDestinationPath = path.join(
    destDir,
    serverUtilsDestPath,
    "authUtils.ts"
  );

  const utilsDir = path.join(destDir, serverUtilsDestPath);
  fsExtra.mkdirSync(utilsDir);

  addDependency(
    ["maildev", "arctic", "nodemailer", "otp-generator"],
    false,
    destDir
  );

  addDependency(["@types/nodemailer", "@types/otp-generator"], true, destDir);

  return Promise.allSettled([
    fsExtra.copyFile(emailSourcePath, emailDestinationPath),
    fsExtra.copyFile(githubSourcePath, githubDestinationPath),
    fsExtra.copyFile(authUtilsSourcePath, authUtilsDestinationPath),
    fsExtra.copy(routesSourcePath, routesDestinationPath),
  ])
    .then(() => logger.success("Auth files copied successfully"))
    .catch(() => logger.error("Failed to copy Auth files."));
}
