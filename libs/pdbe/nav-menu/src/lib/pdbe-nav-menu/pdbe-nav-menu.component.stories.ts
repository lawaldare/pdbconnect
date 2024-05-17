import { Meta } from '@storybook/angular';
import { PdbeNavMenuComponent } from './pdbe-nav-menu.component';

const actionArgs = {
  highlightColor: {
    control: { type: 'color' },
    description: 'Menu hover highlight color',
  },
  navSections: {
    description: 'List of navigation sections',
  },
};

export default {
  title: 'PDBe Components/Navigation Menu',
  component: PdbeNavMenuComponent,
  tags: ['autodocs'],
  parameters: {
    viewport: {
      defaultViewport: 'size_1440',
    },
  },
} as Meta<PdbeNavMenuComponent>;

export const Story1 = {
  render: (args: PdbeNavMenuComponent) => ({
    props: args,
  }),
  args: {
    highlightColor: '#D0DEBB',
    navSections: [
      { sectionId: 'summary', isSubSection: false, sectionName: 'Summary' },
      { sectionId: 'funcbio', isSubSection: false, sectionName: 'Function and Biology' },
      { sectionId: 'famdom', isSubSection: false, sectionName: 'Family and Domains' },
      { sectionId: 'macromol', isSubSection: false, sectionName: 'Macromolecules' },
      { sectionId: 'ligenvs', isSubSection: false, sectionName: 'Ligands and Environments' },
      { sectionId: 'assemb', isSubSection: false, sectionName: 'Assemblies' },
      { sectionId: 'expvals', isSubSection: false, sectionName: 'Experiments and Validation' },
      { sectionId: 'citations', isSubSection: false, sectionName: 'Citations' },
    ],
  },
  argTypes: actionArgs,
  name: 'PDBe Navigation menu',
};

export const Story2 = {
  render: (args: PdbeNavMenuComponent) => ({
    props: args,
  }),
  args: {
    highlightColor: '#B6D0CF',
    navSections: [
      { sectionId: 'description', isSubSection: false, sectionName: 'Description' },
      { sectionId: 'physicochemical', isSubSection: false, sectionName: 'Physicochemical properties' },
      { sectionId: 'structures', isSubSection: false, sectionName: 'Structures' },
      { sectionId: 'interactions', isSubSection: false, sectionName: 'Interaction statistics' },
      { sectionId: 'related', isSubSection: false, sectionName: 'Related ligands' },
      { sectionId: 'scaffolds', isSubSection: true, sectionName: 'Same scaffolds' },
      { sectionId: 'similarligs', isSubSection: true, sectionName: 'Similar ligands' },
      { sectionId: 'stereoisomers', isSubSection: true, sectionName: 'Stereoisomers' },
      { sectionId: 'liganddbs', isSubSection: false, sectionName: 'Ligand-specific databases' },
    ],
  },
  argTypes: actionArgs,
  name: 'PDBe-KB Ligands Navigation menu',
};
