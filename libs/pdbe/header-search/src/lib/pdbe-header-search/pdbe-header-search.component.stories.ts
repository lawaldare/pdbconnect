import { Meta } from '@storybook/angular';
import { PdbeHeaderSearchComponent } from './pdbe-header-search.component';

const actionArgs = {
  backgroundColor: {
    control: { type: 'color' },
    description: 'Search background color',
  },
  searchButtonChipsType: {
    control: { type: 'radio' },
    description: 'PDBe or PDBe-KB',
    options: ['PDBe', 'PDBe-KB'],
  },
  examples: {
    control: { type: 'text' },
    description: 'List of example URLs objects',
  },
  hasAdvancedSearch: {
    control: { type: 'boolean' },
    description: 'Has advanced search?',
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
  }
};

export default {
  title: 'PDBe Components/Header Search',
  component: PdbeHeaderSearchComponent,
  tags: ['autodocs'],
  parameters: {
    viewport: {
      defaultViewport: 'size_1440',
    },
  },
} as Meta<PdbeHeaderSearchComponent>;

export const Story1 = {
  render: (args: PdbeHeaderSearchComponent) => ({
    props: args,
  }),
  args: {
    backgroundColor: '#007B53',
    searchButtonChipsType: "PDBe",
    hasAdvancedSearch: true,
    examples: [
      {'label': 'Haemoglobin', 'url': 'https://www.ebi.ac.uk/pdbe/entry/search/index/?searchParams=%7B%22text%22:%5B%7B%22value%22:%22hemoglobin%22,%22condition1%22:%22AND%22,%22condition2%22:%22Contains%22%7D%5D,%22resultState%22:%7B%22tabIndex%22:0,%22paginationIndex%22:1,%22perPage%22:%2210%22,%22sortBy%22:%22Sort%20by%22%7D%7D'},
      {'label': 'BRCA1_HUMAN', 'url': 'https://www.ebi.ac.uk/pdbe/entry/search/index/?searchParams=%7B%22text%22:%5B%7B%22value%22:%22BRCA1_HUMAN%22,%22condition1%22:%22AND%22,%22condition2%22:%22Contains%22%7D%5D,%22resultState%22:%7B%22tabIndex%22:0,%22paginationIndex%22:1,%22perPage%22:%2210%22,%22sortBy%22:%22Sort%20by%22%7D%7D'},
    ],
    buttonText: 'Search',
    placeholder: 'Search in PDBe and PDBe-KB',
    suggestions: []
  },
  argTypes: actionArgs,
  name: 'PDBe Search',
};

export const Story2 = {
  render: (args: PdbeHeaderSearchComponent) => ({
    props: args,
  }),
  args: {
    backgroundColor: 'rgba(8, 95, 92, 0.79)',
    searchButtonChipsType: "PDBe-KB",
    hasAdvancedSearch: false,
    examples: [
      {'label': 'Q14676', 'url': 'https://www.ebi.ac.uk/pdbe/pdbe-kb/proteins/Q14676'},
      {'label': '2etx', 'url': 'https://www.ebi.ac.uk/pdbe/pdbe-kb/proteins/2etx'},
    ],
    buttonText: 'Search',
    placeholder: 'Search in PDBe and PDBe-KB',
    suggestions: []
  },
  argTypes: actionArgs,
  name: 'PDBe-KB Search',
};
