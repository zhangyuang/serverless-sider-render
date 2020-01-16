// 'use strict'

// const paths = require('./paths')
// // style files regexes
// const MiniCssExtractPlugin = require('mini-css-extract-plugin')
// const getCSSModuleLocalIdent = require('react-dev-utils/getCSSModuleLocalIdent')
// const getStyleLoaders = require('./util').getStyleLoaders

//         {
//           test: /\.module\.css$/,
//           use: getStyleLoaders({
//             importLoaders: 1,
//             modules: true,
//             getLocalIdent: getCSSModuleLocalIdent
//           })
//         },
//         {
//           test: /\.less$/,
//           exclude: /\.module\.less$/,
//           use: getStyleLoaders(
//             {
//               importLoaders: 2,
//               localIdentName: '[local]'
//             },
//             'less-loader'
//           ),
//           sideEffects: true
//         },
//         {
//           test: /\.module\.less$/,
//           use: getStyleLoaders(
//             {
//               importLoaders: 2,
//               modules: true,
//               getLocalIdent: getCSSModuleLocalIdent
//             },
//             'less-loader'
//           )
//         },
//         {
//           exclude: [/\.(js|mjs|jsx|ts|tsx)$/, /\.html$/, /\.json$/],
//           loader: require.resolve('file-loader'),
//           options: {
//             name: 'static/media/[name].[hash:8].[ext]'
//           }
//         }
//       ]
//     }
//   ]
// }

//   resolve: {
//     alias: {
//       '@': paths.appSrc
//     },
//     extensions: paths.moduleFileExtensions
//       .map(ext => `.${ext}`)
//   },
//   module: webpackModule,
//   plugins: [
//     new MiniCssExtractPlugin({
//       filename: 'static/css/[name].css',
//       chunkFilename: 'static/css/[name].chunk.css'
//     })
//   ],
//   performance: false
// }
import path from 'path'
import Config from 'webpack-chain'
import { Mode } from '../interface/webpack-config'

const config = new Config()
const cwd = process.cwd()
const mode = process.env.NODE_ENV as Mode
const resolveFromCWD = (str: string) => path.resolve(cwd, str)

config.stats({ children: false,entrypoints: false })
config.mode(mode)
config.module.strictExportPresence(true)
config.module
    .rule('url')
        .test([/\.bmp$/, /\.gif$/, /\.jpe?g$/, /\.png$/])
        .use('url-loader')
            .loader('url-loader')
            .options({
              limit: 10000,
              name: 'static/media/[name].[hash:8].[ext]'
            })
            .end()

config.module
    .rule('compile')
        .test(/\.(js|mjs|jsx|ts|tsx)$/)
        .exclude
            .add(/node_modules/)
            .end()
        .use('babel-loader')
            .loader('babel-loader')
            .options({
              cacheDirectory: true,
              cacheCompression: false,
              presets: [
                [
                  '@babel/preset-env',
                  {
                    modules: false
                  }
                ],
                '@babel/preset-react'
              ],
              plugins: []
            })
            .end()

config.module
    .rule('style')
        .test(/\.css$/)
        .exclude
            .add(/\.module\.css$/)
            .end()
        .use(getStyleLoaders({
          importLoaders: 1
        }))
