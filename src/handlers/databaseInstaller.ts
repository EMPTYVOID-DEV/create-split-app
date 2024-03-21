import path from "path";
import { dependencies, orm } from "../types.js";
import { extraSrc, databaseDestPath } from "../const.js";
import fsExtra from "fs-extra";
import { logger } from "../utils/logger.js";
import { addDependency } from "../utils/addDependency.js";
import { addScript } from "../utils/addScripts.js";
import { writeEnv } from "../utils/writeEnv.js";

export async function databaseInstaller(
  destDir: string,
  orm: orm,
  isLucia: boolean
) {
  const localDbPath = path.join(destDir, "localDB/sqlite.db");
  fsExtra.createFileSync(localDbPath);
  const env =
    orm == "prisma"
      ? `DB_URL=file:../localDB/sqlite.db`
      : `DB_URL=localDB/sqlite.db`;
  writeEnv(destDir, env);

  if (orm == "prisma") return primsa(destDir, isLucia);
  if (orm == "drizzle") return drizzle(destDir, isLucia);
}

async function primsa(destDir: string, isLucia: boolean) {
  const databaseFileDest = path.join(destDir, databaseDestPath, "database.ts");
  const databaseFileSrc = path.join(extraSrc, "prisma/database.ts");
  const schemaSource = isLucia
    ? path.join(extraSrc, "prisma/schema.lucia.prisma")
    : path.join(extraSrc, "prisma/schema.prisma");
  const schemaDest = path.join(destDir, "prisma/schema.prisma");
  const databaseDir = path.join(destDir, databaseDestPath);
  const prismaDir = path.join(destDir, "prisma");
  const dependencies: dependencies[] = ["@prisma/client"];
  if (isLucia) dependencies.push("@lucia-auth/adapter-prisma");

  // creating the prisma directory and database dir
  fsExtra.mkdirSync(prismaDir);
  fsExtra.mkdirSync(databaseDir);

  addDependency(dependencies, false, destDir);
  addDependency(["prisma"], true, destDir);

  const scripts: { name: string; value: string }[] = [
    {
      name: "migrate",
      value: "npx prisma migrate dev",
    },
    {
      name: "generate",
      value: "npx prisma generate",
    },
  ];
  addScript(destDir, scripts);

  return Promise.allSettled([
    fsExtra.copyFile(databaseFileSrc, databaseFileDest),
    fsExtra.copyFile(schemaSource, schemaDest),
  ])
    .then(() => logger.success("Prisma configs copied successfully"))
    .catch(() => logger.error("Failed to copy prisma configs"));
}

async function drizzle(destDir: string, isLucia: boolean) {
  const databaseFileDest = path.join(destDir, databaseDestPath, "database.ts");
  const databaseFileSrc = path.join(extraSrc, "drizzle/database.ts");
  const configSource = path.join(extraSrc, "config/drizzle.config.ts");
  const configDest = path.join(destDir, "drizzle.config.ts");
  const schemaSource = isLucia
    ? path.join(extraSrc, "drizzle/schema.lucia.ts")
    : path.join(extraSrc, "drizzle/schema.ts");
  const schemaDest = path.join(destDir, databaseDestPath, "schema.ts");
  const databaseDir = path.join(destDir, databaseDestPath);
  const dependencies: dependencies[] = ["drizzle-orm", "better-sqlite3"];
  if (isLucia) dependencies.push("@lucia-auth/adapter-drizzle");

  // creating the database dir
  fsExtra.mkdirSync(databaseDir);

  addDependency(dependencies, false, destDir);
  addDependency(["drizzle-kit", "@types/better-sqlite3"], true, destDir);

  const scripts: { name: string; value: string }[] = [
    {
      name: "migrate",
      value: "npx drizzle-kit generate:sqlite --config ./drizzle.config.ts",
    },
    {
      name: "push-migrations",
      value: "npx drizzle-kit push:sqlite --config ./drizzle.config.ts",
    },
  ];

  addScript(destDir, scripts);

  return Promise.allSettled([
    fsExtra.copyFile(databaseFileSrc, databaseFileDest),
    fsExtra.copyFile(schemaSource, schemaDest),
    fsExtra.copyFile(configSource, configDest),
  ])
    .then(() => logger.success("Drizzle configs copied successfully"))
    .catch(() => logger.error("Failed to copy drizzle configs"));
}
