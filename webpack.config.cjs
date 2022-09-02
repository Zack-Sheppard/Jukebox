
const path = require("path");

module.exports = {
  entry: {
    "home": "./webapp/src/home.jsx"
  },
  mode: "development",
  output: {
    filename: "[name].bundle.js",
    path: path.resolve(__dirname + "/webapp/public", "dist"),
  },
  resolve: {
    extensions: [".jsx", ".js"]
  },
  module: {
    rules: [{ test: /\.jsx?$/, loader: "babel-loader"}]
  }
};
