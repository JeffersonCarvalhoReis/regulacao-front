import vuetifyConfig from 'eslint-config-vuetify'

export default [
  {
    ignores: ['**/*.d.ts'],
  },
  {

  },
  ...vuetifyConfig,
  {
    rules: {
      'vue/valid-v-slot': 'off',
    },
  },

]
