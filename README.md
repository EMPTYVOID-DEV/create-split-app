![splitLogo](./assets/Logo.png)

The **Split Stack CLI Tool** is a command-line utility designed to streamline the process of initializing a sveltekit project with the most up to date tools:

- **TypeScript**: A language that builds on top of JavaScript, adding static type checking to catch errors earlier.
- **Prisma** or **Drizzle**: Tools for managing your database, including creating and updating database schemas.
- **Lucia**: A library for handling user authentication and authorization.
- **Tailwind CSS**: A utility-focused CSS framework for styling your application.
- **Express.js**: A web application framework, which can integrate with Socket.IO for real-time communication.

## Installation

To setup a split project run one of these commands:

### npm

```bash
npx create-split-app
```

### yarn

```bash
yarn dlx create-split-app
```

### pnpm

```bash
pnpm dlx create-split-app
```

## Setup Options

During setup, you'll be prompted to choose which additional tools and packages you want to include:

1. **Project Location**: Where to create the new project folder.
2. **Tailwind CSS**: Whether to include the Tailwind CSS styling framework.
3. **Lucia**: Whether to include the Lucia user authentication library.
4. **Database Tool**: Which tool to use for managing your database: none, Prisma, or Drizzle.
5. **Socket.IO**: Whether to include a Socket.IO setup with Express.js for real-time communication.
6. **Git Repository**: Whether to initialize a Git repository.
7. **Install Packages**: Whether the CLI should install the required packages.

## Notes

1. If using Lucia without a database tool, update `src/lib/auth/lucia.ts` with your desired adapter.
2. The CLI uses SQLite as the default database with Prisma or Drizzle. It also includes `better-sqlite3` with Drizzle.
3. You need to migrate your database schema before use when using Prisma or Drizzle.

## Contributing

Contributions are welcome! Submit pull requests for new features, bug fixes, or improvements.

## License

The Split Stack CLI Tool is open-source under the [MIT License](https://opensource.org/licenses/MIT).
