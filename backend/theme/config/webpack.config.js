const path = require('path');
const config = require('./site.config');
const rules = require('./webpack.loaders');
const plugins = require('./webpack.plugins');
const optimization = require('./webpack.optimization');

module.exports = {
  context: path.join(config.root, config.paths.src),
  entry: './index.js',
  output: {
    path: path.join(config.root, config.paths.dist),
    filename: '[name].js',
  },
  mode: ['production', 'development'].includes(config.env) ? config.env : 'development',
  devtool: config.env === 'production' ? 'hidden-source-map' : 'cheap-eval-source-map',
  devServer: {
    writeToDisk: true,
    contentBase: path.join(config.root, config.paths.dist),
    watchContentBase: true,
    open: false,
    port: config.port,
    host: config.devHost,
    hot: false,
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
  },
  module: {rules},
  plugins,
  optimization,
  performance: {hints: false},
};
