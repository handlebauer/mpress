import js from '@eslint/js'
import tseslint from 'typescript-eslint'

export default tseslint.config(
  js.configs.recommended,
  ...tseslint.configs.recommendedTypeChecked,
  {
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
)
// export default [
//   js.configs.recommended,
// {
//   files: ['src/**/*.ts', 'src/**/*.tsx'],

//     // extends: [
//     //   'eslint:recommended',
//     //   'plugin:react/recommended',
//     //   'plugin:react-hooks/recommended',
//     //   'prettier',
//     // ],

//     // plugins: ['react', 'react-hooks'],

//     // languageOptions: {
//     //   ecmaVersion: 12,
//     //   sourceType: 'module',
//     //   ecmaFeatures: { jsx: true, tsx: true },
//     // },
//   },
// ]
