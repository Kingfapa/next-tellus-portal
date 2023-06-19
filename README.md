# next-tellus-portal

# Pre-requisites
- Install [Node.js](https://nodejs.org/en/) version >=16.10
- [Yarn](https://yarnpkg.com/getting-started/install). On Windows may need to start your terminal as administrator in order to run `corepack enable`, which lets you use `yarn` commands
- VS Code (recommended)
- [git](https://git-scm.com/)

# Getting started
- Install dependencies
```
yarn install
```
- Create a local `.env.local` file, for example by copying the included `.env.example`. This file will only be used on your own machine, and should not be shared.
    - Enter values for all `(DEV_)TELLUS_` variables. If you do not need to access/create records in TellUs, enter placeholder values, e.g.
        > DEV\_TELLUS\_ENDPOINT=https://localhost:3000/
        > DEV\_TELLUS\_USERNAME=dev
        > DEV\_TELLUS\_PASSWORD=dev
      Otherwise, enter the appropriate credentials.
    - Although it ignored in .gitignore, make sure NOT to add the `.env.local` file in your commits.
- Build and run the project locally with
```
yarn dev
```
  Navigate to `http://localhost:3000`

# Building
Before deploying your changes, you should increment the version number in `package.json`, as the highest numbered build will be used in deployment. Use your best judgement using semantic versioning.

To move the code to the jump server you can use
```
yarn export
```
The command will create a `builds` directory where you can find a standalone build of the codebase. It will then try to copy the created build folder to the jump server, assuming you have the drives mapped to your computer (Windows-only).

See the KB article on TellUs for further information on how to continue deployment after exporting.
