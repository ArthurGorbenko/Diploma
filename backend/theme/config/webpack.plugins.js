// const glob = require('glob');
const path = require('path');
const fs = require('fs');
// const webpack = require('webpack');
const WebpackBar = require('webpackbar');
// const {CleanWebpackPlugin} = require('clean-webpack-plugin');
// const HTMLWebpackPlugin = require('html-webpack-plugin');
const FaviconWebpackPlugin = require('favicons-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const ReplaceInFilePlugin = require('replace-in-file-webpack-plugin');
const config = require('./site.config');

// const hmr = new webpack.HotModuleReplacementPlugin();

// const clean = new CleanWebpackPlugin();

const cssExtract = new MiniCssExtractPlugin({
  filename: '[name].css',
});

// HTML generation
// const generateHTMLPlugins = () =>
//   glob.sync('./src/pages/**/*.html').map(dir => {
//     const filename = path.basename(dir);

//     return new HTMLWebpackPlugin({
//       filename,
//       template: path.join(config.root, config.paths.src, '/pages', filename),
//       title: config.siteName,
//       minify: false,
//     });
//   });

const favicons = new FaviconWebpackPlugin({
  logo: config.favicon,
  prefix: 'medias/favicons/',
  favicons: {
    appName: config.siteName,
    appDescription: config.siteDescription,
    developerName: null,
    developerURL: null,
    background: config.backgroundColor,
    theme_color: config.themeColor,
    start_url: '/',
    dir: 'ltr',
    lang: 'fr-FR',
    icons: {
      android: true,
      appleIcon: true,
      appleStartup: false,
      coast: false,
      favicons: true,
      firefox: false,
      windows: false,
      yandex: false,
    },
  },
});

const webpackBar = new WebpackBar({
  color: '#ff6469',
});
/*
// Google analytics
const CODE = `<script>(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){(i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)})(window,document,'script','//www.google-analytics.com/analytics.js','ga');ga('create','{{ID}}','auto');ga('send','pageview');</script>`;

class GoogleAnalyticsPlugin {
  constructor({id}) {
    this.id = id;
  }

  apply(compiler) {
    compiler.hooks.compilation.tap('GoogleAnalyticsPlugin', compilation => {
      HTMLWebpackPlugin.getHooks(compilation).beforeEmit.tapAsync(
        'GoogleAnalyticsPlugin',
        (data, cb) => {
          data.html = data.html.replace(
            '</head>',
            `${CODE.replace('{{ID}}', this.id)}</head>`,
          );
          cb(null, data);
        },
      );
    });
  }
}

const google = new GoogleAnalyticsPlugin({
  id: config.googleAnalyticsUA,
});
*/
module.exports = [
  new ReplaceInFilePlugin([
    {
      dir: path.join(config.root, '../templates'),
      files: ['base.html.twig'],
      rules: [
        {
          search: /version\s=\s'\d*'/g,
          replace: `version = '${Date.now()}'`,
        },
      ],
    },
  ]),
  // new webpack.ProvidePlugin({
  //   $: 'jquery',
  //   jQuery: 'jquery',
  // }),
  // clean,
  cssExtract,
  // ...generateHTMLPlugins(),
  fs.existsSync(config.favicon) && favicons,
  // config.googleAnalyticsUA && google,
  webpackBar,
  // config.env === 'development' && hmr,
  new CopyWebpackPlugin([
    {
      from: path.join(config.root, config.paths.src, '/assets/medias'),
      to: path.join(config.root, config.paths.dist, '/medias'),
      ignore: ['favicon-source.png', '*.html', '.gitkeep'],
    },
  ]),
].filter(Boolean);
