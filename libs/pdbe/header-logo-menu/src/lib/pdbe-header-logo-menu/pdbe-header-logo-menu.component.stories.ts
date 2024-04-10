import { Meta } from '@storybook/angular';
import { PdbeHeaderLogoMenuComponent } from './pdbe-header-logo-menu.component';

const actionArgs = {
  backgroundColor: {
    control: { type: 'color' },
    description: 'Logo background color',
  },
  logoType: {
    control: { type: 'radio' },
    description: 'Type of rendered logo',
    options: ['PDBe', 'PDBe-KB'],
  },
  urls: {
    description: 'List of menu URLs',
  },
  menuHighlightColor: {
    control: { type: 'color' },
    description: 'Color of menu links highlight for mobile view',
  },
};

export default {
  title: 'PDBe Components/Header Logo Menu',
  component: PdbeHeaderLogoMenuComponent,
  tags: ['autodocs'],
  parameters: {
    viewport: {
      defaultViewport: 'size_1440',
    },
  },
} as Meta<PdbeHeaderLogoMenuComponent>;

export const Story1 = {
  render: (args: PdbeHeaderLogoMenuComponent) => ({
    props: args,
  }),
  args: {
    backgroundColor: '#056643',
    logoType: 'PDBe',
    urls: [
      { name: 'Services', path: 'https://www.ebi.ac.uk/pdbe/pdbe-services' },
      { name: 'Documentation', path: 'https://www.ebi.ac.uk/pdbe/documentation' },
      { name: 'Training', path: 'https://www.ebi.ac.uk/pdbe/pdbe-training' },
    ],
    menuHighlightColor: '#0a5032',
  },
  argTypes: actionArgs,
  name: 'PDBe',
};

export const Story2 = {
  render: (args: PdbeHeaderLogoMenuComponent) => ({
    props: args,
  }),
  args: {
    backgroundColor: '#085F5C',
    logoType: 'PDBe-KB',
    urls: [
      { name: 'Services', path: 'https://www.ebi.ac.uk/pdbe/pdbe-services' },
      { name: 'Documentation', path: 'https://www.ebi.ac.uk/pdbe/documentation' },
      { name: 'Training', path: 'https://www.ebi.ac.uk/pdbe/pdbe-training' },
    ],
    menuHighlightColor: '#086C68',
  },
  argTypes: actionArgs,
  name: 'PDBe-KB',
};
