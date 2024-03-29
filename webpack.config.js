const path = require('path');
module.exports = {
  mode: 'development',
  entry: path.join(__dirname, 'src', 'app'),
  watch: true,
  output: {
    path: path.join(__dirname, 'dist'),
    publicPath: '/dist/',
    filename: "bundle.js",
    chunkFilename: '[name].js'
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
  devtool: 'inline-source-map',
  // devServer: {
  //   contentBase: path.join(__dirname, '/dist/'),
  //   inline: true,
  //   host: 'localhost',
  //   port: 8080,
  // }
};