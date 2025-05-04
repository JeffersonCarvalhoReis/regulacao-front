import vuetifyConfig from 'eslint-config-vuetify'

export default [
  {
    ignores: ['**/*.d.ts'],
  },
  {
    globals: {
      ...(require('./.eslintrc-auto-import.json').globals || {}),
    },
  },

  ...vuetifyConfig,
]
