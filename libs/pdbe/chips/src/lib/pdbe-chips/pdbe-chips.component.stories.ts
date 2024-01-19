import { Meta } from '@storybook/angular';
import { PdbeChipsComponent } from './pdbe-chips.component';

const actionArgs = {
  backgroundColor: {
    control: { type: 'color' },
    description: 'Chip background color',
  },
  highlightColor: {
    control: { type: 'color' },
    description: 'Color of chip background on hover',
  },
  fontColor: {
    control: { type: 'color' },
    description: 'Color of font inside chip',
  },
  label: {
    control: { type: 'text' },
    description: 'Chip label',
  },
  url: {
    control: { type: 'text' },
    description: 'Chip url',
  },
};

export default {
  title: 'PDBe Components/PDBe Chips',
  component: PdbeChipsComponent,
  tags: ['autodocs'],
} as Meta<PdbeChipsComponent>;

export const Story1 = {
  render: (args: PdbeChipsComponent) => ({
    props: args,
  }),
  args: {
    backgroundColor: "#056643",
    highlightColor: "#0A5032",
    fontColor: "white",
    label: "Protein name",
    url: "",
  },
  argTypes: actionArgs,
  name: 'PDBe chips',
};

export const Story2 = {
  render: (args: PdbeChipsComponent) => ({
    props: args,
  }),
  args: {
    backgroundColor: "#086C68",
    highlightColor: "#085F5C",
    fontColor: "white",
    label: "Q00000",
    url: "",
  },
  argTypes: actionArgs,
  name: 'PDBe-KB chips',
};
