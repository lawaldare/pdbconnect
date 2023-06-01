import { Meta } from '@storybook/angular';
import { VfLinkComponent } from './vf-link.component';

export default {
  title: 'Visual Framework/Link',
  component: VfLinkComponent,
  tags: ['autodocs'],
} as Meta<VfLinkComponent>;

const actionArgs = {
  external: {
    control: { type: 'boolean' },
    description: 'External Link style',
    table: {
      defaultValue: { summary: false },
    },
  },
  location: {
    control: { type: 'text' },
    description: 'Link Href Location',
    table: {
      defaultValue: { summary: 'JavaScript:Void(0);' },
    },
  },
  label: {
    control: { type: 'text' },
    description: 'Link label',
    table: {
      defaultValue: { summary: 'Link' },
    },
  },
};

export const Story1 = {
  render: (args: VfLinkComponent) => ({
    props: args,
  }),
  args: {},
  argTypes: actionArgs,
  name: 'Default',
};

export const Story2 = {
  render: (args: VfLinkComponent) => ({
    props: args,
  }),
  args: {
    external: true,
  },
  argTypes: actionArgs,
  name: 'External',
};

export const Story3 = {
  render: (args: VfLinkComponent) => ({
    props: args,
  }),
  args: {
    location: 'http://pdbe.org',
  },
  argTypes: actionArgs,
  name: 'Location',
};

export const Story4 = {
  render: (args: VfLinkComponent) => ({
    props: args,
  }),
  args: {
    label: 'Link',
  },
  argTypes: actionArgs,
  name: 'Label',
};
