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
  const localDbPath = path.join(destDir, "localDB/sqlite.db");
  fsExtra.createFileSync(localDbPath);
  writeEnv(destDir, orm == "prisma");

  if (orm == "base-sqlite") return baseSqlite(destDir);
  if (orm == "prisma") return primsa(destDir, isLucia);
  if (orm == "drizzle") return drizzle(destDir, isLucia);
}

async function baseSqlite(dirPath: string) {
  const destFilePath = path.join(dirPath, databaseDestPath, "database.ts");
  const srcFilePath = path.join(extraSrc, "pages/database.ts");
  const databaseDir = path.join(dirPath, databaseDestPath);

  // creating the database dir
  fsExtra.mkdirSync(databaseDir);

  addDependency(
    ["better-sqlite3", "@lucia-auth/adapter-sqlite"],
    false,
    dirPath
  );
  addDependency(["@types/better-sqlite3"], true, dirPath);

  return fsExtra
    .copyFile(srcFilePath, destFilePath)
    .then(() => logger.success("Database configs copied successfully"))
    .catch((e) => logger.error("Failed to copy base-orm configs"));
}

async function primsa(dirPath: string, isLucia: boolean) {
  const dbFileDestPath = path.join(dirPath, databaseDestPath, "database.ts");
  const dbFileSrcPath = path.join(extraSrc, "prisma/database.ts");
  const schemaSrcPath = isLucia
    ? path.join(extraSrc, "prisma/schema.lucia.prisma")
    : path.join(extraSrc, "prisma/schema.prisma");
  const schemaDestPath = path.join(dirPath, "prisma/schema.prisma");
  const databaseDir = path.join(dirPath, databaseDestPath);
  const prismaDir = path.join(dirPath, "prisma");

  // creating the prisma directory and database dir
  fsExtra.mkdirSync(prismaDir);
  fsExtra.mkdirSync(databaseDir);

  addDependency(
    ["@prisma/client", "@lucia-auth/adapter-prisma"],
    false,
    dirPath
  );
  addDependency(["prisma"], true, dirPath);

  return Promise.allSettled([
    fsExtra.copyFile(dbFileSrcPath, dbFileDestPath),
    fsExtra.copyFile(schemaSrcPath, schemaDestPath),
  ])
    .then(() => logger.success("Prisma configs copied successfully"))
    .catch(() => logger.error("Failed to copy prisma configs"));
}

async function drizzle(dirPath: string, isLucia: boolean) {
  const dbFileDestPath = path.join(dirPath, databaseDestPath, "database.ts");
  const dbFileSrcPath = path.join(extraSrc, "drizzle/database.ts");
  const configSrcPath = path.join(extraSrc, "config/drizzle.config.ts");
  const configDestPath = path.join(dirPath, "drizzle.config.ts");
  const schemaSrcPath = isLucia
    ? path.join(extraSrc, "drizzle/schema.lucia.ts")
    : path.join(extraSrc, "drizzle/schema.ts");
  const schemaDestPath = path.join(dirPath, databaseDestPath, "schema.ts");
  const databaseDir = path.join(dirPath, databaseDestPath);

  // creating the database dir
  fsExtra.mkdirSync(databaseDir);

  addDependency(
    ["drizzle-orm", "better-sqlite3", , "@lucia-auth/adapter-drizzle"],
    false,
    dirPath
  );
  addDependency(["drizzle-kit", "@types/better-sqlite3"], true, dirPath);

  return Promise.allSettled([
    fsExtra.copyFile(dbFileSrcPath, dbFileDestPath),
    fsExtra.copyFile(schemaSrcPath, schemaDestPath),
    fsExtra.copyFile(configSrcPath, configDestPath),
  ])
    .then(() => logger.success("Drizzle configs copied successfully"))
    .catch(() => logger.error("Failed to copy drizzle configs"));
}

function writeEnv(dirPath: string, isPrimsa: boolean) {
  const env = isPrimsa
    ? `DB_URL=file:../localDB/sqlite.db`
    : `DB_URL=localDB/sqlite.db`;
  const envPath = path.join(dirPath, ".env");
  fsExtra.writeFileSync(envPath, env);
}
