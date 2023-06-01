import { Meta } from '@storybook/angular';
import { LibDocsComponent } from './lib-docs.component';

export default {
  title: 'LibDocsComponent',
  component: LibDocsComponent,
} as Meta<LibDocsComponent>;

export const Primary = {
  render: (args: LibDocsComponent) => ({
    props: args,
  }),
  args: {},
};
