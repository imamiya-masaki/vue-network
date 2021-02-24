module.exports = {
  chainWebpack: config => {
    config.module
      .rule('worker-loader')
      .test(/\.worker\.js$/)
      .use({
        loader: 'worker-loader',
        options: {
          inline: true
        }
      })
      .loader('worker-loader')
      .end()
  }
}
