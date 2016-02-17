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
  devtool: 'inline-source-map',

  entry: getEntrypoints(),

  output: {
    filename: '[name].js',
    chunkFilename: '[id].chunk.js',
    path: path.join(__dirname, 'build'),
    publicPath: '../build/'
  },
  module: {
    loaders: [
      {test: /\.css$/, loader: 'style-loader!css-loader'},
      {
        test: /\.jsx?$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
        query: {
          presets: ['react', 'es2015', 'stage-2'],
          plugins: ['transform-runtime']
        }
      }
    ]
  }
};
