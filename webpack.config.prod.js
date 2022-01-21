const path = require('path');
const CleanPlugin = require('clean-webpack-plugin');

module.exports = {
  mode: 'production',
  entry: path.join(__dirname, 'src', 'app'),
  watch: true,
  output: {
    path: path.join(__dirname, 'dist'),
    filename: "bundle.js",
  },
  module: {
    rules: [{
      test: /\.ts$/,
      use: 'ts-loader',
      include: [
        path.resolve(__dirname, 'src')
      ],
      exclude: [
        path.resolve(__dirname, 'node_modules')
      ],
      //loader: 'babel-loader',
      // query: {
      //   presets: [
      //     ["@babel/env", {
      //       "targets": {
      //         "browsers": "last 2 chrome versions"
      //       }
      //     }] 
      //   ]
      // }
    }]
  },
  resolve: {
    extensions: ['.json', '.js', '.ts']
  },
  devtool: 'hidden-source-map',
  plugins: [
    new CleanPlugin.CleanWebpackPlugin()
  ]
  // devServer: {
  //   contentBase: path.join(__dirname, '/dist/'),
  //   inline: true,
  //   host: 'localhost',
  //   port: 8080,
  // }
};