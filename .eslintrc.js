module.exports = {
  extends: [
    'next/core-web-vitals'
  ],
  rules: {
    // Disable all rules for now
    '@typescript-eslint/no-unused-vars': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    'no-console': 'off',
    'import/order': 'off',
    'unused-imports/no-unused-imports': 'off',
    'react-hooks/rules-of-hooks': 'off',
    'react-hooks/exhaustive-deps': 'off',
    'react/jsx-key': 'off',
    '@next/next/no-img-element': 'off',
    'react/no-unescaped-entities': 'off',
  },
  settings: {
    'import/resolver': {
      typescript: {
        alwaysTryTypes: true,
        project: './tsconfig.json'
      }
    },
    react: {
      version: 'detect'
    }
  },
  env: {
    browser: true,
    es2022: true,
    node: true
  },
  overrides: [
    {
      files: ['**/*.test.{ts,tsx}', '**/*.spec.{ts,tsx}'],
      env: {
        jest: true
      },
      rules: {
        '@typescript-eslint/no-explicit-any': 'off'
      }
    }
  ]
};