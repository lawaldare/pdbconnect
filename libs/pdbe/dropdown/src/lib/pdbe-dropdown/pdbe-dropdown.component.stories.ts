import { Meta } from '@storybook/angular';
import { PdbeDropdownComponent } from './pdbe-dropdown.component';

const actionArgs = {
  dropdownText: {
    control: { type: 'text' },
    description: 'Menu hover highlight color',
  },
  dropdownWidth: {
    control: { type: 'text' },
    description: 'Menu dropdown width',
  },
  options: {
    control: { type: 'text' },
    description: 'List of URL objects to list in dropdown',
  },
  optionsWidth: {
    control: { type: 'text' },
    description: 'Width of dropdown options',
  },
  optionsMaxHeight: {
    control: { type: 'text' },
    description: 'Max height of dropdown options menu before scrollbar',
  },
};

export default {
  title: 'PDBe Components/Dropdown',
  component: PdbeDropdownComponent,
  tags: ['autodocs'],
  parameters: { backgrounds: { default: 'dark' } },
} as Meta<PdbeDropdownComponent>;

export const Story1 = {
  render: (args: PdbeDropdownComponent) => ({
    props: args,
  }),
  args: {
    dropdownText: 'View file as',
    dropdownWidth: '154px',
    options: [
      { name: 'Archive mmCIF file', url: 'https://www.ebi.ac.uk/pdbe/entry-files/1cbs.cif', downloadable: false },
      { name: 'Updated mmCIF file', url: 'https://www.ebi.ac.uk/pdbe/entry-files/1cbs_updated.cif', downloadable: false },
      { name: 'PDB file', url: 'https://www.ebi.ac.uk/pdbe/entry-files/pdb1cbs.ent', downloadable: false },
      { name: 'PDB header', url: 'https://www.ebi.ac.uk/pdbe/static/entry/1cbs.header', downloadable: false },
      { name: 'Assembly composition XML', url: 'https://www.ebi.ac.uk/pdbe/static/entry/1cbs-assembly.xml', downloadable: false },
      { name: 'FASTA (entry)', url: 'https://www.ebi.ac.uk/pdbe/entry/pdb/1cbs/fasta', downloadable: false },
      { name: 'Summary report (PDF)', url: 'https://www.ebi.ac.uk/pdbe/entry-files/1cbs_validation.pdf', downloadable: false },
      { name: 'Full report (PDF)', url: 'https://www.ebi.ac.uk/pdbe/entry-files/1cbs_full_validation.pdf', downloadable: false },
      { name: 'Percentile plot (PNG)', url: 'https://www.ebi.ac.uk/pdbe/entry-files/1cbs_multipercentile_validation.png', downloadable: false },
      { name: 'Percentile plot (SVG)', url: 'https://www.ebi.ac.uk/pdbe/entry-files/1cbs_multipercentile_validation.svg', downloadable: false },
    ],
    optionsWidth: '197px',
    optionsMaxHeight: '392px',
  },
  argTypes: actionArgs,
  name: 'PDBe view dropdown',
};

export const Story2 = {
  render: (args: PdbeDropdownComponent) => ({
    props: args,
  }),
  args: {
    dropdownText: 'Download files',
    dropdownWidth: '166px',
    options: [
      { name: 'Archive mmCIF file', url: 'https://www.ebi.ac.uk/pdbe/entry-files/download/1cbs.cif', downloadable: true },
      { name: 'Updated mmCIF file', url: 'https://www.ebi.ac.uk/pdbe/entry-files/download/1cbs_updated.cif', downloadable: true },
      { name: 'PDB file', url: 'https://www.ebi.ac.uk/pdbe/entry-files/download/pdb1cbs.ent', downloadable: true },
      { name: 'FASTA (entry)', url: 'https://www.ebi.ac.uk/pdbe/entry/pdb/1cbs/fasta', downloadable: true },
      { name: 'Full report (PDF)', url: 'https://www.ebi.ac.uk/pdbe/entry-files/download/1cbs_full_validation.pdf', downloadable: true },
      { name: 'Experimental restraints (text)', url: '', downloadable: true },
      { name: 'Validation data (XML)', url: 'https://www.ebi.ac.uk/pdbe/entry-files/download/1cbs_validation.xml', downloadable: true },
      { name: 'Assembly 1 (mmCIF; gz)', url: 'https://www.ebi.ac.uk/pdbe/static/entry/download/1cbs-assembly1.cif.gz', downloadable: true },
      { name: 'SIFTS XML file with residue-level mappings', url: 'https://www.ebi.ac.uk/pdbe/files/sifts/1cbs.xml.gz', downloadable: true },
      { name: 'PDB header', url: 'https://www.ebi.ac.uk/pdbe/static/entry/download/1cbs.header', downloadable: true },
      { name: 'PDB file (gz)', url: 'https://ftp.ebi.ac.uk/pub/databases/rcsb/pdb-remediated/data/structures/divided/pdb/cb/pdb1cbs.ent.gz', downloadable: true },
      { name: 'PDBML', url: 'https://www.ebi.ac.uk/pdbe/entry-files/download/1cbs.xml', downloadable: true },
      { name: 'PDBML (ATOM lines)', url: 'https://www.ebi.ac.uk/pdbe/entry-files/download/1cbs-extatom.xml', downloadable: true },
      { name: 'PDBML (no atoms)', url: 'https://www.ebi.ac.uk/pdbe/entry-files/download/1cbs-noatom.xml', downloadable: true },
      { name: 'Assembly composition XML', url: 'https://www.ebi.ac.uk/pdbe/static/entry/download/1cbs-assembly.xml', downloadable: true },
      { name: 'Assembly 1 (atom only; mmCIF)', url: 'https://www.ebi.ac.uk/pdbe/static/entry/download/1cbs-assembly-1_atom_site.cif.gz', downloadable: true },
      { name: 'Summary report (PDF)', url: 'https://www.ebi.ac.uk/pdbe/entry-files/download/1cbs_validation.pdf', downloadable: true },
      { name: 'Percentile plot (PNG)', url: 'https://www.ebi.ac.uk/pdbe/entry-files/download/1cbs_multipercentile_validation.png', downloadable: true },
      { name: 'Percentile plot (SVG)', url: 'https://www.ebi.ac.uk/pdbe/entry-files/download/1cbs_multipercentile_validation.svg', downloadable: true },
    ],
    optionsWidth: '296px',
    optionsMaxHeight: '336px',
  },
  argTypes: actionArgs,
  name: 'PDBe download dropdown',
};
