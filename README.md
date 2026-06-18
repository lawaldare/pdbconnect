# PDBConnect

Monorepo for PDBe front-end applications and component library

## Projects and deployments

All applications are located under the `apps/` directory.

A list of projects, their locations in this repository, and their production deployments is maintained here:

[PDBConnect Deployments](https://embl.atlassian.net/wiki/spaces/PDBE/pages/354287669/PDBConnect+Deployments)

And should be updated after every production deployment with the necessary information in the tables.

Performance benchmarking should be done for page releases with major changes (before and after) in this page:

[PDBConnect Benchmarks](https://embl.atlassian.net/wiki/spaces/PDBE/pages/119210018/PDBConnect+Performance+benchmarks)

Some examples of application locations:

| Project          | Location          |
| ---------------- | ----------------- |
| PDBe Entry Pages | `apps/connect`    |
| Complexes        | `apps/complexes`  |
| Download         | `apps/download`   |
| Ligands          | `apps/ligands`    |
| Proteins         | `apps/proteins`   |
| PISA             | `apps/pisa`       |
| Playground       | `apps/playground` |

> Note: the Playground app currently exists in the repository but is not actively used.

## Architecture Decision Records

Architecture Decision Records are documented in Confluence:

[Architecture Decision Records ADR](https://embl.atlassian.net/wiki/spaces/PDBE/pages/23949238/Architecture+Decision+Records+ADR)

ADRs should be used to document significant architectural decisions, especially when a decision affects multiple applications, shared libraries, build/deployment behaviour, or long-term maintenance.

## Getting started

### Setting up the development environment

#### 1. Install the necessary softwares

- Recommended Editor - VS Code (https://code.visualstudio.com/)
- Node.js: use the version defined in the `.nvmrc` file
- Git (https://git-scm.com/)
- Typescript (~4.7.2) [ `npm install -g typescript` ]
- Angular CLI (^16.0.2) [ `npm install -g @angular/cli` ]
- Nx [ `npm install -g nx@latest` ]
- NRWL Schematic (8.12.11) [ `npm install -g @nrwl/schematics` ]

Use `nvm` to install and switch to the correct Node.js version:

```bash
nvm install
nvm use
```

The required Node.js version is defined in:

```bash
.nvmrc
```

#### 2. Clone Repository

```bash
git clone
```

#### 3. Open the directory and install dependencies

```bash
npm install
```

#### 4. Install recommended VS Code extensions

- After opening the project in VS Code you will get a recommendation notification on the bottom right corner of the editor. On clicking `Install` all the recommended extensions will be install.

- For any reasons, if the notification doesn't show up we can manually open up Recommended Extensions settings
  - Open the command palette `CMD + Shift + p`
  - Type Show Recommended Extensions
  - Install all the extensions from the search result list

## Quick commands

### Serve an application locally (All Apps are stored in the 'apps' folder)

```bash
npx nx serve <APP-NAME>
```

Example: `npx nx serve connect`

### View a diagram of the projects dependencies

```bash
npx nx graph
```

### Check lint errors

```bash
npx nx affected -t lint --parallel=3
```

### Automatically fix lint errors

```bash
npx nx affected -t lint -- --fix
```

### Check formatting

```bash
npx nx format:check
```

### Automatically fix formatting

```bash
npx nx format:write
```

### Run unit tests for all components and apps

```bash
npx nx run-many --all --target=test
```

### Build an application

```bash
npx nx build <APP-NAME>
```

Example: `npx nx build ligands`

### Update Angular / Nx dependencies

```bash
npx nx migrate latest
```

## Testing SSR pages locally

Some applications use server-side rendering.

Currently, SSR is used by:

| Project   | Location                 |
| --------- | ------------------------ |
| Ligands   | `apps/ligands`           |
| Complexes | `apps/complexes`         |
| PDBe-KB   | `apps/kb-corporate-page` |

### Example: testing Ligands SSR locally

Build the application:

```bash
npx nx build ligands
```

Run the SSR server:

```bash
PORT=4000 NODE_ENV=production APP_BASE_HREF=/pdbe-srv/pdbechem/chemicalCompound/ node dist/apps/ligands/server/server.mjs
```

Then open an example URL in the browser:

```bash
http://localhost:4000/pdbe-srv/pdbechem/chemicalCompound/ATP
```

The important part is that the local URL must include the same base href passed through APP_BASE_HREF.

## Using the Playground App

The Playground app currently exists in the repository but is not actively used.

Historically, it was used to quickly showcase experimental components or pages.

Simply create a page component in the `pages` folder to showcase whatever you want to do. Add its `route` in the `app.routes.ts`, then put its link the `app.component.html` file as sidebar menu.

Add any `child` or `reusable` components in the `components` folder, while `services` and `models` in their respective folders.

## Deployment using CI/CD

We already configured GitLab CI/CD to deploy the `playground` branch to Netlify for the playground app. The deployment is triggered automatically when a commit is pushed to the `playground` branch. The deployment is available on https://connect-playground-demo.netlify.app/.

## Deploying to your own site

We use Netlify to deploy the playground app. To deploy the playground app, you need to have the Netlify CLI installed.

### Install Netlify CLI

```bash
npm install netlify-cli -g
```

### Access to the Netlify account

A Netlify account is already created for the project. You need to have access to the account to deploy the playground app. Get the personal access token from the account owner and prefix the token with `NETLIFY_AUTH_TOKEN=` and export it as an environment variable. This will enaable you to have access to the Netlify account through out the deployment process.

### Build the playground app

```bash
npx nx build playground
```

This will create a `dist/apps/playground` folder. Keep a note of the path to the browser directory inside the `dist/apps/playground` folder. This is the path to the playground app that you will deploy.

### Now create a site for your playground app

```bash
netlify sites:create --filter playground
```

1. When prompted to select the team, choose **EMBL-EBI PDBe**
2. When prompted to select the site name, choose a name that is not already taken. For example, `connect-playground-<your-name>`

Once this successfully creates the site, you will get a message with site details. Keep the site ID and URL for later use.

### Deploy the playground app

```bash
netlify deploy --filter playground --dir <build dir> --site <site ID>
```

Use the build directory path from the previous step as the `--dir` argument. Use the site ID from the previous step as the `--site` argument.

Once this successfully stages the deployment, you will get a message with the deployment details. You can use the Website draft URL to see your deployment.

You can use the draft URL to see the deployment. Once you are happy with the deployment, you can publish the deployment by adding `--prod` flag to the previous deploy command.

## Contribution guideline

- [Guidelines to add new project / library component](./docs/guidelines.md)
- [Creating a new library component](./docs/creating-library-component.md)
- [Creating a new project](./docs/creating-app.md)
- [Creating and using shared-services to get data](./docs/shared-services.md)

## Performance checks

- [More details about performance checks integration](./docs/performance-check.md)
