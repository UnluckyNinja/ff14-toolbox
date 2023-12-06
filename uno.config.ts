import {
  defineConfig,
  presetUno,
} from 'unocss'
import transformerVariantGroup from '@unocss/transformer-variant-group'

export default defineConfig({
  presets: [
    presetUno({
      variablePrefix: 'tw-',
    }),
  ],
  transformers: [
    transformerVariantGroup(),
  ],
})
