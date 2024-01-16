const webpack = require('webpack');
const path = require('path'); 
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: './index.web.js',
  module: {
    rules: [
      {
        test: /\.(js|jsx|ts|tsx)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
        },
      },
    ],
  },
  resolve: {
    extensions: [
      '.web.tsx', '.web.ts', '.web.jsx', '.web.js', 
      '.native.tsx', '.native.ts', '.native.jsx', '.native.js', 
      '.tsx', '.ts', '.jsx', '.js', '.json'
    ],
    alias: {
      'react-native$': 'react-native-web',
    },
  },
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist/web'),
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './index.html',
    }),
    new webpack.NormalModuleReplacementPlugin(
      /react-native-fs/,
      path.resolve(__dirname, 'mocks/react-native-fs-mock.js')
    ),
    new webpack.NormalModuleReplacementPlugin(
      /react-native-sound/,
      path.resolve(__dirname, 'mocks/react-native-sound-mock.js')
    ),
  ],
};
