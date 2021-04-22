module.exports = {
  devServer: {
    disableHostCheck: true,
historyApiFallback: true,
    proxy: 'http://localhost:3003',
  }
}
