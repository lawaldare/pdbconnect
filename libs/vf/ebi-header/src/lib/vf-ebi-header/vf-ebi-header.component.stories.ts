import { Meta } from '@storybook/angular';
import { VfEbiHeaderComponent } from './vf-ebi-header.component';

export default {
  title: 'Visual Framework/EBI Header',
  component: VfEbiHeaderComponent,
  tags: ['autodocs'],
} as Meta<VfEbiHeaderComponent>;

export const Primary = {
  render: (args: VfEbiHeaderComponent) => ({
    props: args,
  }),
  args: {},
};
