import { removeTrailingSlash } from "./removingTrailingSlash.js";

const validationRegExp =
  /^(?:@[a-z0-9-*~][a-z0-9-*._~]*\/)?[a-z0-9-~][a-z0-9-._~]*$/;

export const validateProjectName = (rawInput: string) => {
  const input = removeTrailingSlash(rawInput);
  const paths = input.split("/");

  const indexOfDelimiter = paths.findIndex((p) => p.startsWith("@"));

  let appName = paths[paths.length - 1];
  if (indexOfDelimiter !== -1) {
    appName = paths.slice(indexOfDelimiter).join("/");
  }

  if (appName == "." || validationRegExp.test(appName ?? "")) {
    return true;
  } else {
    return "App name must consist of only lowercase alphanumeric characters, '-', and '_'";
  }
};
