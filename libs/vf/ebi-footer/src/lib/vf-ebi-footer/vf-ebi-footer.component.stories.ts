import { Meta } from '@storybook/angular';
import { VfEbiFooterComponent } from './vf-ebi-footer.component';

export default {
  title: 'Visual Framework/EBI Footer',
  component: VfEbiFooterComponent,
  tags: ['autodocs'],
} as Meta<VfEbiFooterComponent>;

export const Primary = {
  render: (args: VfEbiFooterComponent) => ({
    props: args,
  }),
  args: {},
};
