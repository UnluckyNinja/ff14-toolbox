import transformerVariantGroup from '@unocss/transformer-variant-group'
import {
  defineConfig,
  presetIcons,
  presetWind4,
} from 'unocss'

export default defineConfig({
  presets: [
    presetWind4({
      // variablePrefix: 'tw-',
      preflights: {
        reset: false,
      },

    }),
    presetIcons(),
  ],
  transformers: [
    transformerVariantGroup(),
  ],
})
