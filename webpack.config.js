var path = require('path');
var fs = require('fs');

function getEntrypoints() {
  return fs.readdirSync(__dirname)
    .filter(function(dir) { 
      return (
        dir !== 'build' && 
        fs.lstatSync(path.join(__dirname, dir)).isDirectory()
      ); 
    })
    .reduce(function(entries, dir) {
      entries[dir] = path.join(__dirname, dir, 'index.js');
      return entries;
    }, {});
}

module.exports = {
  entry: getEntrypoints(),

  output: {
    filename: '[name].js',
    chunkFilename: '[id].chunk.js',
    path: path.join(__dirname, 'build'),
    publicPath: '../build/'
  },

  module: {
    loaders: [
      {test: /\.js$/, loader: 'babel-loader?experimental=true'},
      {test: /\.css$/, loader: 'style-loader!css-loader'}
    ]
  }
};
