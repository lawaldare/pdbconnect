# Creating a new project

#### \* After reading the [guidelines here](./guidelines.md) follow the steps below to create a new project

##### 1. Generate Project files

- `npx nx g @nrwl/angular:app <PROJECT-NAME> --standalone --routing`

- Example – Creating a new project called - entries
  `npx nx g @nrwl/angular:app entries --standalone --routing`

**NOTE**: Do not suffix -pages to any app name. It would be added for deployment purposes.

##### 2. Run the project app locally

- `npx nx serve <PROJECT-NAME>` (Example - `nx serve entries`)

##### 2. Command to add a component to the project app

- `npx nx generate @nrwl/angular:component <DIRECTORY/<COMPONENT-NAME> --standalone --project=<PROJECT-NAME> --style=scss`

- Example – Add Summary component to entries project
- `npx nx generate @nrwl/angular:component pages/summary --standalone --project=entries --style=scss`

##### 3. Command to add a service to the project app

- `npx nx generate @nrwl/angular:service <DIRECTORY/<SERVICE-NAME> --project=<PROJECT-NAME>`

- Example – Add test service to entries project
- `npx nx generate @nrwl/angular:service services/test --project=entries`

##### 4. Command to delete a project, if needed!

- `npx nx generate @nrwl/workspace:remove --projectName=<PROJECT-NAME>`
- Example - `npx nx generate @nrwl/workspace:remove --projectName=entries`
