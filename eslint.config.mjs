import antfu from '@antfu/eslint-config'

export default [
  ...antfu(),

  // ✅ 针对测试文件增加特定配置
  {
    files: ['**/*.test.ts', '**/*.spec.ts'],
    languageOptions: {
      parserOptions: {
        project: './tsconfig.json', // 确保 tsconfig.json 包含了 test 文件
      },
    },
    // 如果你用的是 Vitest
    plugins: {
      vitest: await import('eslint-plugin-vitest'),
    },
    rules: {
      // 允许使用测试中的全局方法如 `describe`、`it`、`expect`
    },
    linterOptions: {
      // 避免 “no unresolved parserOptions.project” 警告
      reportUnusedDisableDirectives: true,
    },
    settings: {},
  },
]
