import path from "path";
import { dependencies, orm } from "../types.js";
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

  if (orm == "prisma") return primsa(destDir, isLucia);
  if (orm == "drizzle") return drizzle(destDir, isLucia);
}

async function primsa(dirPath: string, isLucia: boolean) {
  const databaseFileDest = path.join(dirPath, databaseDestPath, "database.ts");
  const databaseFileSrc = path.join(extraSrc, "prisma/database.ts");
  const schemaSource = isLucia
    ? path.join(extraSrc, "prisma/schema.lucia.prisma")
    : path.join(extraSrc, "prisma/schema.prisma");
  const schemaDest = path.join(dirPath, "prisma/schema.prisma");
  const databaseDir = path.join(dirPath, databaseDestPath);
  const prismaDir = path.join(dirPath, "prisma");
  const dependencies: dependencies[] = ["@prisma/client"];
  if (isLucia) dependencies.push("@lucia-auth/adapter-prisma");

  // creating the prisma directory and database dir
  fsExtra.mkdirSync(prismaDir);
  fsExtra.mkdirSync(databaseDir);

  addDependency(dependencies, false, dirPath);
  addDependency(["prisma"], true, dirPath);

  return Promise.allSettled([
    fsExtra.copyFile(databaseFileSrc, databaseFileDest),
    fsExtra.copyFile(schemaSource, schemaDest),
  ])
    .then(() => logger.success("Prisma configs copied successfully"))
    .catch(() => logger.error("Failed to copy prisma configs"));
}

async function drizzle(dirPath: string, isLucia: boolean) {
  const databaseFileDest = path.join(dirPath, databaseDestPath, "database.ts");
  const databaseFileSrc = path.join(extraSrc, "drizzle/database.ts");
  const configSource = path.join(extraSrc, "config/drizzle.config.ts");
  const configDest = path.join(dirPath, "drizzle.config.ts");
  const schemaSource = isLucia
    ? path.join(extraSrc, "drizzle/schema.lucia.ts")
    : path.join(extraSrc, "drizzle/schema.ts");
  const schemaDest = path.join(dirPath, databaseDestPath, "schema.ts");
  const databaseDir = path.join(dirPath, databaseDestPath);
  const dependencies: dependencies[] = ["drizzle-orm", "better-sqlite3"];
  if (isLucia) dependencies.push("@lucia-auth/adapter-drizzle");

  // creating the database dir
  fsExtra.mkdirSync(databaseDir);

  addDependency(dependencies, false, dirPath);
  addDependency(["drizzle-kit", "@types/better-sqlite3"], true, dirPath);

  return Promise.allSettled([
    fsExtra.copyFile(databaseFileSrc, databaseFileDest),
    fsExtra.copyFile(schemaSource, schemaDest),
    fsExtra.copyFile(configSource, configDest),
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
