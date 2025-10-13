module.exports = {
    root: true,
    parser: '@typescript-eslint/parser',
    parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
    },
    plugins: ['@typescript-eslint', 'prettier'],
    extends: [
        'eslint:recommended',
        'plugin:@typescript-eslint/recommended',
        'plugin:prettier/recommended',
    ],
    rules: {
        'prettier/prettier': ['error'],
        'no-unused-vars': 'off',
        '@typescript-eslint/no-unused-vars': ['warn'],
    },
    ignorePatterns: ['dist/', 'node_modules/'],
};
