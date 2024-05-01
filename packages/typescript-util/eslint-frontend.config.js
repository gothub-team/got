// @ts-check

import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import prettier from 'eslint-config-prettier';

export default tseslint.config(eslint.configs.recommended, ...tseslint.configs.recommended, prettier, {
    rules: {
        'prefer-template': 'error',
        '@typescript-eslint/triple-slash-reference': 'off',
    },
});
