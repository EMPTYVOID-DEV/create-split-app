import path from "path";
import { orm } from "../types.js";
import { extraSrc, databaseDestPath } from "../const.js";
import fsExtra from "fs-extra";
import { logger } from "../utils/logger.js";
import { addDependency } from "../utils/addDependency.js";

export async function databaseInstaller(
  destDir: string,
  orm: orm,
  isLucia: boolean
) {
  const destEnvPath = path.join(destDir, ".env");
  const srcEnvPath = path.join(extraSrc, "pages/.env");
  const localDbPath = path.join(destDir, "localDB/sqlite.db");
  fsExtra.copyFileSync(srcEnvPath, destEnvPath);
  fsExtra.createFileSync(localDbPath);
  if (orm == "base-sqlite") return baseSqlite(destDir);
  if (orm == "prisma") return primsa(destDir, isLucia);
  if (orm == "drizzle") return drizzle(destDir, isLucia);
}

async function baseSqlite(destDir: string) {
  const destPath = path.join(destDir, databaseDestPath, "database.ts");
  const srcPath = path.join(extraSrc, "pages/database.ts");
  const databaseDirPath = path.join(destDir, databaseDestPath);
  // creating the database dir
  fsExtra.mkdirSync(databaseDirPath);

  addDependency(
    ["better-sqlite3", "@lucia-auth/adapter-sqlite"],
    false,
    destDir
  );
  addDependency(["@types/better-sqlite3"], true, destDir);
  return fsExtra
    .copyFile(srcPath, destPath)
    .then(() => logger.success("Database configs copied successfully"))
    .catch((e) => logger.error("Failed to copy base-orm configs"));
}

async function primsa(destDir: string, isLucia: boolean) {
  const dbFileDestPath = path.join(destDir, databaseDestPath, "database.ts");
  const dbFileSrcPath = path.join(extraSrc, "prisma/database.ts");
  const schemaSrcPath = isLucia
    ? path.join(extraSrc, "prisma/schema.lucia.prisma")
    : path.join(extraSrc, "prisma/schema.prisma");
  const schemaDestPath = path.join(destDir, "prisma/schema.prisma");
  const databaseDirPath = path.join(destDir, databaseDestPath);
  const prismaDirPath = path.join(destDir, "prisma");
  // creating the prisma directory and database dir
  fsExtra.mkdirSync(prismaDirPath);
  fsExtra.mkdirSync(databaseDirPath);

  addDependency(
    ["@prisma/client", "@lucia-auth/adapter-prisma"],
    false,
    destDir
  );
  addDependency(["prisma"], true, destDir);

  return Promise.allSettled([
    fsExtra.copyFile(dbFileSrcPath, dbFileDestPath),
    fsExtra.copyFile(schemaSrcPath, schemaDestPath),
  ])
    .then(() => logger.success("Prisma configs copied successfully"))
    .catch(() => logger.error("Failed to copy prisma configs"));
}

async function drizzle(destDir: string, isLucia: boolean) {
  const dbFileDestPath = path.join(destDir, databaseDestPath, "database.ts");
  const dbFileSrcPath = path.join(extraSrc, "drizzle/database.ts");
  const configSrcPath = path.join(extraSrc, "config/drizzle.config.ts");
  const configDestPath = path.join(destDir, "drizzle.config.ts");
  const schemaSrcPath = isLucia
    ? path.join(extraSrc, "drizzle/schema.lucia.ts")
    : path.join(extraSrc, "drizzle/schema.ts");
  const schemaDestPath = path.join(destDir, databaseDestPath, "schema.ts");
  const databaseDirPath = path.join(destDir, databaseDestPath);
  // creating the database dir
  fsExtra.mkdirSync(databaseDirPath);

  addDependency(
    ["drizzle-orm", "better-sqlite3", , "@lucia-auth/adapter-drizzle"],
    false,
    destDir
  );
  addDependency(["drizzle-kit", "@types/better-sqlite3"], true, destDir);

  return Promise.allSettled([
    fsExtra.copyFile(dbFileSrcPath, dbFileDestPath),
    fsExtra.copyFile(schemaSrcPath, schemaDestPath),
    fsExtra.copyFile(configSrcPath, configDestPath),
  ])
    .then(() => logger.success("Drizzle configs copied successfully"))
    .catch(() => logger.error("Failed to copy drizzle configs"));
}
