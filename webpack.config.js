const path = require('path')

module.exports = {
  entry: './src/js/main.js',
  output: {
    filename: 'main.js',
    path: path.join(__dirname, 'public', 'js'),
  },
}
