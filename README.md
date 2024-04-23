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

## Contribution guideline

- [Guidelines to add new project / library component](./docs/guidelines.md)
- [Creating a new library component](./docs/creating-library-component.md)
- [Creating a new project](./docs/creating-app.md)
- [Creating and using shared-services to get data](./docs/shared-services.md)
