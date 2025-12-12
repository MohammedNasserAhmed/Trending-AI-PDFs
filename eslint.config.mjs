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
      sourceType: 'module',
      globals: {
        console: 'readonly',
        process: 'readonly',
        require: 'readonly',
        module: 'readonly',
        __dirname: 'readonly',
        fetch: 'readonly'
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
    files: ['server/**/*.js'],
    languageOptions: {
      ecmaVersion: 2021,
      sourceType: 'module',
      globals: {
        console: 'readonly',
        process: 'readonly',
        Buffer: 'readonly',
        setTimeout: 'readonly',
        clearTimeout: 'readonly',
        setInterval: 'readonly',
        clearInterval: 'readonly',
        fetch: 'readonly'
      }
    },
    rules: {
      'no-console': 'off',
      'no-unused-vars': ['warn', { args: 'none' }]
    }
  },
  {
    files: ['src/**/*.js'],
    languageOptions: {
      ecmaVersion: 2021,
      sourceType: 'module',
      globals: {
        document: 'readonly',
        window: 'readonly',
        navigator: 'readonly',
        fetch: 'readonly',
        console: 'readonly',
        localStorage: 'readonly',
        alert: 'readonly',
        location: 'readonly',
        history: 'readonly',
        URL: 'readonly',
        setTimeout: 'readonly',
        clearTimeout: 'readonly',
        setInterval: 'readonly',
        clearInterval: 'readonly',
        requestAnimationFrame: 'readonly',
        cancelAnimationFrame: 'readonly',
        Image: 'readonly',
        Option: 'readonly',
        HTMLElement: 'readonly',
        Event: 'readonly',
        CustomEvent: 'readonly'
      }
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