import js from '@eslint/js';
import prettierPlugin from 'eslint-plugin-prettier';
import yml from 'eslint-plugin-yml';
import yamlParser from 'yaml-eslint-parser';

export default [
  js.configs.recommended,
  {
    files: ['scripts/**/*.js'],
    languageOptions: {
      ecmaVersion: 2021,
      sourceType: 'script',
      globals: {
        console: 'readonly',
        process: 'readonly',
        require: 'readonly',
        module: 'readonly',
        __dirname: 'readonly'
      }
    },
    plugins: {
      prettier: prettierPlugin
    },
    rules: {
      'no-console': 'off',
      'prefer-const': 'warn',
      'no-unused-vars': ['warn', { args: 'none' }],
      'prettier/prettier': 'warn'
    }
  },
  {
    files: ['.github/workflows/**/*.yml', '.github/workflows/**/*.yaml'],
    languageOptions: {
      parser: yamlParser
    },
    plugins: {
      yml
    },
    rules: {
      ...yml.configs['flat/recommended'].rules
    }
  }
];