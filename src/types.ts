export type settings = {
  name: string;
  tailwind: boolean;
  lucia: boolean;
  orm: orm;
  git: boolean;
  express: boolean;
  installPackages: boolean;
};

export type orm = "no-orm" | "prisma" | "drizzle";

export type dependencies =
  | "@sveltejs/adapter-node"
  | "@types/express"
  | "@types/better-sqlite3"
  | "@lucia-auth/adapter-prisma"
  | "@lucia-auth/adapter-drizzle"
  | "@prisma/client"
  | "@types/node"
  | "better-sqlite3"
  | "drizzle-orm"
  | "drizzle-kit"
  | "oslo"
  | "arctic"
  | "prettier-plugin-tailwindcss"
  | "express"
  | "lucia"
  | "prisma"
  | "socket.io"
  | "socket.io-client"
  | "tailwindcss"
  | "postcss"
  | "autoprefixer"
  | "@sveltejs/adapter-auto"
  | "@sveltejs/kit"
  | "@sveltejs/vite-plugin-svelte"
  | "@types/eslint"
  | "@typescript-eslint/eslint-plugin"
  | "@typescript-eslint/parser"
  | "eslint"
  | "eslint-config-prettier"
  | "eslint-plugin-svelte"
  | "prettier"
  | "prettier-plugin-svelte"
  | "svelte"
  | "svelte-check"
  | "tslib"
  | "typescript"
  | "vite";
