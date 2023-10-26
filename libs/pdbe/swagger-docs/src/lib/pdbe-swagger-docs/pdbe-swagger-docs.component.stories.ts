import { Meta } from '@storybook/angular';
import { PdbeSwaggerDocsComponent } from './pdbe-swagger-docs.component';

export default {
  title: 'PDBe Components/Swagger Docs',
  component: PdbeSwaggerDocsComponent,
} as Meta<PdbeSwaggerDocsComponent>;

export const Primary = {
  render: (args: PdbeSwaggerDocsComponent) => ({
    props: args,
  }),
  args: {},
};
