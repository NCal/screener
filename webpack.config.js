var path = require('path');
var webpack = require('webpack');
var CaseSensitivePathsPlugin = require('case-sensitive-paths-webpack-plugin');

module.exports = {
  plugins: [
    new CaseSensitivePathsPlugin({debug: true})
    // other plugins ...
  ],
  entry: './client/index.js',
  output: {
    path: path.join(__dirname, 'client'),
    filename: 'bundle.js'
  },
  module: {
    loaders: [
    {
      test: /.jsx?$/,
      loader: 'babel-loader',
      exclude: /node_modules/,
      query: {
        presets: [ "es2015", "react", "stage-0"]
      }
    }, 
    {
      test: /\.scss$/,
      loader: 'style-loader!css-loader!sass-loader?sourceMap'
    },]
  }
};
