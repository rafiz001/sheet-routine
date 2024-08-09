const HtmlWebPackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const path = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = {
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader"
        }
      },
       {
        test: /\.css$/,
        use: [
          MiniCssExtractPlugin.loader,
          "css-loader", "postcss-loader",
          ],
      },
    ]
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: "styles.[contenthash].css",
      chunkFilename: "styles.css"
    }),
    new HtmlWebPackPlugin({
    template: "./src/index.html",
    filename: "./index.html"
  }),
  new CleanWebpackPlugin(),
  
],
output: {
  path: path.resolve(__dirname, 'docs'), 
  filename: 'bundle.[contenthash].js' 
}
};