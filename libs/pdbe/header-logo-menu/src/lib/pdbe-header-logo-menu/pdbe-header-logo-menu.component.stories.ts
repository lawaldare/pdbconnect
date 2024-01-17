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
  // urlNames: {
  //   description: 'List of menu URLs names',
  // },
  urls: {
    description: 'List of menu URLs',
  },
  menuHighlightColor: {
    control: { type: 'color' },
    description: 'Color of menu highlight for small screens',
  },
  // suggestions: {
  //   description: 'Suggestions/result list',
  // },
  // searchKeyword: {
  //   description: 'Event emitter to get Search Keyword',
  //   action: 'searchKeyword',
  // },
  // selectedIndex: {
  //   description: 'Event emitter to get selected suggestion index',
  //   action: 'selectedIndex',
  // },
};

export default {
  title: 'PDBe Components/Header Logo Menu',
  component: PdbeHeaderLogoMenuComponent,
  tags: ['autodocs'],
} as Meta<PdbeHeaderLogoMenuComponent>;

export const Story1 = {
  render: (args: PdbeHeaderLogoMenuComponent) => ({
    props: args,
  }),
  args: {
    backgroundColor: "#056643",
    logoType: "PDBe",
    urls: [{"name": "Services", "path": "https://www.ebi.ac.uk/pdbe/pdbe-services"},
    {"name": "Documentation", "path": "https://www.ebi.ac.uk/pdbe/documentation"},
    {"name": "Training", "path":"https://www.ebi.ac.uk/pdbe/pdbe-training" }],
    menuHighlightColor: "#0a5032"
  },
  argTypes: actionArgs,
  name: 'Default',
};








