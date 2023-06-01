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
- NRWL Schematic (8.12.11) [ `npm install -g @nrwl/schematics` ]

##### 2. Clone Repository

- `git clone`

##### 3. Open the directory and install dependencies

- `npm install`

##### 4. Install recommended VS Code extensions

+ After opening the project in VS Code you will get a recommendation notification on the bottom right corner of the editor. On clicking `Install` all the recommended extensions will be install.

+ For any reasons, if the notification doesn't show up we can manually open up Recommended Extensions settings
    + Open the command palette `CMD + Shift + p`
    + Type Show Recommended Extensions
    + Install all the extensions from the search result list

##### 5. Run Storybook to view the Component library with documentation

- `nx storybook lib-docs`

##### 6. Run App to view the pages. All the Apps are stored in the 'apps' folder

- `nx serve <APP-NAME>` (Example: `nx serve proteins`)

##### 7. Run Nx Graph to see a diagram of the dependencies of the projects

- `nx graph`

## Contribution guideline

- [Guidelines to add new project / library component](./docs/guidelines.md)
- [Creating a new library component](./docs/creating-library-component.md)
- [Creating a new project](./docs/creating-app.md)
