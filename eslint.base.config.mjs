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
      "overrides": [
        {
          "files": ["*.ts", "*.tsx", "*.js", "*.jsx"],
          "rules": {
            // Allow using 'any' (fixes: "Unexpected any. Specify a different type")
            "@typescript-eslint/no-explicit-any": "off",

            // Allow empty functions (useful for Angular lifecycle hooks like ngOnInit)
            "@typescript-eslint/no-empty-function": "off",

            // Allow console.log
            "no-console": "off",

            // Allow unused variables (or set to "warn" instead of "error")
            "@typescript-eslint/no-unused-vars": "off",

            // Stop forcing 'unknown' or 'never' on generics
            "@typescript-eslint/no-unnecessary-type-constraint": "off",

            "@angular-eslint/template/interactive-supports-focus": "off",

            "@angular-eslint/template/click-events-have-key-events": "off",

            // Allow component selectors to be whatever you want (not strict prefix)
            "@angular-eslint/component-selector": "off"
          }
        }
        // ... other overrides might exist here
      ]
    },
  },
];
