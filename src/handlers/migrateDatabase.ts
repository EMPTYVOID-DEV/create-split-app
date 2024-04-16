import ora from "ora";
import { execa } from "execa";
import { migrationCommands } from "../const.js";
import { logger } from "../utils/logger.js";

export async function migrateDatabase(
  destDir: string,
  orm: "prisma" | "drizzle"
) {
  const spinner = ora("Migrating schema").start();
  const commands = migrationCommands.get(orm);
  try {
    let output = "";
    output += (
      await execa("npx", commands.prepare, {
        cwd: destDir,
      })
    ).stdout;
    output += (
      await execa("npx", commands.push, {
        cwd: destDir,
      })
    ).stdout;
    spinner.succeed("Successfully migrated schema to the database.");
    logger.info(output);
  } catch (error) {
    spinner.fail("Failed to migrate the schema to the database.");
    logger.error(error.stdout);
  }
}
