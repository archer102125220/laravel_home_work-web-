const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const Dotenv = require('dotenv-webpack');
const dotenv = require('dotenv').config({ path: __dirname + '/.env' });
const theme = require('./theme');

module.exports = {
  entry: [
    './src/index.js'
  ],
  output: {
    path: path.resolve(__dirname, 'public'),
    filename: 'index.js',
  },
  resolve: {
    alias: {
      assets: path.resolve(__dirname, './src/assets/'),
      routes: path.resolve(__dirname, './src/routes/'),
      components: path.resolve(__dirname, './src/components/'),
      layouts: path.resolve(__dirname, './src/layouts/'),
      utils: path.resolve(__dirname, './src/utils/'),
      services: path.resolve(__dirname, './src/services/'),
      node_modules: path.resolve(__dirname, './node_modules'),
      public: path.resolve(__dirname, './public'),
    },
    extensions: ['.js']
  },
  module: {
    rules: [{
      test: /\.less$/,
      use: [{
        loader: "style-loader"
      }, {
        loader: "css-loader",
      }, {
        loader: "less-loader",
        options: {
          modifyVars: theme,
          javascriptEnabled: true,
        }
      }],
    },
    {
      test: /\.css$/,
      use: ['style-loader', {
        loader: 'css-loader',
        options: {
          modules: true
        }
      }],
    }, {
      test: /\.(js|jsx)$/,
      exclude: /node_modules/,
      use: {
        loader: "babel-loader",
        options: {
          presets: ['@babel/preset-env']
        }
      }
    }, {
      test: /\.(png|jpg)$/,
      include: path.join(__dirname, 'public/assets'),
      loader: 'file-loader'
    }, {
      enforce: 'pre',
      test: /\.jsx?$/,
      loader: 'eslint-loader',
      exclude: /node_modules/
    },
    { test: /\.(js|jsx)$/, exclude: /node_modules/, loader: 'babel-loader' },
    { test: /\.(jpe?g|png|gif|svg|png|woff|woff2|eot|ttf|svg)$/, loader: 'url-loader?limit=100000' },
    {
      test: /\.scss$/,
      use: ['style-loader', 'css-loader', 'sass-loader']
    }],
  },
  plugins: [
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: path.join(__dirname, 'public', 'index.html'),
      favicon: path.join(__dirname, 'public', 'favicon.ico')
    }),
    new Dotenv({
      path: './.env', // load this now instead of the ones in '.env'
      safe: true, // load '.env.example' to verify the '.env' variables are all set. Can also be a string to a different file.
      systemvars: true, // load all the predefined 'process.env' variables which will trump anything local per dotenv specs.
      silent: true, // hide any errors
      defaults: false // load '.env.defaults' as the default values if empty.
    }),
  ],
  devServer: {
    port: dotenv.parsed.APP_PORT || 8080,
    host: dotenv.parsed.APP_HOST || 'localhost',
    inline: true,
    hot: false,
  },
};
