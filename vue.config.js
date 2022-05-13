/* eslint-disable @typescript-eslint/no-var-requires */
const path = require('path')
const resolve = (dir) => {
  path.resolve(__dirname, dir)
}
const AutoImport = require('unplugin-auto-import/webpack')
const Components = require('unplugin-vue-components/webpack')
const { ElementPlusResolver } = require('unplugin-vue-components/resolvers')
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer')

module.exports = {
  // outputDir: './build',
  // publicPath: './',

  devServer: {
    proxy: {
      '/api': {
        target: 'http:xxx',
        ws: true,
        changeOrigin: true
      }
    }
  },
  configureWebpack: {
    plugins: [
      AutoImport({
        resolvers: [ElementPlusResolver()]
      }),
      Components({
        resolvers: [ElementPlusResolver()]
      })
    ]
  },

  chainWebpack: (config) => {
    console.log(config)
    // config.resolve.alias.set('views', resolve('src/views'))

    if (process.env.NODE_ENV === 'production') {
      config.plugins('BundleAnalyzerPlugin').use(BundleAnalyzerPlugin)
    }
  }
}
