
const path = require("path");

module.exports = {
  entry: {
    "home": "./src/home.tsx",
    "host": "./src/host.tsx",
    "hbd": "./src/hbd.tsx"
  },
  mode: "development",
  output: {
    filename: "[name].bundle.js",
    path: path.resolve(__dirname + "/public", "dist"),
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
  },
  module: {
    rules: [
      { test: /\.tsx?$/, use: 'ts-loader', exclude: /node_modules/, }
    ]
  }
};
