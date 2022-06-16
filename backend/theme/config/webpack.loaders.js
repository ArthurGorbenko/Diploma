const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const rupture = require('rupture');
const config = require('./site.config');
const postcssConfig = require('./postcss.config.js');
const babelConfig = require('./babel.config.js');

const html = {
  test: /\.html$/,
  include: [
    path.join(__dirname, '../src/partials'),
    // path.join(__dirname, '../src/assets/medias/category'),
  ],
  use: [
    {
      loader: 'html-loader',
      options: {
        interpolate: true,
      },
    },
  ],
};

const js = {
  test: /\.js$/,
  exclude: /(node_modules)/,
  use: [
    config.env !== 'development'
      ? {
          loader: 'webpack-strip-block',
          options: {
            start: '@debug',
            end: '@enddebug',
          },
        }
      : null,
    {
      loader: 'babel-loader',
      options: babelConfig,
    },
    /*    {
      loader: 'eslint-loader',
      options: {
        configFile: `${config.paths.config}/eslint.config.js`,
      },
    },*/
  ].filter(Boolean),
};

const css = {
  test: /\.css$/,
  use: [MiniCssExtractPlugin.loader, 'css-loader'],
};

const styl = {
  test: /\.styl$/,
  use: [
    MiniCssExtractPlugin.loader,
    {loader: 'css-loader', options: {importLoaders: 2, url: false}},
    {loader: 'postcss-loader', options: postcssConfig},
    {
      loader: 'stylus-loader',
      options: {
        define: {
          '$rem-root-value': config.style['rem-root-value'] || 1,
          '$theme-absolute-path': '',
          '$default-assets-path': config.style['default-assets-path'],
          '$default-fonts-path': config.style['default-fonts-path'],
          '$default-medias-path': config.style['default-medias-path'],
        },
        use: [rupture()],
      },
    },
  ],
};

const imageLoader = {
  loader: 'image-webpack-loader',
  options: {
    bypassOnDebug: true,
    gifsicle: {
      interlaced: false,
    },
    optipng: {
      optimizationLevel: 7,
    },
    pngquant: {
      quality: '65-90',
      speed: 4,
    },
    mozjpeg: {
      progressive: true,
    },
  },
};

const images = {
  test: /\.(gif|png|jpe?g|svg)$/i,
  exclude: /fonts/,
  use: ['file-loader?name=images/[name].[hash].[ext]', config.env !== 'development' ? imageLoader : null].filter(
    Boolean,
  ),
};

const fonts = {
  test: /\.(woff|woff2)$/,
  exclude: '/assets/medias/',
  use: [
    {
      loader: 'file-loader',
      query: {
        name: '[name].[ext]',
        outputPath: 'medias/fonts/',
      },
    },
  ],
};

const videos = {
  test: /\.(mp4|webm)$/,
  use: [
    {
      loader: 'file-loader',
      query: {
        name: '[name].[hash].[ext]',
        outputPath: 'images/',
      },
    },
  ],
};

module.exports = [html, js, styl, css, images, fonts, videos];
