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
  externalLink: {
    control: { type: 'boolean' },
    description: 'Whether link is internal (routerLink) or external (href)',
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
  fontColor: {
    control: { type: 'color' },
    description: 'Link Button font color',
  },
  hoverColor: {
    control: { type: 'color' },
    description: 'Link Button (on hover) font color',
  },
  visitedColor: {
    control: { type: 'color' },
    description: 'Link Button (on visited) font color',
  },
  focusBorderColor: {
    control: { type: 'color' },
    description: 'Link Button (on focus) border color',
  },
  activeFontWeight: {
    control: { type: 'radio' },
    description: 'Link Button (on active) font weight',
    options: [400, 500, 600],
  },
  mobileIconName: {
    control: { type: 'radio' },
    description: 'Link Button icon',
    options: ['none', 'link'],
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
    externalLink: true,
    label: 'Go to PDBe',
    fontStyle: 'Paragraph 2 (19px)',
    url: 'https://www.ebi.ac.uk/pdbe/',
    fontColor: '#ffffff',
    hoverColor: '#ffffff',
    visitedColor: '#ffffff',
    activeFontWeight: 600,
  },
  argTypes: actionArgs,
  name: 'Send to PDBe Link Button',
};

export const Story2 = {
  render: (args: PdbeLinkButtonComponent) => ({
    props: args,
  }),
  args: {
    externalLink: false,
    label: 'Link btn lbl',
    fontStyle: 'Paragraph 2 (19px)',
    fontColor: '#ffffff',
    hoverColor: '#ffffff',
    visitedColor: '#ffffff',
    activeFontWeight: 600,
  },
  argTypes: actionArgs,
  name: 'Paragraph 2 Link Button',
};

export const Story3 = {
  render: (args: PdbeLinkButtonComponent) => ({
    props: args,
  }),
  args: {
    externalLink: false,
    label: 'Link btn lbl',
    fontStyle: 'Paragraph 3 (16px)',
    fontColor: '#ffffff',
    hoverColor: '#ffffff',
    visitedColor: '#ffffff',
    activeFontWeight: 600,
  },
  argTypes: actionArgs,
  name: 'Paragraph 3 Link Button',
};

export const Story4 = {
  render: (args: PdbeLinkButtonComponent) => ({
    props: args,
  }),
  args: {
    externalLink: true,
    label: 'Go to PDBe',
    fontStyle: 'Paragraph 2 (19px)',
    url: 'https://www.ebi.ac.uk/pdbe/',
    fontColor: '#3B6FB6',
    hoverColor: '#193F90',
    visitedColor: '#563D82',
    focusBorderColor: '#3B6FB6',
    activeFontWeight: 300,
    mobileIconName: 'link',
  },
  parameters: {
    backgrounds: { default: 'light' },
  },
  argTypes: actionArgs,
  name: 'Send to PDBe blue Link Button with icon',
};
