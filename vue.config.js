// const path = require('path')

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
    resolve: {
      alias: {
        views: '@/views'
      }
    }
  }
}
