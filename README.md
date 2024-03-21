![splitLogo](./assets/Logo.png)

The **Split Stack CLI Tool** is a command-line program designed to make it easy to start a new sveltekit project with the latest tools:

- **TypeScript**: A language that builds on top of JavaScript, adding type checking to catch mistakes early.
- **Prisma** or **Drizzle**: Tools for managing your database, including creating and updating database structures.
- **Lucia**: A library for handling user sign-in and access control.
- **Tailwind CSS**: A CSS framework for styling your application.
- **Express.js**: A web application framework, which can work with Socket.IO for real-time communication.

## Installation

To set up a split project, run one of these commands:

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

During setup, you'll be asked to choose which extra tools and packages you want to include:

1. **Project Location**: Where to create the new project folder.
2. **Tailwind CSS**: Whether to include the Tailwind CSS styling framework.
3. **Lucia**: Whether to include the Lucia user authentication library.
4. **Database Tool**: Which tool to use for managing your database: none, Prisma, or Drizzle.
5. **Socket.IO**: Whether to include a Socket.IO setup with Express.js for real-time communication.
6. **Git Repository**: Whether to initialize a Git repository.
7. **Install Packages**: Whether the CLI should install the required packages.

## Notes

1. If you selected Lucia and `no-orm`, update `src/lib/auth/lucia.ts` with your desired adapter.
2. The CLI uses SQLite as the default database with Prisma or Drizzle. It also includes `better-sqlite3` for Drizzle.
3. The CLI will automatically migrate changes to the local SQLite database.
4. When using Lucia with either Drizzle or Prisma, the CLI will write routes which handle GitHub and email-password authentication.
5. For GitHub authentication, you need to set two environment variables: `GITHUB_CLIENT_ID` and `GITHUB_CLIENT_SECRET`. Learn more [here](https://docs.github.com/en/apps/oauth-apps/building-oauth-apps/creating-an-oauth-app).
6. When working with Socket.IO, if you change the port where the Express server is listening, make sure to update the `dev-express`script. Learn more [here](https://kit.svelte.dev/docs/adapter-node).

## Contributing

Contributions are welcome! Submit pull requests for new features, bug fixes, or improvements.

## License

The Split Stack CLI Tool is open-source under the [MIT License](https://opensource.org/licenses/MIT).
