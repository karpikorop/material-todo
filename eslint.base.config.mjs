import nx from '@nx/eslint-plugin';

export default [
  ...nx.configs['flat/base'],
  ...nx.configs['flat/typescript'],
  ...nx.configs['flat/javascript'],
  {
    ignores: ['**/dist', '**/out-tsc'],
  },
  {
    files: ['**/*.ts', '**/*.tsx', '**/*.js', '**/*.jsx'],
    rules: {
      '@nx/enforce-module-boundaries': [
        'error',
        {
          enforceBuildableLibDependency: true,
          allow: ['^.*/eslint(\\.base)?\\.config\\.[cm]?[jt]s$'],
          depConstraints: [
            {
              sourceTag: '*',
              onlyDependOnLibsWithTags: ['*'],
            },
          ],
        },
      ],
    },
  },
  {
    files: [
      '**/*.ts',
      '**/*.tsx',
      '**/*.cts',
      '**/*.mts',
      '**/*.js',
      '**/*.jsx',
      '**/*.cjs',
      '**/*.mjs',
    ],
    // Override or add rules here
    rules: {
      '@angular-eslint/template/interactive-supports-focus': 'off',

      '@angular-eslint/template/click-events-have-key-events': 'off',

      '@angular-eslint/component-selector': 'off',

      '@angular-eslint/prefer-inject': 'off',

      '@typescript-eslint/no-explicit-any': 'off',

      '@typescript-eslint/no-empty-function': 'warn',

      'no-console': ['warn', { allow: ['error', 'warn'] }],

      '@typescript-eslint/no-unused-vars': 'warn',

      '@typescript-eslint/no-unnecessary-type-constraint': 'off',

      '@typescript-eslint/no-non-null-assertion': 'off',
    },
  },
];
