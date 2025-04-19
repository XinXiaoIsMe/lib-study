import antfu from '@antfu/eslint-config'

export default antfu(
  {
    rules: {
      'style/semi': ['error', 'never'],
      'style/quotes': ['error', 'single'],
    },
  },
)
