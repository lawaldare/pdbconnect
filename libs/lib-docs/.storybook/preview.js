import '!style-loader!css-loader!sass-loader!./scss-loader.scss';

import { INITIAL_VIEWPORTS, MINIMAL_VIEWPORTS } from '@storybook/addon-viewport';

const customViewports = {
  size_1440: {
    name: 'Size 1440px',
    styles: {
      width: '1440px',
      height: '1024px',
    },
  },
  size_1024: {
    name: 'Size 1024px',
    styles: {
      width: '1024px',
      height: '1024px',
    },
  },
  size_768: {
    name: 'Size 768px',
    styles: {
      width: '768px',
      height: '1024px',
    },
  },
  size_540: {
    name: 'Size 540px',
    styles: {
      width: '540px',
      height: '1024px',
    },
  },
  size_375: {
    name: 'Size 375px',
    styles: {
      width: '375px',
      height: '1024px',
    },
  },
};

export const parameters = {
  options: {
    storySort: {
      order: ['PDBe Components', 'Visual Framework'],
    },
  },
  viewport: {
    viewports: {
      ...customViewports,
      ...INITIAL_VIEWPORTS,
      ...MINIMAL_VIEWPORTS,
    },
    defaultViewport: 'size_1440',
  }
};
