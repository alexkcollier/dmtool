module.exports = {
  root: true,
  parserOptions: {
    parser: 'babel-eslint'
  },
  env: {
    browser: true,
    node: true
  },
  extends: ['standard', 'plugin:prettier/recommended', 'prettier', 'plugin:vue/recommended'],
  plugins: ['standard', 'vue', 'prettier'],
  rules: {
    semi: [2, 'never'],
    'no-console': 'off',
    'prettier/prettier': ['error'],
    'vue/no-v-html': 'off',
    'vue/component-name-in-template-casing': 'off'
  }
}
