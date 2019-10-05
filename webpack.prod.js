const merge = require('webpack-merge');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const Dotenv = require('dotenv-webpack');
const common = require('./webpack.common.js');

module.exports = (env) => {
  const commonConfig = common(env);

  return merge(commonConfig, {
    mode: 'production',
    optimization: {
      ...commonConfig.optimization,
      runtimeChunk: 'single',
      splitChunks: {
        chunks: 'all',
        maxInitialRequests: Infinity,
        minSize: 0,
        cacheGroups: {
          vendor: {
            test: /[\\/]node_modules[\\/]/,
          },
          styles: {
            name: 'styles',
            test: /\.scss$/,
            chunks: 'all',
            enforce: true,
          },
        },
      },
    },
    plugins: [
      ...commonConfig.plugins,
      new CopyWebpackPlugin([
        { from: 'icon16.png', to: 'icon16.png' },
        { from: 'icon48.png', to: 'icon48.png' },
        { from: 'icon128.png', to: 'icon128.png' },
        { from: 'favicon.ico', to: 'favicon.ico' },
        { from: 'content.js', to: 'content.js' },
        { from: 'manifest.json', to: 'manifest.json' },
      ]),
      new Dotenv({
        path: './.env.prod',
      }),
    ],
  });
};
