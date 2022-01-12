const path = require('path')
const TerserPlugin = require('terser-webpack-plugin')

module.exports = {
  entry: './src/js/main.js',
  output: {
    filename: 'main.js',
    path: path.join(__dirname, 'public', 'js'),
  },
  optimization: {
    minimizer: [new TerserPlugin({
      extractComments: false,
    })],
  },
}
