const path = require('path');

const config = {
  staticDirs: [{ from: '../../../shared_assets/images/', to: '/assets/images' }],
  stories: ['../../vf/**/src/lib/**/*.@(mdx|stories.@(js|jsx|ts|tsx))', '../../pdbe/**/src/lib/**/*.@(mdx|stories.@(js|jsx|ts|tsx))'],

  addons: [
    {
      name: path.dirname(require.resolve('@storybook/addon-docs/package.json')),
      options: { transcludeMarkdown: true },
    },
    { name: '@storybook/addon-essentials', options: { docs: false } },
  ],

  // webpackFinal: async (config, { configType }) => {
  //   config.module?.rules?.push({
  //     test: /\.tsx?$/,
  //     use: 'ts-loader',
  //     exclude: /node_modules(?!\/@amplio)/,
  //   })
  // }
  framework: {
    name: '@storybook/angular',
    options: {},
  },

  docs: {
    autodocs: true,
  },
};

export default config;

// To customize your webpack configuration you can use the webpackFinal field.
// Check https://storybook.js.org/docs/react/builders/webpack#extending-storybooks-webpack-config
// and https://nx.dev/packages/storybook/documents/custom-builder-configs
