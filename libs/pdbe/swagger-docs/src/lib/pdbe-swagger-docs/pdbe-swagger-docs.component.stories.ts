import { Meta } from '@storybook/angular';
import { PdbeSwaggerDocsComponent } from './pdbe-swagger-docs.component';


const actionArgs = {
  jsonUrl: {
    control: { type: 'text' },
    description: 'OpenAPI Json file URL.',
  },
  apiKeyValue: {
    control: { type: 'text' },
    description: 'API key. Added as a GET request parameter when set.',
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
    jsonUrl: 'https://wwwdev.ebi.ac.uk/pdbe/aggregated-api/openapi.json',
  },
  argTypes: actionArgs,
  name: 'Default',
};
