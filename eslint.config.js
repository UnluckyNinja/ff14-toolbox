import antfu from '@antfu/eslint-config'
import unocss from '@unocss/eslint-config/flat'

// export default []
// dropped lint before migration to flat config is done by library authors
export default antfu({
  ignores: [
    'dist/',
    '.nuxt/',
    'node_modules',
    'node_modules/',
    'types/',
    'cache/',
    '!/.eslintrc',
    '!.test',
    '.temp',
    'pnpm-lock.yaml',
  ],
  rules: {
    'style/brace-style': ['off'],
    'unicorn/no-new-array': ['off'],
    'antfu/if-newline': ['off'],
  },
}, unocss)
