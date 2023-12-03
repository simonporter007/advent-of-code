/* eslint-disable @typescript-eslint/naming-convention */
module.exports = {
  root: true,
  ignorePatterns: ['.eslintrc.js', './index.js'],
  extends: [
    'plugin:@typescript-eslint/recommended',
    'plugin:react/recommended',
  ],
  overrides: [
    {
      files: ['*.ts', '*.tsx', '*.js'], // Your TypeScript files extension
      parserOptions: {
        project: ['./tsconfig.json'],
        tsconfigRootDir: __dirname,
      },
    },
  ],
  parser: '@typescript-eslint/parser',
  plugins: [
    'import',
    'react-hooks',
    'no-only-tests',
    '@typescript-eslint',
    'simple-import-sort',
  ],
  extends: [
    'plugin:@typescript-eslint/recommended',
    'plugin:import/recommended',
    'plugin:import/typescript',
    'plugin:react/recommended',
    'plugin:react/jsx-runtime',
  ],
  env: { es6: true },
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
      ecmaVersion: 10,
    },
    sourceType: 'module',
  },
  rules: {
    'react-hooks/rules-of-hooks': 'error', // Checks rules of Hooks
    'react-hooks/exhaustive-deps': 'error', // Checks effect dependencies
    'simple-import-sort/exports': 'error',
    'no-console': ['error', { allow: ['warn', 'error', 'info'] }],
    'no-only-tests/no-only-tests': 'error',
    'no-debugger': 'error',
    'no-unused-vars': ['off'],
    'import/no-unresolved': 'off',
    'import/namespace': 'off',
    '@typescript-eslint/no-unused-vars': ['error'],
    'sort-imports': 'off',
    'import/newline-after-import': 'error',
    'import/no-duplicates': 'error',
    'react-hooks/rules-of-hooks': 'error',
    'react-hooks/exhaustive-deps': 'error',
    'react/jsx-uses-react': 'off',
    'react/react-in-jsx-scope': 'off',
    'react/prop-types': 'off',
    'react/display-name': 'off',
    '@typescript-eslint/no-var-requires': 'off',
    '@typescript-eslint/no-extra-semi': 'off',
    'no-warning-comments': [
      'error',
      { terms: ['fixme'], location: 'anywhere' },
    ],
    'no-only-tests/no-only-tests': 'error',
    '@typescript-eslint/no-empty-function': 'warn',
    '@typescript-eslint/ban-ts-comment': 'warn',

    '@typescript-eslint/ban-types': 'warn',
    '@typescript-eslint/explicit-function-return-type': 0,
    '@typescript-eslint/explicit-member-accessibility': 0,
    '@typescript-eslint/no-var-requires': 0,
    '@typescript-eslint/explicit-module-boundary-types': 0,

    'react/no-children-prop': 0,
    'react/display-name': 0,
    'react/prop-types': 0,
    'react/jsx-no-literals': 1,
    'react/self-closing-comp': 'error',
    // https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/eslint-plugin/docs/rules/no-empty-function.md#rule-changes
    'no-empty-function': 'off',

    '@typescript-eslint/naming-convention': [
      'warn',
      {
        selector: 'default',
        format: ['camelCase'],
        filter: {
          regex: '^&:.*',
          match: false,
        },
        leadingUnderscore: 'allow',
        trailingUnderscore: 'allow',
      },
      {
        selector: 'variableLike',
        format: ['camelCase', 'UPPER_CASE', 'PascalCase', 'snake_case'],
      },
      {
        selector: 'typeLike',
        format: ['PascalCase'],
      },
      {
        selector: [
          'property',
          'objectLiteralProperty',
          'parameterProperty',
          'method',
          'accessor',
        ],
        filter: {
          regex: '^&:.*',
          match: false,
        },
        format: ['camelCase', 'PascalCase', 'UPPER_CASE', 'snake_case'],
        leadingUnderscore: 'allow',
      },
      {
        selector: ['function'],
        format: ['camelCase', 'PascalCase'],
      },
    ],
    'react/no-unescaped-entities': [
      'error',
      {
        forbid: [
          {
            char: '>',
            alternatives: ['&gt;'],
          },
          {
            char: '"',
            alternatives: ['&quot;', '&ldquo;', '&#34;', '&rdquo;'],
          },
          {
            char: '}',
            alternatives: ['&#125;'],
          },
        ],
      },
    ],
  },

  overrides: [
    {
      files: ['*.ts', '*.tsx'],
      rules: {
        // import sorts see
        // https://github.com/lydell/eslint-plugin-simple-import-sort/
        // https://github.com/lydell/eslint-plugin-simple-import-sort/blob/master/examples/.eslintrc.js
        'simple-import-sort/imports': [
          'error',
          {
            groups: [
              // Packages. `react` related packages come first.
              // if we had more than one array, each array is separated
              // by a space
              [
                '^react',
                // 3rd party
                '^@?\\w',
                // Kodiak
                '^@kodiak-ui(.*)',
                // styleguide
                '^styleguide',
                // graphql
                '^__generated__.*',
                'app/graphql.*',
                '^app/.*',
                // // Side effect imports.
                '^\\u0000',
                // Parent imports. Put `..` last.
                '^\\.\\.(?!/?$)',
                '^\\.\\./?$',
                // Other relative imports. Put same-folder imports and `.` last.
                '^\\./(?=.*/)(?!/?$)',
                '^\\.(?!/?$)',
                '^\\./?$',
                // Style imports.
                '^.+\\.s?css$',
              ],
            ],
          },
        ],
      },
    },
  ],
  settings: {
    react: {
      version: 'detect',
    },
  },
};
