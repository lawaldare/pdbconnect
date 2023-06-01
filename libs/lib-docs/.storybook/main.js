const path = require('path');

const config = {
  stories: ['../../vf/**/src/lib/**/*.stories.@(js|jsx|ts|tsx|mdx)', '../../pdbe/**/src/lib/**/*.stories.@(js|jsx|ts|tsx|mdx)'],
  addons: [
    {
      name: path.dirname(require.resolve('@storybook/addon-docs/package.json')),
      options: { transcludeMarkdown: true },
    },
    { name: '@storybook/addon-essentials', options: { docs: false } },
  ],
  framework: {
    name: '@storybook/angular',
    options: {},
  },
};

export default config;

// To customize your webpack configuration you can use the webpackFinal field.
// Check https://storybook.js.org/docs/react/builders/webpack#extending-storybooks-webpack-config
// and https://nx.dev/packages/storybook/documents/custom-builder-configs
