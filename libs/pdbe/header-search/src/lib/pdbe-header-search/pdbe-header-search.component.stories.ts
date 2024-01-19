import { Meta } from '@storybook/angular';
import { PdbeHeaderSearchComponent } from './pdbe-header-search.component';

const actionArgs = {
  backgroundColor: {
    control: { type: 'color' },
    description: 'Button background color',
  },
  examples: {
    description: 'List of example URLs objects',
  },
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
  searchButtonType: {
    control: { type: 'radio' },
    description: 'PDBe or PDBe-KB',
    options: ['PDBe', 'PDBe-KB'],
  }
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
    backgroundColor: '#007B53',
    examples: [
      {'label': 'Haemoglobin', 'url': 'https://www.ebi.ac.uk/pdbe/entry/search/index/?searchParams=%7B%22text%22:%5B%7B%22value%22:%22hemoglobin%22,%22condition1%22:%22AND%22,%22condition2%22:%22Contains%22%7D%5D,%22resultState%22:%7B%22tabIndex%22:0,%22paginationIndex%22:1,%22perPage%22:%2210%22,%22sortBy%22:%22Sort%20by%22%7D%7D'},
      {'label': 'BRCA1_HUMAN', 'url': 'https://www.ebi.ac.uk/pdbe/entry/search/index/?searchParams=%7B%22text%22:%5B%7B%22value%22:%22BRCA1_HUMAN%22,%22condition1%22:%22AND%22,%22condition2%22:%22Contains%22%7D%5D,%22resultState%22:%7B%22tabIndex%22:0,%22paginationIndex%22:1,%22perPage%22:%2210%22,%22sortBy%22:%22Sort%20by%22%7D%7D'},
    ],
    beta: true,
    buttonText: 'Search',
    placeholder: 'Search in PDBe and PDBe-KB',
    suggestions: [],
    searchButtonType: "PDBe"
  },
  argTypes: actionArgs,
  name: 'Default',
};
