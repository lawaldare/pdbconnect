import { Meta } from '@storybook/angular';
import { PdbeButtonComponent } from './pdbe-button.component';

const actionArgs = {
  backgroundColor: {
    control: { type: 'color' },
    description: 'Button background color',
  },
  fontColor: {
    control: { type: 'color' },
    description: 'Button font color',
  },
  borderColor: {
    control: { type: 'color' },
    description: 'Button border color',
  },
  shadowColor: {
    control: { type: 'color' },
    description: 'Button shadow color',
  },
  label: {
    control: { type: 'text' },
    description: 'Button label',
  },
  paddingSize: {
    control: { type: 'radio' },
    description: 'Button padding: 16px or 18px',
    options: ['Small', 'Big'],
  },
  mobileIconName: {
    control: { type: 'radio' },
    description: 'Button icon on mobile view',
    options: ['none', 'search'],
  },
};

export default {
  title: 'PDBe Components/PDBe Button',
  component: PdbeButtonComponent,
  tags: ['autodocs'],
} as Meta<PdbeButtonComponent>;

export const Story1 = {
  render: (args: PdbeButtonComponent) => ({
    props: args,
  }),
  args: {
    backgroundColor: "#C66717",
    fontColor: "#FFFFFF",
    borderColor: "#C66717",
    shadowColor: "#B65417",
    label: "Primary",
    paddingSize: "Small",
    mobileIconName: "none"
  },
  argTypes: actionArgs,
  name: 'PDBe Primary Button',
};

export const Story2 = {
  render: (args: PdbeButtonComponent) => ({
    props: args,
  }),
  args: {
    backgroundColor: "#FFFFFF",
    fontColor: "#0A5032",
    borderColor: "#0A5032",
    shadowColor: "#0A5032",
    label: "Secondary",
    paddingSize: "Small",
    mobileIconName: "none"
  },
  argTypes: actionArgs,
  name: 'PDBe Secondary Button',
};

export const Story3 = {
  render: (args: PdbeButtonComponent) => ({
    props: args,
  }),
  args: {
    backgroundColor: "#FFFFFF",
    fontColor: "#217976",
    borderColor: "#217976",
    shadowColor: "#0F5C5A",
    label: "Secondary",
    paddingSize: "Small",
    mobileIconName: "none"
  },
  argTypes: actionArgs,
  name: 'PDBe-KB Secondary Button',
};

export const Story4 = {
  render: (args: PdbeButtonComponent) => ({
    props: args,
  }),
  args: {
    backgroundColor: "#FFFFFF",
    fontColor: "#0A5032",
    borderColor: "#0A5032",
    shadowColor: "#0A5032",
    label: "Search",
    paddingSize: "Big",
    mobileIconName: "search"
  },
  argTypes: actionArgs,
  name: 'PDBe Secondary Search Button',
};

export const Story5 = {
  render: (args: PdbeButtonComponent) => ({
    props: args,
  }),
  args: {
    backgroundColor: "#FFFFFF",
    fontColor: "#217976",
    borderColor: "#217976",
    shadowColor: "#0F5C5A",
    label: "Search",
    paddingSize: "Big",
    mobileIconName: "search"
  },
  argTypes: actionArgs,
  name: 'PDBe Secondary Search Button',
};