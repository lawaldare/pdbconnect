import { Meta } from '@storybook/angular';
import { PdbeLinkButtonComponent } from './pdbe-link-button.component';

const actionArgs = {
  label: {
    control: { type: 'text' },
    description: 'Link Button label',
  },
  url: {
    control: { type: 'text' },
    description: 'Link Button url (optional)',
  },
  fontStyle: {
    control: { type: 'select' },
    description: 'Font style of Link Button',
    options: ['Paragraph 2 (19px)', 'Paragraph 3 (16px)'],
  },
  toEmitOnClick: {
    control: { type: 'text' },
    description: '(Output) string to send to parent component on click',
  },
};

export default {
  title: 'PDBe Components/PDBe Link Button',
  component: PdbeLinkButtonComponent,
  tags: ['autodocs'],
  parameters: { backgrounds: { default: 'dark' } },
} as Meta<PdbeLinkButtonComponent>;

export const Story1 = {
  render: (args: PdbeLinkButtonComponent) => ({
    props: args,
  }),
  args: {
    label: 'Link btn lbl',
    fontStyle: 'Paragraph 2 (19px)',
  },
  argTypes: actionArgs,
  name: 'Paragraph 2 Link Button',
};

export const Story2 = {
  render: (args: PdbeLinkButtonComponent) => ({
    props: args,
  }),
  args: {
    label: 'Link btn lbl',
    fontStyle: 'Paragraph 3 (16px)',
  },
  argTypes: actionArgs,
  name: 'Paragraph 3 Link Button',
};

export const Story3 = {
  render: (args: PdbeLinkButtonComponent) => ({
    props: args,
  }),
  args: {
    label: 'Go to PDBe',
    fontStyle: 'Paragraph 2 (19px)',
    url: 'https://www.ebi.ac.uk/pdbe/',
  },
  argTypes: actionArgs,
  name: 'Send to PDBe Paragraph 2 Link Button',
};
