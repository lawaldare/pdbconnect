# Creating a new project

#### \* After reading the [guidelines here](./guidelines.md) follow the steps below to create a new project

##### 1. Generate Project files

- `npx nx g @nrwl/angular:app <PROJECT-NAME> --standalone --routing`

- Example – Creating a new project called - entries
  `npx nx g @nrwl/angular:app entries --standalone --routing`

##### 2. (Optional) Modify project.json to add shared resources

- This step is required in order for library static resources
  to work properly (e.g logo images)

- Add the following configuration:

- `{"glob": "**/*", "input": "shared_assets/", "output": "./assets/"}`

- to the "assets" attribute (targets -> build -> assets) in
  your created app project.json file

##### 3. (Optional) Add a configuration service and JSON if needed

- This step is required if you need to add a configuration like an API URL that should be used in the app which can be different for different environments.
- Add an application config which is a DI token to the project's src folder
  (refer. `apps/apidocs/src/app/app.config.ts`)
- Add a configuration JSON file to the project's src folder
  (e.g. `apps/apidocs/src/app.config.json`)
  Respective keys can be added to the JSON file and can be accessed in the configuration service.

  For e.g.

  ```json
  {
    "openApiJsonUrl": "https://www.ebi.ac.uk/pdbe/aggregated-api/openapi.json"
  }
  ```

##### 4. Run the project app locally

- `npx nx serve <PROJECT-NAME>` (Example - `nx serve entries`)

##### 5. Command to add a component to the project app

- `npx nx generate @nrwl/angular:component <DIRECTORY/<COMPONENT-NAME> --standalone --project=<PROJECT-NAME> --style=scss`

- Example – Add Summary component to entries project
- `npx nx generate @nrwl/angular:component pages/summary --standalone --project=entries --style=scss`

##### 6. Command to add a service to the project app

- `npx nx generate @nrwl/angular:service <DIRECTORY/<SERVICE-NAME> --project=<PROJECT-NAME>`

- Example – Add test service to entries project
- `npx nx generate @nrwl/angular:service services/test --project=entries`

##### 7. Command to delete a project, if needed!

- `npx nx generate @nrwl/workspace:remove --projectName=<PROJECT-NAME>`
- Example - `npx nx generate @nrwl/workspace:remove --projectName=entries`
