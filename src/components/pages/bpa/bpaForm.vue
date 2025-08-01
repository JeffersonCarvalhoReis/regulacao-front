<template>
  <BaseCard class="max-w-[1050px] min-w-[1050px]" title="Gerar BPA" @close="emit('close')">
    <div class="m-5 text-blue-900 ">
      <div class="grid grid-cols-10 gap-2">
        <div class="flex align-center border-2 col-span-3">
          <div class="font-[neuropol] text-center w-30">
            Ministério da Saúde
          </div>
          <img alt="logo do sus" class="w-15 mx-2" src="@/assets/images/logo-sus.svg">
          <div class="text-center">
            <div class="text-xl font-[neuropol]">
              SUS
            </div>
            <div class="font-[neuropol] text-[9px] w-20">
              Sistema Único de Saúde
            </div>
          </div>
        </div>
        <div class="flex gap-4 align-center justify-center border-2 px-2 col-span-7">
          <div class="font-[neuropol] text-4xl">
            BPA-I
          </div>
          <div class="text-center">
            <div class="font-[neuropol] text-xl">
              Boletim de Produção Ambulatorial
            </div>
            <div class="font-[neuropol] text-xl">
              Dados Individualizados
            </div>
          </div>
        </div>
      </div>
      <div class="border-2 mt-1">
        <div class="uppercase bg-blue-800 text-white text-center">
          Identificação do estabelecimento de saúde
        </div>
        <div class="grid grid-cols-5 gap-x-2 mx-2 mt-4">
          <v-text-field
            v-model="health_unit_name"
            class="col-span-4"
            density="compact"
            label="Nome do Estabelecimento de Saúde"
            maxlength="100"
            variant="outlined"
          />
          <v-text-field
            v-model="health_unit_cnes"
            density="compact"
            label="CNES"
            maxlength="100"
            variant="outlined"
          />
        </div>
        <div class="uppercase bg-blue-800 text-white text-center">
          Identificação do Profissional
        </div>
        <div class="grid grid-cols-5 gap-x-2 mx-2 mt-4">
          <v-text-field
            class="col-span-2"
            density="compact"
            label="Cartão Nacional de Saúde (CNS)"
            maxlength="100"
            variant="outlined"
          />
          <v-text-field
            class="col-span-3"
            density="compact"
            label="Nome do Profissional"
            maxlength="100"
            variant="outlined"
          />
          <v-text-field
            class="col-span-3"
            density="compact"
            label="CBO"
            maxlength="100"
            variant="outlined"
          />
          <v-text-field
            class="col-span-2"
            density="compact"
            label="Mês/Ano"
            maxlength="100"
            variant="outlined"
          />
        </div>
        <div class="uppercase bg-blue-800 text-white text-center">
          Identificação do Paciente
        </div>
        <div class="grid grid-cols-6 gap-x-2 mx-2 mt-4">
          <v-text-field
            class="col-span-3"
            density="compact"
            label="Cartão Nacional de Saúde (CNS)"
            maxlength="100"
            variant="outlined"
          />
          <v-text-field
            class="col-span-3"
            density="compact"
            label="Nome do Paciente"
            maxlength="100"
            variant="outlined"
          />
          <v-text-field
            density="compact"
            label="Gênero"
            maxlength="100"
            variant="outlined"
          />
          <v-text-field
            density="compact"
            label="Data de Nascimento"
            maxlength="100"
            variant="outlined"
          />
          <v-text-field
            density="compact"
            label="Nacionalidade"
            maxlength="100"
            variant="outlined"
          />
          <v-text-field
            density="compact"
            label="Raça/Cor"
            maxlength="100"
            variant="outlined"
          />
          <v-text-field
            density="compact"
            label="CEP"
            maxlength="100"
            variant="outlined"
          />
          <v-text-field
            density="compact"
            label="Cód. IBGE Município"
            maxlength="100"
            variant="outlined"
          />
          <v-text-field
            class="col-span-3"
            density="compact"
            label="Endereço"
            maxlength="100"
            variant="outlined"
          />
          <v-text-field
            class="col-span-2"
            density="compact"
            label="Bairro"
            maxlength="100"
            variant="outlined"
          />
          <v-text-field
            density="compact"
            label="Telefone de Contato"
            maxlength="100"
            variant="outlined"
          />
        </div>
        <div class="uppercase bg-blue-800 text-white text-center">
          Procedimento Realizado
        </div>
        <div class="grid grid-cols-6 gap-x-2 mx-2 mt-4">
          <v-text-field
            density="compact"
            label="Data do Atendimento"
            maxlength="100"
            variant="outlined"
          />
          <v-text-field
            class="col-span-2"
            density="compact"
            label="Procedimento"
            maxlength="100"
            variant="outlined"
          />
          <v-text-field
            class="col-span-2"
            density="compact"
            label="Código do Procedimento"
            maxlength="100"
            variant="outlined"
          />
          <v-text-field
            density="compact"
            label="Qtde."
            maxlength="100"
            variant="outlined"
          />
        </div>
      </div>
    </div>
  </BaseCard>
</template>

<script setup>
  import { useMeStore } from '@/stores/me';

  const emit = defineEmits(['close']);

  const meStore = useMeStore();
  const health_unit_name = computed(() => meStore.health_unit)
  const health_unit_cnes = computed(() => meStore.health_unit_cnes)
  meStore.getMe();

</script>

<style scoped>

</style>
