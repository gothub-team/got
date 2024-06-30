// @ts-check

import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import prettier from 'eslint-config-prettier';
import { rules as importRules } from 'eslint-plugin-import';

export default tseslint.config(eslint.configs.recommended, ...tseslint.configs.recommended, prettier, {
    rules: {
        'prefer-template': 'error',
        '@typescript-eslint/triple-slash-reference': 'off',
        '@typescript-eslint/consistent-type-imports': [
            'error',
            {
                prefer: 'type-imports',
                disallowTypeAnnotations: true,
                fixStyle: 'inline-type-imports',
            },
        ],
        'import/extensions': ['error', 'ignorePackages'],
    },
    plugins: {
        import: {
            rules: importRules,
        },
    },
});
