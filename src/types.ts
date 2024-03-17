export type settings = {
  name: string;
  tailwind: boolean;
  lucia: boolean;
  orm: orm;
  git: boolean;
  express: boolean;
  installPackages: boolean;
};

export type orm = "base-sqlite" | "prisma" | "drizzle";

export type dependencies =
  | "@sveltejs/adapter-node"
  | "@types/express"
  | "@lucia-auth/adapter-prisma"
  | "@lucia-auth/adapter-drizzle"
  | "@lucia-auth/adapter-sqlite"
  | "@prisma/client"
  | "@types/node"
  | "better-sqlite3"
  | "drizzle-orm"
  | "drizzle-kit"
  | "oslo"
  | "prettier-plugin-tailwindcss"
  | "express"
  | "lucia"
  | "prisma"
  | "socket.io"
  | "socket.io-client"
  | "tailwindcss"
  | "postcss"
  | "autoprefixer";
