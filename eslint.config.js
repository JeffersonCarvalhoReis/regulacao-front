import vuetifyConfig from 'eslint-config-vuetify';
import autoImportConfig from './.eslintrc-auto-import.json' assert { type: 'json' };

export default [
  // 1) padrões de arquivos a ignorar
  {
    ignores: ['**/*.d.ts'],
  },

  // 2) globais, agora em languageOptions.globals
  {
    languageOptions: {
      globals: {
        ...(autoImportConfig.globals || {}),
      },
    },
  },

  // 3) toda a config do Vuetify
  ...vuetifyConfig,

  // 4) suas regras customizadas
  {
    rules: {
      'vue/valid-v-slot': 'off',
    },
  },
];

