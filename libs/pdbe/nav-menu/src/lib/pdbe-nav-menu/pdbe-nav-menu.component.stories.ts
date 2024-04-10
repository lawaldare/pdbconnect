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
      { sectionName: 'Summary', subsections: [] },
      { sectionName: 'Function and Biology', subsections: [] },
      { sectionName: 'Family and Domains', subsections: [] },
      { sectionName: 'Macromolecules', subsections: [] },
      { sectionName: 'Ligands and Environments', subsections: [] },
      { sectionName: 'Assemblies', subsections: [] },
      { sectionName: 'Experiments and Validation', subsections: [] },
      { sectionName: 'Citations', subsections: [] },
    ],
    isFirstActivated: true,
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
      { sectionName: 'Description', subsections: [] },
      { sectionName: 'Physicochemical properties', subsections: [] },
      { sectionName: 'Structures', subsections: [] },
      { sectionName: 'Interaction statistics', subsections: [] },
      { sectionName: 'Related ligands', subsections: [{ sectionName: 'Same scaffolds' }, { sectionName: 'Similar ligands' }, { sectionName: 'Stereoisomers' }] },
      { sectionName: 'Ligand-specific databases', subsections: [] },
    ],
    isFirstActivated: true,
  },
  argTypes: actionArgs,
  name: 'PDBe-KB Ligands Navigation menu',
};
