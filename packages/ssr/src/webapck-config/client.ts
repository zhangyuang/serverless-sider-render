
// const TerserPlugin = require('terser-webpack-plugin')
// const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin')
// const ManifestPlugin = require('webpack-manifest-plugin')
// const ModuleNotFoundPlugin = require('react-dev-utils/ModuleNotFoundPlugin')
// const safePostCssParser = require('postcss-safe-parser')
// const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
// const optimization = {
//   runtimeChunk: true,
//   splitChunks: {
//     chunks: 'all',
//     name: false,
//     cacheGroups: {
//       vendors: {
//         test: (module) => {
//           return module.resource &&
//           /\.js$/.test(module.resource) &&
//           module.resource.match('node_modules')
//         },
//         name: 'vendor'
//       }
//     }
//   }
// }
// if (!isDev) {
//   optimization.minimizer = [
//     new TerserPlugin({
//       terserOptions: {
//         parse: {
//           ecma: 8
//         },
//         compress: {
//           ecma: 5,
//           warnings: false,
//           comparisons: false,
//           inline: 2
//         },
//         mangle: {
//           safari10: true
//         },
//         output: {
//           ecma: 5,
//           comments: false,
//           ascii_only: true
//         }
//       },
//       // Use multi-process parallel running to improve the build speed
//       // Default number of concurrent runs: os.cpus().length - 1
//       parallel: true,
//       // Enable file caching
//       cache: true,
//       sourceMap: shouldUseSourceMap
//     }),
//     new OptimizeCSSAssetsPlugin({
//       cssProcessorOptions: {
//         parser: safePostCssParser,
//         map: shouldUseSourceMap
//           ? {
//             // `inline: false` forces the sourcemap to be output into a
//             // separate file
//             inline: false,
//             // `annotation: true` appends the sourceMappingURL to the end of
//             // the css file, helping the browser find the sourcemap
//             annotation: true
//           }
//           : false
//       }
//     })
//   ]
// }

// const plugins = [
//   new webpack.DefinePlugin({
//     '__isBrowser__': true // eslint-disable-line
//   }),
//   new ModuleNotFoundPlugin(paths.appPath),
//   new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
//   new ManifestPlugin({
//     fileName: 'asset-manifest.json',
//     publicPath: publicPath
//   })
// ]

// if (process.env.npm_config_report === 'true') {
//   plugins.push(new BundleAnalyzerPlugin())
// }

// module.exports = merge(baseConfig, {
//   entry: {
//     Page: [require.resolve('@babel/polyfill'), paths.entry]
//   },
//   optimization: optimization,
//   plugins: plugins.filter(Boolean),
// })
import webpack from 'webpack'
import MiniCssExtractPlugin from 'mini-css-extract-plugin'
import Config from 'webpack-chain'
import getCSSModuleLocalIdent from 'react-dev-utils/getCSSModuleLocalIdent'
import { baseConfig } from './base'
import { publicPath } from './config'

const isDev = process.env.NODE_ENV === 'development'
const shouldUseSourceMap = isDev || process.env.GENERATE_SOURCEMAP

const config = new Config()
const clientConfig = config

config.merge(baseConfig)

config.devtool(isDev ? 'cheap-module-source-map' : (shouldUseSourceMap ? 'source-map' : false))

config.entry('Page')
        .add('src/index')
        .end()
        .output
          .path('dist')
          .filename('static/js/[name].js')
          .chunkFilename('static/js/[name].chunk.js')
          .publicPath(publicPath)

config.optimization
  .runtimeChunk(true)
  .splitChunks({
    chunks: 'all',
    name: false,
    cacheGroups: {
      vendors: {
        test: (module: any) => {
          return module.resource &&
          /\.js$/.test(module.resource) &&
          module.resource.match('node_modules')
        },
        name: 'vendor'
      }
    }
  })

config.module
    .rule('less')
      .test(/\.less$/)
      .use(MiniCssExtractPlugin.loader)
        .end()
      .use('css-loader')
        .loader('css-loader')
        .options({
          importLoaders: 2,
          modules: true,
          getLocalIdent: getCSSModuleLocalIdent
        })
        .end()
      .use('postcss-loader')
        .loader('postcss-loader')
        .options({
          ident: 'postcss',
          plugins: () => [
            require('postcss-flexbugs-fixes'),
            require('postcss-preset-env')({
              autoprefixer: {
                flexbox: 'no-2009'
              },
              stage: 3
            })
          ]
        })
        .end()
      .use('less-loader')
        .loader('less-loader')
        .end()

export {
  clientConfig
}
