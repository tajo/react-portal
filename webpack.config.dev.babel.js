import path from 'path';
import webpack from 'webpack';

export default {
  devtool: 'cheap-module-eval-source-map',
  entry: [
    'webpack-hot-middleware/client',
    './examples/index.jsx',
  ],
  output: {
    path: path.join(__dirname, 'build'),
    filename: 'examples_bundle.js',
    publicPath: '/static/',
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin(),
  ],
  module: {
    loaders: [{
      test: /\.jsx|\.js$/,
      loaders: ['babel'],
      include: [
        path.join(__dirname, 'examples'),
        path.join(__dirname, 'lib'),
      ],
    }],
  },
  resolve: {
    extensions: ['', '.js', '.jsx'],
  },
};
