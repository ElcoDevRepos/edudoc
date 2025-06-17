module.exports = {
    env: {
        browser: true,
        es6: true,
    },
    extends: [
        'eslint:recommended',
        'plugin:@typescript-eslint/recommended',
        'plugin:@typescript-eslint/recommended-requiring-type-checking',
        'prettier',
    ],
    parser: '@typescript-eslint/parser',
    parserOptions: {
        project: ['./tsconfig.json', './src/app/tsconfig.app.json', './src/app/tsconfig.spec.json'],
        sourceType: 'module',
        tsconfigRootDir: __dirname,
    },
    plugins: ['eslint-plugin-jsdoc', 'eslint-plugin-no-null', '@typescript-eslint'],
    root: true,
    ignorePatterns: ['.eslintrc.js', 'node_modules/', 'dist/'],
    rules: {
        '@typescript-eslint/no-unsafe-return': 'off',
        '@typescript-eslint/no-unsafe-call': 'off',
        '@typescript-eslint/no-unsafe-member-access': 'off',
        '@typescript-eslint/no-unsafe-assignment': 'off',
        '@typescript-eslint/no-unused-vars': ["warn", {
            "args": "all",
            "argsIgnorePattern": "^_",
            "caughtErrors": "all",
            "caughtErrorsIgnorePattern": "^_",
            "destructuredArrayIgnorePattern": "^_",
            "varsIgnorePattern": "^_",
        }],
        "no-console": ["error", { "allow": ["warn", "error", "info"] }],
    },
};
