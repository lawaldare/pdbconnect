import { Meta } from '@storybook/angular';
import { PdbeSearchAutocompleteComponent } from './pdbe-search-autocomplete.component';

export default {
  title: 'PDBe Components/Search Autocomplete Dialog',
  component: PdbeSearchAutocompleteComponent,
} as Meta<PdbeSearchAutocompleteComponent>;

export const Story1 = {
  render: (args: PdbeSearchAutocompleteComponent) => ({
    props: args,
  }),
  args: {},
};
