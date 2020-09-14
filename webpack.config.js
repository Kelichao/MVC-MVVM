const resolve = require('path').resolve
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const url = require('url')
const { Console } = require('console')
const publicPath = ''

var time = new Date();
var fileName = (time.getMonth() + 1)  + "-" +  time.getDate() + "_" + time.getHours() + "." + time.getMinutes()

console.log(process.env.NODE_ENV)  // development

module.exports = (options = {}) => ({

  entry: {
    vendor: './src/vendor',
    index: './src/main.js',
    env: "./src/env.js"
  },
  output: {
    path: resolve(__dirname, `dist/` + process.env.NODE_ENV +"_" + fileName),
    filename: options.dev ? '[name].js' : '[name].js?[chunkhash]',
    chunkFilename: '[id].js?[chunkhash]',
    publicPath: options.dev ? '/assets/' : publicPath
  },
  module: {
    rules: [{
      test: /\.vue$/,
      use: ['vue-loader']
    },
    {
      test: /\.js$/,
      use: ['babel-loader'],
      exclude: /node_modules/
    },
    {
      test: /\.css$/,
      use: ['style-loader', 'css-loader', 'postcss-loader']
    },

    {

      test: /\.less$/,

      loader: "style-loader!css-loader!less-loader",

    },
    {
      test: /\.(png|jpg|jpeg|gif|eot|ttf|woff|woff2|svg|svgz)(\?.+)?$/,
      use: [{
        loader: 'url-loader',
        options: {
          limit: 10000
        }
      }]
    }
    ]
  },
  plugins: [
    new webpack.optimize.CommonsChunkPlugin({
      names: ['vendor', 'manifest',"env"]
    }),
    new HtmlWebpackPlugin({
      template: 'src/index.html',
      favicon: resolve('src/assets/favicon.ico'),
    }),
    new webpack.DefinePlugin({
      'process.env': {
        aaa: 123,
        NODE_ENV: JSON.stringify(process.env.NODE_ENV),
        TYPE: JSON.stringify(process.env.NODE_ENV),
        // config: JSON.stringify(config)
      }
    }),
  ],
  resolve: {
    alias: {
      '~': resolve(__dirname, 'src')
    },
    extensions: ['.js', '.vue', '.json', '.css']
  },
  devServer: {
    // host: '127.0.0.1',
    port: 8010,
    disableHostCheck: true,
    public: "localhost:8010",
    host: '0.0.0.0',
    proxy: {
      '/api/': {
        target: 'http://127.0.0.1:8080',
        changeOrigin: true,
        pathRewrite: {
          '^/api': ''
        }
      }
    },
    historyApiFallback: {
      index: url.parse(options.dev ? '/assets/' : publicPath).pathname
    }
  },
  devtool: options.dev ? '#eval-source-map' : '#source-map'
})
