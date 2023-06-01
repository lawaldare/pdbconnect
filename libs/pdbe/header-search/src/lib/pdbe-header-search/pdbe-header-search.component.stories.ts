import { Meta } from '@storybook/angular';
import { PdbeHeaderSearchComponent } from './pdbe-header-search.component';

const actionArgs = {
  beta: {
    control: { type: 'boolean' },
    description: 'Display BETA logo',
  },
  buttonText: {
    control: { type: 'text' },
    description: 'Button text',
    table: {
      defaultValue: { summary: 'Search' },
    },
  },
  placeholder: {
    control: { type: 'text' },
    description: 'Placeholder Text',
    table: {
      defaultValue: { summary: 'Search for protein, gene or organism' },
    },
  },
  suggestions: {
    description: 'Suggestions/result list',
  },
  searchKeyword: {
    description: 'Event emitter to get Search Keyword',
    action: 'searchKeyword',
  },
  selectedIndex: {
    description: 'Event emitter to get selected suggestion index',
    action: 'selectedIndex',
  },
};

export default {
  title: 'PDBe Components/Header Search',
  component: PdbeHeaderSearchComponent,
  tags: ['autodocs'],
} as Meta<PdbeHeaderSearchComponent>;

export const Story1 = {
  render: (args: PdbeHeaderSearchComponent) => ({
    props: args,
  }),
  args: {
    beta: true,
    buttonText: 'Search',
    placeholder: 'Search for protein, gene or organism',
    suggestions: [],
  },
  argTypes: actionArgs,
  name: 'Default',
};
