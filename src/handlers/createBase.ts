import fsExtra from "fs-extra";
import inquirer from "inquirer";
import { logger } from "../utils/logger.js";
import { baseSrc as srcDir } from "../const.js";
import { addDependency } from "../utils/addDependency.js";

export async function createBase(destDir: string) {
  const doesItExist = fsExtra.existsSync(destDir);
  if (doesItExist) {
    const writingOption = await exitingDirPrompt();
    if (writingOption == "Abort") {
      logger.info("Aborting the process.");
      process.exit(0);
    } else if (writingOption == "Clear") fsExtra.emptyDirSync(destDir);
  }

  return fsExtra
    .copy(srcDir, destDir)
    .then(() => {
      addDependency(
        [
          "@sveltejs/adapter-auto",
          "@sveltejs/kit",
          "@sveltejs/vite-plugin-svelte",
          "@types/eslint",
          "@typescript-eslint/eslint-plugin",
          "@typescript-eslint/parser",
          "eslint",
          "eslint-config-prettier",
          "eslint-plugin-svelte",
          "prettier",
          "prettier-plugin-svelte",
          "svelte",
          "svelte-check",
          "tslib",
          "typescript",
          "vite",
        ],
        true,
        destDir
      );
    })
    .then(() => logger.success("The base project was copied successfully"))
    .catch((e) => {
      logger.error("Failed to copy the base project");
      process.exit(1);
    });
}

async function exitingDirPrompt() {
  const { writingOption } = await inquirer.prompt<{
    writingOption: "Abort" | "Clear" | "Overwrite";
  }>({
    name: "writingOption",
    message:
      "A directory with same path already exits what you want split to do?",
    type: "list",
    choices: [
      {
        name: "Abort the installation (recommanded)",
        value: "Abort",
      },
      {
        name: "Clear the directory and install",
        value: "Clear",
      },
      {
        name: "Overwrite existing files",
        value: "Overwrite",
      },
    ],
    default: "Abort",
  });
  return writingOption;
}
