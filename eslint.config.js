import antfu from '@antfu/eslint-config'
import unocss from '@unocss/eslint-config/flat'

export default []
// dropped lint before migration to flat config is done by library authors
antfu( 
  unocss
)
