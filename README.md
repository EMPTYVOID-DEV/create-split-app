![splitLogo](./assets/Logo.png)

The **Split Stack CLI Tool** is a command-line program designed to streamline the process of starting a new SvelteKit project with the latest tools:

- **TypeScript**: TypeScript is not optional, ensuring type safety for your project.
- **Prisma** or **Drizzle**: Tools for managing your database, including creating and updating database structures.
- **Lucia**: A library for easily adding user authentication to your web application.
- **Tailwind CSS**: A utility-first CSS framework for building modern, responsive user interfaces.
- **Express.js**: A web application framework that can work with Socket.IO for real-time communication.

## Installation

To set up a Split project, run one of these commands:

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

During setup, you'll be prompted to choose which extra tools and packages you want to include:

1. **Project Location**: Specify the location where you want to create the new project folder.
2. **Tailwind CSS**: Choose whether to include the Tailwind CSS styling framework.
3. **Lucia**: Decide whether to include the Lucia user authentication library.
4. **Database Tool**: Select which tool to use for managing your database: none, Prisma, or Drizzle.
5. **Socket.IO**: Choose whether to include a Socket.IO setup with Express.js for real-time communication.
6. **Git Repository**: Decide whether to initialize a Git repository for your project.
7. **Install Packages**: Choose whether the CLI should install the required packages for your selected options.

## Notes

### Tailwind

Split will copy a Tailwind CSS configuration that includes global colors (following the 60-30-10 rule), responsive font sizes using clamp, font families for body and headings, border radius, line heights, and base styles that set the font family, size, weight, and line height for various elements.

### Lucia

1. When using Lucia, Split will require you to choose either Prisma or Drizzle because Lucia needs an adapter. If you don't select Lucia, Split will add the **no-orm** option.
2. For authentication, Split will set up a key table with the following schema: (user_id, provider_name, provider_id, verified, secret). The idea is that your users can authenticate themselves with different authentication methods, some of which require a secret and further verification (like email-password authentication).
3. Split will include Maildev to test an SMTP server locally and facilitate email-based authentication.

### Drizzle and Prisma

1. For Drizzle, Split will add two scripts to package.json: a `migrate` script to migrate your schema and a `push-migration` script to push your changes to the database.
2. For Prisma, Split will add a `migrate` script to migrate your schema and a `generate` script to generate the Prisma client.
3. Split will migrate the initial schema after successfully installing packages.
4. Split will use SQLite as the default database.

### Express

1. Split will copy a Socket.IO Vite plugin to allow you to work with Socket.IO without needing to run Express separately.
2. The `express/index.ts` file will include the same code as the plugin, as well as binding the SvelteKit handler to the Express app.
3. Split will copy a `tsconfig` file under the `express` folder.
4. Split will add two scripts: one to build the Express modules and another to run the server from the `dist` folder.
5. Since `index.ts` imports `handler.js` from the SvelteKit build, TypeScript Compiler (tsc) will include some of it modules under the `dist` folder, which you don't want. You need to delete the new generated build folder and update the imports inside `dist/index.js`.

## Contributing

Contributions are welcome! Submit pull requests for new features, bug fixes, or improvements.

## License

The Split Stack CLI Tool is open-source under the [MIT License](https://opensource.org/licenses/MIT).
