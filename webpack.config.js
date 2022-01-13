const path = require('path')
const TerserPlugin = require('terser-webpack-plugin')

module.exports = {
  entry: { main: './src/js/main.js', bootstrap: './src/js/bootstrap.js' },
  output: {
    filename: '[name].js',
    path: path.join(__dirname, 'public', 'js'),
  },
  optimization: {
    minimizer: [
      new TerserPlugin({
        extractComments: false,
      })
    ]
  },
  resolve: {
    modules: ['node_modules'],
  },
}
