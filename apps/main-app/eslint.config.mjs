import nx from '@nx/eslint-plugin';
import baseConfig from '../../eslint.base.config.mjs';

export default [
  ...baseConfig,
  ...nx.configs['flat/angular'],
  ...nx.configs['flat/angular-template'],
  {
    files: ['**/*.ts'],
    rules: {
      '@angular-eslint/template/interactive-supports-focus': 'off',

      '@angular-eslint/template/click-events-have-key-events': 'off',

      '@angular-eslint/component-selector': 'off',

      '@angular-eslint/prefer-inject': 'off',

      '@angular-eslint/directive-selector': [
        'error',
        {
          type: 'attribute',
          prefix: 'app',
          style: 'camelCase',
        },
      ],
    },
  },
  {
    files: ['**/*.html'],
    // Override or add rules here
    rules: {
    },
  },
];
