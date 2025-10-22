module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true,
  },
  parser: '@babel/eslint-parser',
  parserOptions: {
    ecmaVersion: 12,
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true,
    },
  },
  plugins: ['react', 'prettier'],
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:prettier/recommended',
  ],
  rules: {
    'prettier/prettier': 'warn',
    'no-unused-vars': 'warn',
    'react/prop-types': 'off',
  },

  overrides: [
    {
      files: ['*.test.js', '*.test.jsx', '*.spec.js', '*.spec.jsx'],
      env: {
        jest: true,
        browser: true,
        node: true,
      },
      parser: '@babel/eslint-parser',
      parserOptions: {
        ecmaVersion: 12,
        sourceType: 'module',
        ecmaFeatures: {
          jsx: true,
        },
      },
      plugins: ['react', 'prettier'],
      extends: [
        'eslint:recommended',
        'plugin:react/recommended',
        'plugin:prettier/recommended',
      ],
      rules: {
        'prettier/prettier': 'warn',
        'no-unused-vars': 'warn',
        'react/prop-types': 'off',
      },
    },
  ],
};
