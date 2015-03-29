var ExtractTextPlugin = require('extract-text-webpack-plugin');

var path = require('path');

module.exports = {
  entry: './src/index.js',

  output: {
    filename: 'index.js',
    path: path.join(__dirname, 'lib'),
    library: 'react-pick',
    libraryTarget: 'commonjs2'
  },

  target: 'node',

  module: {
    loaders: [
      {test: /\.js$/, loader: 'babel-loader?experimental=true'},
      {test: /\.css$/, loader: ExtractTextPlugin.extract('style-loader', 'css-loader')}
    ]
  },

  plugins: [
    new ExtractTextPlugin('styles.css')
  ]
};
