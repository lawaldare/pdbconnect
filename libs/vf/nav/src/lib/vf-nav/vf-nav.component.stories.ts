import { Meta } from '@storybook/angular';
import { VfNavComponent } from './vf-nav.component';

const actionArgs = {
  menuItems: {
    control: { type: 'Object' },
    description: 'List of Objects with label and url property',
  },
};

export default {
  title: 'Visual Framework/Navigation',
  component: VfNavComponent,
  tags: ['autodocs'],
} as Meta<VfNavComponent>;

export const Story1 = {
  render: (args: VfNavComponent) => ({
    props: args,
  }),
  args: {
    menuItems: [
      {
        label: 'Anchor 1',
        url: 'Javascript:void(0)',
      },
      {
        label: 'Anchor 2',
        url: 'Javascript:void(0)',
      },
      {
        label: 'Anchor 3',
        url: 'Javascript:void(0)',
      },
    ],
  },
  argTypes: actionArgs,
  name: 'Default',
};
