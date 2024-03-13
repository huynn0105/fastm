module.exports = {
  root: true,
  extends: ['@react-native-community', 'plugin:prettier/recommended', 'plugin:react-native/all'],
  plugins: ['prettier', 'eslint-comments', 'react-native', 'react-hooks'],
  rules: {
    'react-native/no-inline-styles': 0,
    'react-native/no-unused-styles': 1,
    'react-native/split-platform-components': 2,
    'react-native/no-color-literals': 0,
    'react-native/no-raw-text': 0,
    'react-native/no-single-element-style-arrays': 2,
    'react-hooks/rules-of-hooks': 'error',
    'react-hooks/exhaustive-deps': 'warn',
    'no-unused-vars': 'warn',
    'react/react-in-jsx-scope': 'off',
    'react-native/sort-styles': 'off',
    'react/self-closing-comp': 'off',
  },
};
