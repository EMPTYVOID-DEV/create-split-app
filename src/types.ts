export type settings = {
  name: string;
  tailwind: boolean;
  lucia: boolean;
  database: orm;
  git: boolean;
  express: boolean;
  installPackages: boolean;
};

export type orm = "base-sqlite" | "prisma" | "drizzle";
