import { Meta } from '@storybook/angular';
import { PdbeHeroBannerComponent } from './pdbe-hero-banner.component';

const actionArgs = {
  logo: {
    control: { type: 'text' },
    description: 'Logo Url',
  },
  heading: {
    control: { type: 'text' },
    description: 'Heading text',
    table: {
      defaultValue: { summary: 'EMBL-EBI' },
    },
  },
  subheading: {
    control: { type: 'text' },
    description: 'Sub-heading text',
  },
  url: {
    control: { type: 'text' },
    description: 'Logo/ Heading Url',
  },
  searchBeta: {
    control: { type: 'boolean' },
    description: 'Display BETA logo',
  },
  searchButtonText: {
    control: { type: 'text' },
    description: 'Search button text',
    table: {
      defaultValue: { summary: 'Search' },
    },
  },
  searchPlaceholder: {
    control: { type: 'text' },
    description: 'Placeholder Text',
    table: {
      defaultValue: { summary: 'Search for protein, gene or organism' },
    },
  },
  searchSuggestions: {
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
  title: 'PDBe Components/Hero Banner',
  component: PdbeHeroBannerComponent,
  tags: ['autodocs'],
} as Meta<PdbeHeroBannerComponent>;

export const Story1 = {
  render: (args: PdbeHeroBannerComponent) => ({
    props: args,
  }),
  args: {
    url: 'https://www.ebi.ac.uk/pdbe/pdbe-kb',
    heading: 'Protein Data Bank in Europe - Knowledge Base',
    subheading: 'Aggregated Views of Proteins',
    searchBeta: true,
    searchButtonText: 'Search',
    searchPlaceholder: 'Search for protein, gene or organism',
    searchSuggestions: [],
  },
  argTypes: actionArgs,
  name: 'Default',
};
