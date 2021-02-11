module.exports = {
  env: {
    browser: true,
    es6: true,
  },
  extends: [
    'plugin:flowtype/recommended',
    'plugin:prettier/recommended',
    'plugin:react/recommended',
    'prettier/flowtype',
    'prettier/react',
    'prettier/standard',
  ],
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly',
  },
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 2018,
    sourceType: 'module',
  },
  plugins: ['react', 'react-hooks', '@typescript-eslint', 'flowtype'],
  rules: {
    eqeqeq: 'error',
    'flowtype/no-types-missing-file-annotation': 0,
    'no-console': 'error',
    'no-debugger': process.env.NODE_ENV === 'production' ? ['error'] : ['warn'],
    'no-unused-vars': 'warn',
    'no-var': 'error',
    'no-param-reassign': 'error',
    'prettier/prettier': 'error',
    'react/display-name': 'off', // @TODO: TO BE REMOVED AFTER ALL IS FIXED
    'react/prop-types': 'off', // @TODO: TO BE REMOVED AFTER ALL IS FIXED
    'require-jsdoc': 'off',
  },
  settings: {
    react: {
      version: "detect",
    }
  }
};
