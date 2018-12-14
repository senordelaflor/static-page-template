const { resolve } = require("path")
const MiniCssExtractPlugin = require("mini-css-extract-plugin")
const HtmlWebpackPlugin = require("html-webpack-plugin")
const WebpackNotifierPlugin = require("webpack-notifier")
const { getIfUtils, removeEmpty } = require("webpack-config-utils")

module.exports = env => {
  const { ifProd } = getIfUtils(env)
  const config = {
    entry: ["./js/template.js", "./sass/template.scss"],
    output: {
      filename: "template.js",
      path: resolve(__dirname, "dist"),
    },
    devServer: {
      historyApiFallback: true,
    },
    mode: ifProd("production", "development"),
    stats: {
      colors: true,
      reasons: true,
      chunks: true,
    },
    resolve: {
      extensions: [".js", ".jsx", ".json"],
    },
    devtool: ifProd("source-map", "eval"),
    plugins: removeEmpty([
      new MiniCssExtractPlugin({
        filename: "template.css",
      }),
      new HtmlWebpackPlugin({
        template: "./index.html",
        filename: "./index.html",
        inject: true,
      }),
      new WebpackNotifierPlugin(),
    ]),
    module: {
      rules: [
        {
          test: /\.scss$/,
          use: [
            ifProd(MiniCssExtractPlugin.loader, "style-loader"),
            "css-loader",
            "postcss-loader",
            "sass-loader",
          ],
        },
        {
          test: /\.js|jsx$/,
          exclude: /(node_modules)/,
          use: {
            loader: "babel-loader",
          },
        },
      ],
    },
  }
  return config
}
