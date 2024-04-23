# Creating a new library component

#### * After reading the [guidelines here](./guidelines.md) follow the steps below to create a new library component


#### Parameter values
Refer table to replace parameter values mentioned in the commands below

|Param name          | Library Type      | Value|
| ------------------- | ----------------- | ------------------------------ |
| `<COMPONENT-NAME>`   | -     | use lowercase names with kebab-casing |
| `<DIRECTORY>`   | Visual Framework     | `vf` |
| `<DIRECTORY>`   | PDBe     | `pdbe` |
| `<LIB-PATH>`   | Visual Framework     | `@vf-lib` |
| `<LIB-PATH>`   | PDBe     | `@pdbe-lib` |


##### 1. Generate component files

- `npx nx g @nrwl/angular:library <COMPONENT-NAME> --standalone --directory <DIRECTORY> --projectNameAndRootFormat derived --routing false --style=scss --importPath=<LIB-PATH>/<COMPONENT-NAME>`

- Example – Adding a special button component to PDBe library –
`npx nx g @nrwl/angular:library spl-button --standalone --directory pdbe --projectNameAndRootFormat derived --routing false --style=scss --importPath=@pdbe-lib/spl-button`

##### 2. Generate Storybook documentation
- `npx nx g @nrwl/angular:stories <DIRECTORY>-<COMPONENT-NAME> --generateCypressSpecs false`

- Example – Create Storybook documentation for the spl-button component
`npx nx g @nrwl/angular:stories pdbe-spl-button --generateCypressSpecs false`

##### 3. Types of component files generated after following the steps - 1 and 2
- \*.component.html – HTML template file
-  \*..component.scss – stylesheet file
- \*.component.ts – controller TS file
- \*.component.spec.ts – unit test spec file
- \*.component.stories.ts – storybook document file

##### 4. Update story title in the \*.component.stories.ts file to -
- `Visual Framework/<COMPONENT-NAME>` - for Visual Framework
- `PDBe Components/<COMPONENT-NAME>` - for PDBe
- For `<COMPONENT-NAME>` - use CamelCase style with a space to separate words
- Example - `PDBe Components/Special Button`

##### 5. Run Storybook to view your component in the browser
- `npx nx storybook lib-docs`

##### 6. Start the unit testing server
- `npx nx run <DIRECTORY>-<COMPONENT-NAME>:test --watch`

##### 7. Command to delete a component, if needed!
- `npx nx generate @nrwl/workspace:remove <DIRECTORY>-<COMPONENT-NAME>`
- Example - `npx nx generate @nrwl/workspace:remove pdbe-spl-button`