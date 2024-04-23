# Creating and using shared-services to get data

#### \* After reading the [guidelines here](./guidelines.md) follow the steps below

#### Creating new shared service

##### 1. Create .ts and .spec.ts files for new service

- Add the code for the service you want to be shared as seen in examples below:

  (refer. `libs/pdbe/lib/pdbe-shared-services/config.service.ts`)

  (refer. `libs/pdbe/lib/pdbe-shared-services/data-retrieval.service.ts`)

- Do not forget to add unit tests if these apply:

  (refer. `libs/pdbe/lib/pdbe-shared-services/config.service.spec.ts`)

  (refer. `libs/pdbe/lib/pdbe-shared-services/data-retrieval.service.spec.ts`)

##### 2. Make service classes exportable to other applications

- For this service to be used by libraries it needs to be properly exported in the index.ts file of the shared-services lib.

  For e.g. in file: `libs/pdbe/shared-services/index.ts`

  ```
  export { AppConfig, ConfigService } from './lib/pdbe-shared-services/config.service';
  ```

#### Using a shared service in your application

##### 1. Add environment variables as needed

- This step is required if you need to add a configuration like an API URL that should be used in the app which can be different for different environments.

  (refer. `apps/connect/src/environments/environment.ts`)

  (refer. `apps/connect/src/environments/environment.prod.ts`)

  (refer. `apps/connect/src/app/projects/entry/services/entry-api.service.ts` for usage)

- Make sure if you add environment files to adjust the angular project.json to make use of this.

  Add lines like those below from ref. `apps/connect/project.json`:

  ```json
      "configurations": {
        "production": {
          "fileReplacements": [
            {
              "replace": "apps/connect/src/environments/environment.ts",
              "with": "apps/connect/src/environments/environment.prod.ts"
            }
          ],
        }
      }
  ```

##### 2. Import shared service

- Import the shared service you want according to references below:

  (refer. `apps/connect/src/app/projects/entry/services/entry-api.service.ts`)

  (refer. `apps/apidocs/src/app/app.config.ts`)

##### 3. Create or use data models for typing API data

- Import shared data models for the data you want to retrieve and convert this as references:

  (for existing data models refer. `libs/pdbe/shared-services/lib/data-models/entry/summary.model.ts`)

  (for usage example refer. `apps/connect/src/app/projects/entry/services/entry-api.service.ts`)

- If you need to create a new model that can be of use to other projects (From Agg. API as example)
  you can use a library called [pydantic to ts](https://pypi.org/project/pydantic-to-typescript/) to help sometimes.

  For e.g.

  ```
  pydantic2ts --module ./backend/api.py --output ./frontend/apiTypes.ts
  ```

  Please note you will probably have to adjust the input files and output data models for correct conversion depending
  on how they are formatted.
  (for existing data models refer. `libs/pdbe/shared-services/lib/data-models/entry/summary.model.ts`)

  Another useful tool is [MakeTypes from JSON samples](https://jvilk.com/MakeTypes/) which will also need
  adjustments during usage.
