# PDBConnect

Monorepo for PDBe front-end applications and component library

## Getting started

#### Setting up the development environment

##### 1. Install the necessary softwares

- Recommended Editor - VS Code (https://code.visualstudio.com/)
- Node.js (^16.16.0) (https://nodejs.org/en)
- Git (https://git-scm.com/)
- Typescript (~4.7.2) [ `npm install -g typescript` ]
- Angular CLI (^16.0.2) [ `npm install -g @angular/cli` ]
- Nx [ `npm install -g nx@latest` ]
- NRWL Schematic (8.12.11) [ `npm install -g @nrwl/schematics` ]

##### 2. Clone Repository

- `git clone`

##### 3. Open the directory and install dependencies

- `npm install`

##### 4. Install recommended VS Code extensions

- After opening the project in VS Code you will get a recommendation notification on the bottom right corner of the editor. On clicking `Install` all the recommended extensions will be install.

- For any reasons, if the notification doesn't show up we can manually open up Recommended Extensions settings
  - Open the command palette `CMD + Shift + p`
  - Type Show Recommended Extensions
  - Install all the extensions from the search result list

##### 5. Run Storybook to view the Component library with documentation

- `npx nx storybook lib-docs`

##### 6. Run App to view the pages. All the Apps are stored in the 'apps' folder

- `npx nx serve <APP-NAME>` (Example: `npx nx serve connect`)

##### 7. Run Nx Graph to see a diagram of the dependencies of the projects

- `npx nx graph`

##### 8. For checking linter errors

- `npx nx affected -t lint --parallel=3`

##### 9. For checking formatting errors

- `npx nx format:check`

##### 10. For automatic fix of linter errors

- `npx nx affected -t lint -- --fix`

##### 10. For automatic fix of format errors

- `npx nx format:write`

##### 11. For running unit tests for all components and apps

- `npx nx run-many --all --target=test`

##### 12. Build Storybook and host it local in case you find error on wwwint but not locally

- `npx nx storybook lib-docs:build-storybook`
- `npx http-server dist/storybook/lib-docs/`

##### 13. For updating the angular version

- `npx nx migrate latest`

## Using the Playground App

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
