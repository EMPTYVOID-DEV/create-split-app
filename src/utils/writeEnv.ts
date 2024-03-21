import path from "path";
import fsExtra from "fs-extra";

export function writeEnv(destDir: string, content: string) {
  const envPath = path.join(destDir, ".env");
  fsExtra.appendFileSync(envPath, "\n" + content);
}
