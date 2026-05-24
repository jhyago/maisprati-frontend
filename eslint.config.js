export default [
  {
    files: ['assets/js/**/*.js', 'modules/**/*.js'],
    languageOptions: {
      ecmaVersion: 2024,
      sourceType: 'script',
      globals: {
        window: 'readonly',
        document: 'readonly',
        console: 'readonly',
        setTimeout: 'readonly',
        clearInterval: 'readonly',
        setInterval: 'readonly',
        Promise: 'readonly',
        Math: 'readonly',
        IntersectionObserver: 'readonly',
        eval: 'readonly',
        JSON: 'readonly',
        runCode: 'writable',
        runExercise: 'writable',
        toggleSolution: 'writable',
      },
    },
    rules: {
      'no-unused-vars': 'warn',
      'no-undef': 'error',
      eqeqeq: 'error',
      'no-var': 'error',
      'prefer-const': 'warn',
      'no-console': 'off',
    },
  },
];
