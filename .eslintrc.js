/**
 * @type {import('eslint').Linter.Config}
 */
module.exports = {
  env: {
    browser: true,
    es6: true,
  },
  parser: '@babel/eslint-parser',
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'airbnb',
    'plugin:jest/all',
  ],
  settings: {
    react: {
      version: 'detect',
    },
  },
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 2018,
    sourceType: 'module',
    requireConfigFile: false,
    babelOptions: {
      presets: ['@babel/preset-react'],
    },
  },
  plugins: ['react', 'jsx-a11y', 'import', 'jest', 'react-hooks'],
  rules: {
    'react/react-in-jsx-scope': 'off',
    'react/jsx-props-no-spreading': 'off',
    'react/no-array-index-key': 'off',
    'arrow-parens': ['error'],
    'import/no-unresolved': [
      2,
      {
        ignore: ['util', 'common-util', 'components', 'store'],
      },
    ],
    'no-console': ['warn', { allow: ['error'] }],
    'import/prefer-default-export': 'off',
    'react/forbid-prop-types': 'off',
    'react/destructuring-assignment': 'off',
    'jest/no-hooks': 'off',
    'jest/prefer-expect-assertions': 'off',
    'jest/no-conditional-expect': 'off',
    'react/function-component-definition': [
      2,
      {
        namedComponents: ['arrow-function', 'function-declaration'],
        unnamedComponents: 'arrow-function',
      },
    ],
    'react/jsx-no-useless-fragment': [2, { allowExpressions: true }],
    'no-untyped-mock-factory': 'off',
    'jest/no-untyped-mock-factory': 'off',
    'react-hooks/rules-of-hooks': 'error',
    'react-hooks/exhaustive-deps': 'warn',
  },
};
