module.exports = {
  'env': {
    'node': true,
    'browser': true,
    'es2021': true,
    'commonjs': true
  },
  'extends': 'eslint:recommended',
  'parserOptions': {
    'ecmaVersion': 12,
    'sourceType': 'module'
  },
  'rules': {
    'indent': ['error', 2],
    'quotes': ['error', 'single'],
    'linebreak-style': ['error', 'unix'],
    'semi': ['error', 'never'],
    'no-multi-spaces': ['error']
  }
}
