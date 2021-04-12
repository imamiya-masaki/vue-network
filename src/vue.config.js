module.exports = {
  configureWebpack: {
    plugins: [
      './plugins/prism'
    ]
  },
  chainWebpack: config => {
    config.module
      .rule('worker-loader')
      .test(/\.worker\.js$/)
      .use('worker-loader')
      .loader('worker-loader')
      .end()
  }
}
