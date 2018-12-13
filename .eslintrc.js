module.exports = {
  root: true,
  parserOptions: {
    parser: 'babel-eslint'
  },
  env: {
    browser: true,
    node: true
  },
  extends: [
    'standard',
    'plugin:prettier/recommended',
    'plugin:vue/recommended'
  ],
  // required to lint *.vue files
  plugins: ['prettier', 'vue'],
  // add your custom rules here
  rules: {
    semi: [2, 'never'],
    'no-console': 'off',
    'prettier/prettier': ['error'],
    'vue/no-v-html': 'off'
  }
}
