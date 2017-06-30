const {resolve} = require('path')
const webpack = require('webpack')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const WebpackNotifierPlugin = require('webpack-notifier')
const {getIfUtils, removeEmpty} = require('webpack-config-utils')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const HtmlWebpackInlineSourcePlugin = require('html-webpack-inline-source-plugin')

module.exports = env => {
  const {ifProd, ifNotProd} = getIfUtils(env)
  const config = {
    entry: ['./js/template.js', './sass/template.scss'],
    output: {
      filename: 'template.js',
      path: resolve(__dirname, 'dist')
    },
    stats: {
      colors: true,
      reasons: true,
      chunks: true
    },
    devtool: ifProd('source-map', 'eval'),
    plugins: removeEmpty([
      new ExtractTextPlugin({
        filename: 'template.css',
        disable: ifProd(false, true)
      }),
      new HtmlWebpackPlugin({
        template: './index.html',
        minify: {collapseWhitespace: true},
        inject: true,
      }),
      new WebpackNotifierPlugin(),
      new CopyWebpackPlugin([
        {from: 'img', to: 'img'},
      ])
    ]),
    module: {
      loaders: [
        {
          test: /\.js$/,
          exclude: /(node_modules|bower_components)/,
          use: {
            loader: 'babel-loader'
          }
        },
        removeEmpty({
          test: /\.scss$/,
          use: ifProd(ExtractTextPlugin.extract(
            {
              use: ['css-loader', 'sass-loader']
            })),
          loaders: ifNotProd([
            {loader: 'style-loader'},
            {
              loader: 'css-loader', options: {
                sourceMap: true
              }
            },
            {
              loader: 'sass-loader', options: {
                sourceMap: true
              }
            }
          ])
        }),
        {
          test: /\.(png|jpg|woff|woff2|eot|ttf|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
          loader: 'url-loader'
        }
      ]
    }
  }
  return config
}
