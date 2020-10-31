const { merge } = require('webpack-merge');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const Dotenv = require('dotenv-webpack');
const path = require('path');
const common = require('./webpack.common.js');

module.exports = (env) => {
  const commonConfig = common(env);

  return merge(commonConfig, {
    devtool: 'source-map',
    plugins: [
      ...commonConfig.plugins,
      new CopyWebpackPlugin({
        patterns: [
          { from: 'icon16.png', to: 'icon16.png' },
          { from: 'icon48.png', to: 'icon48.png' },
          { from: 'icon128.png', to: 'icon128.png' },
          { from: 'content.js', to: 'content.js' },
          { from: 'staging.manifest.json', to: 'manifest.json' },
        ],
      }),
      new Dotenv({
        path: path.resolve(__dirname, './.env.staging'),
        defaults: true,
      }),
    ],
  });
};
