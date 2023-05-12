import { presetAnu } from 'anu-vue'
import { presetThemeDefault } from '@anu-vue/preset-theme-default'
import {
  defineConfig, presetAttributify, presetIcons, presetTypography, presetUno,
} from 'unocss'

export default defineConfig({
  presets:[
    presetUno(),
    presetAttributify(),
    presetIcons(),
    presetTypography(),
    presetAnu(),
    presetThemeDefault(),
  ],
  include: [/.*\/anu-vue\.js(.*)?$/, /\.(vue|svelte|[jt]sx|mdx?|astro|elm|php|phtml|html)($|\?)/],
})