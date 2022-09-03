
const path = require("path");

module.exports = {
  entry: {
    "home": "./webapp/src/home.tsx"
  },
  mode: "development",
  output: {
    filename: "[name].bundle.js",
    path: path.resolve(__dirname + "/webapp/public", "dist"),
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
  },
  module: {
    rules: [
      { test: /\.jsx?$/, loader: "babel-loader"},
      { test: /\.tsx?$/, use: 'ts-loader', exclude: /node_modules/,}
    ]
  }
};
