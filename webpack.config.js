const webpack = require('webpack');
const path = require('path');

module.exports = {
  entry: './lib/gqlTest.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'gqlTest.min.js',
    libraryTarget: 'umd',
    library: 'gqlTest',
  },
  module: {
    rules: [
      {
        test: /\.(js)$/,
        use: 'babel-loader',
      },
    ],
  },
};
