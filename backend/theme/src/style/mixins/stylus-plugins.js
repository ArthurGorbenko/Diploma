const {relative, join} = require('path');
const {utils} = require('stylus');

// TODO get Stylus global vars in helper functions

module.exports = () => style => {
  style.define('file-exists', function (path) {
    return typeof utils.lookup(path.string, this.paths) !== 'undefined';
  });

  style.define('path-local', function (assets, path) {
    return join('..', assets.string, path.string);
  });

  style.define('path-theme', function (assets, path) {
    return join('/dist/', relative(assets.string, join(assets.string, path.string)));
  });
};
