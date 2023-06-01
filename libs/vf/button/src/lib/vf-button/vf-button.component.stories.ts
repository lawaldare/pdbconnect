import { Meta } from '@storybook/angular';
import { VfButtonComponent } from './vf-button.component';

export default {
  title: 'Visual Framework/Button',
  component: VfButtonComponent,
  tags: ['autodocs'],
} as Meta<VfButtonComponent>;

const actionArgs = {
  type: {
    options: ['primary', 'secondary', 'tertiary'],
    control: { type: 'select' },
    description: 'Button style',
    table: {
      defaultValue: { summary: 'primary' },
    },
  },
  small: {
    control: { type: 'boolean' },
    description: 'Button size',
    table: {
      defaultValue: { summary: 'false' },
    },
  },
  disabled: {
    control: { type: 'boolean' },
    description: 'Disable button',
    table: {
      defaultValue: { summary: 'false' },
    },
  },
  label: {
    control: { type: 'text' },
    description: 'Button label',
    table: {
      defaultValue: { summary: 'Button' },
    },
  },
};

export const Story1 = {
  render: (args: VfButtonComponent) => ({
    props: args,
  }),
  args: {},
  argTypes: actionArgs,
  name: 'Default',
};

export const Story2 = {
  render: (args: VfButtonComponent) => ({
    props: args,
  }),
  args: {
    type: 'primary',
  },
  argTypes: actionArgs,
  name: 'Primary',
};

export const Story3 = {
  render: (args: VfButtonComponent) => ({
    props: args,
  }),
  args: {
    type: 'secondary',
  },
  argTypes: actionArgs,
  name: 'Secondary',
};

export const Story4 = {
  render: (args: VfButtonComponent) => ({
    props: args,
  }),
  args: {
    type: 'tertiary',
  },
  argTypes: actionArgs,
  name: 'Tertiary',
};

export const Story5 = {
  render: (args: VfButtonComponent) => ({
    props: args,
  }),
  args: {
    disabled: true,
  },
  argTypes: actionArgs,
  name: 'Disabled',
};

export const Story6 = {
  render: (args: VfButtonComponent) => ({
    props: args,
  }),
  args: {
    small: true,
  },
  argTypes: actionArgs,
  name: 'Small',
};

export const Story7 = {
  render: (args: VfButtonComponent) => ({
    props: args,
  }),
  args: {
    label: 'Button',
  },
  argTypes: actionArgs,
  name: 'Label',
};
