const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

const isProduction = process.env.NODE_ENV === 'production';

// HTML pages to process
const htmlPages = [
  'index', 'about', 'products', 'contact', 'customization',
  'faq', 'portfolio', 'privacy-policy', 'terms-of-service'
];

// Product pages to process
const productPages = [
  'bottles-caps', 'soaps-liquids', 'amenity-kits', 'miscellaneous'
];

// Generate HtmlWebpackPlugin instances for each page
const htmlPlugins = [
  ...htmlPages.map(page => new HtmlWebpackPlugin({
    template: `./public/${page}.html`,
    filename: `${page}.html`,
    chunks: ['main'],
    inject: 'body',
    scriptLoading: 'defer',
    minify: isProduction ? {
      collapseWhitespace: true,
      removeComments: true,
      removeRedundantAttributes: true,
      useShortDoctype: true
    } : false
  })),
  ...productPages.map(page => new HtmlWebpackPlugin({
    template: `./public/products/${page}.html`,
    filename: `products/${page}.html`,
    chunks: ['main'],
    inject: 'body',
    scriptLoading: 'defer',
    minify: isProduction ? {
      collapseWhitespace: true,
      removeComments: true,
      removeRedundantAttributes: true,
      useShortDoctype: true
    } : false
  }))
];

module.exports = {
  mode: isProduction ? 'production' : 'development',
  
  entry: {
    main: './public/js/main.js'
  },
  
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'js/[name].[contenthash:8].js',
    publicPath: process.env.PUBLIC_PATH || '/WPG-Amenities/',
    clean: true
  },
  
  devtool: isProduction ? 'source-map' : 'eval-source-map',
  
  devServer: {
    static: {
      directory: path.join(__dirname, 'public'),
    },
    compress: true,
    port: 8080,
    hot: true,
    open: true,
    historyApiFallback: true
  },
  
  module: {
    rules: [
      // JavaScript
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env'],
            plugins: ['@babel/plugin-transform-runtime']
          }
        }
      },
      
      // CSS
      {
        test: /\.css$/,
        use: [
          isProduction ? MiniCssExtractPlugin.loader : 'style-loader',
          {
            loader: 'css-loader',
            options: {
              importLoaders: 1,
              sourceMap: !isProduction
            }
          },
          {
            loader: 'postcss-loader',
            options: {
              postcssOptions: {
                plugins: [
                  ['autoprefixer'],
                  isProduction && ['cssnano', { preset: 'default' }]
                ].filter(Boolean)
              }
            }
          }
        ]
      },
      
      // Images
      {
        test: /\.(png|jpg|jpeg|gif|svg|webp)$/i,
        type: 'asset',
        parser: {
          dataUrlCondition: {
            maxSize: 8 * 1024 // 8kb
          }
        },
        generator: {
          filename: 'images/[name].[hash:8][ext]'
        }
      },
      
      // Fonts
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/i,
        type: 'asset/resource',
        generator: {
          filename: 'fonts/[name].[hash:8][ext]'
        }
      },
      
      // YAML
      {
        test: /\.ya?ml$/,
        use: 'yaml-loader'
      }
    ]
  },
  
  plugins: [
    new CleanWebpackPlugin(),
    
    ...htmlPlugins,
    
    new MiniCssExtractPlugin({
      filename: isProduction ? 'css/[name].[contenthash:8].css' : 'css/[name].css',
      chunkFilename: isProduction ? 'css/[id].[contenthash:8].css' : 'css/[id].css'
    }),
    
    new CopyWebpackPlugin({
      patterns: [
        {
          from: 'public/css',
          to: 'css',
          noErrorOnMissing: true
        },
        {
          from: 'public/images',
          to: 'images',
          noErrorOnMissing: true
        },
        {
          from: 'public/data',
          to: 'data',
          noErrorOnMissing: true
        },
        {
          from: 'public/partials',
          to: 'partials',
          noErrorOnMissing: true
        },
        {
          from: 'public/js/vendor',
          to: 'js/vendor',
          noErrorOnMissing: true
        },
        {
          from: 'public/js/config.js',
          to: 'js/config.js',
          noErrorOnMissing: true
        },
        {
          from: 'public/js/placeholder.js',
          to: 'js/placeholder.js',
          noErrorOnMissing: true
        },
        {
          from: 'public/js/template-engine.js',
          to: 'js/template-engine.js',
          noErrorOnMissing: true
        }
      ]
    })
  ],
  
  optimization: {
    minimize: isProduction,
    minimizer: [
      new TerserPlugin({
        terserOptions: {
          compress: {
            drop_console: isProduction
          }
        }
      }),
      new CssMinimizerPlugin()
    ],
    splitChunks: {
      chunks: 'all',
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          priority: 10
        },
        common: {
          minChunks: 2,
          priority: 5,
          reuseExistingChunk: true
        }
      }
    }
  },
  
  performance: {
    hints: isProduction ? 'warning' : false,
    maxEntrypointSize: 512000,
    maxAssetSize: 512000
  }
};