export type settings = {
  name: string;
  tailwind: boolean;
  lucia: boolean;
  database: "base-sqlite" | "prisma" | "drizzle";
  git: boolean;
  express: boolean;
  installPackages: boolean;
};
