const config = require('./site.config');

module.exports = {
  plugins: [
    /*require('postcss-normalize')({
      // import normalize.css based on browsers version
      // browsers param handled in .browserslistrc file
      forceImport: true,
    }),*/
    require('postcss-initial')({
      reset: 'inherited',
      replace: true,
    }),
    require('postcss-color-short'),
    require('postcss-assets'),
    require('postcss-short'),
    require('postcss-default-unit')({
      unit: 'px',
      ignore: {
        animation: true,
        'animation-iteration-count': true,
        content: true,
        '-ms-flex-order': true,
        transition: true,
      },
    }),
    require('postcss-pxtorem')({
      rootValue: config.style['rem-root-value'] || 1,
      propList: ['*'],
      selectorBlackList: [/^html(|\.device-.*)$/i], // exclude html (and html.device-, .device-...)
      minPixelValue: 2, // avoid 1px border to disappear at lower scales
    }),
    require('postcss-position-alt'),
    require('postcss-size'),
    require('postcss-axis'),
    require('postcss-font-weights'),
    // require('postcss-quantity-queries'),
    require('postcss-font-magician')({
      formats: 'woff2', // 'eot ttf svg' aren't necessary anymore
      foundries: ['google'],
      display: 'fallback',
    }),
    /*require('autoprefixer')({
      cascade: false,
    }),*/
  ],
};
