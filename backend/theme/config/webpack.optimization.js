const TerserPlugin = require('terser-webpack-plugin');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');

const optimization = {
  minimize: true,
  minimizer: [
    new TerserPlugin({
      extractComments: false,
      terserOptions: {
        warnings: false,
        ie8: false,
      },
    }),
    new OptimizeCssAssetsPlugin({
      cssProcessorPluginOptions: {
        preset: ['default', {discardComments: {removeAll: true}}],
      },
    }),
  ],
};

module.exports = optimization;
