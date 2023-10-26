import { Meta } from '@storybook/angular';
import { PdbeSwaggerDocsComponent } from './pdbe-swagger-docs.component';


const actionArgs = {
  openApiURL: {
    control: { type: 'text' },
    description: 'OpenAPI Json file URL',
  },
  hostname: {
    control: { type: 'text' },
    description: 'Hostname of APIs',
  },
  apiKeyValue: {
    control: { type: 'text' },
    description: 'API key',
  }
}

export default {
  title: 'PDBe Components/Swagger Docs',
  component: PdbeSwaggerDocsComponent,
  tags: ['autodocs'],
} as Meta<PdbeSwaggerDocsComponent>;

export const Primary = {
  render: (args: PdbeSwaggerDocsComponent) => ({
    props: args,
  }),
  args: {
    openApiURL: 'https://wwwdev.ebi.ac.uk/pdbe/aggregated-api/openapi.json',
    hostname: 'https://wwwdev.ebi.ac.uk/pdbe/aggregated-api/',
    apiKeyValue: 'AIzaSyCeurAJz7ZGjPQUtEaerUkBZ3TaBkXrY94',
  },
  argTypes: actionArgs,
  name: 'Default',
};
