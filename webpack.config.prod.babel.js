import path from 'path';
import webpack from 'webpack';

export default {
  devtool: 'source-map',
  entry: [
    './examples/index',
  ],
  output: {
    path: path.join(__dirname, 'build'),
    filename: 'examples_bundle.js',
    publicPath: '/static/',
  },
  plugins: [
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify('production'),
      },
    }),
    new webpack.optimize.UglifyJsPlugin({
      compressor: {
        warnings: false,
      },
    }),
  ],
  module: {
    loaders: [{
      test: /\.js$/,
      loaders: ['babel'],
      include: [
        path.join(__dirname, 'examples'),
        path.join(__dirname, 'lib'),
      ],
    }],
  },
};
