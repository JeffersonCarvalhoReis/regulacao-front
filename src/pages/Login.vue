<template>
  <div class="relative h-screen w-full flex justify-center">
    <!-- Imagem de fundo com desfoque -->
    <div
      class="absolute inset-0 bg-cover bg-center blur-md"
      :style="{ backgroundImage: `url(${secretaria})` }"
    />
    <div class="absolute inset-0 bg-white/30" />

    <div class="flex items-center lg:w-full max-w-7xl">
      <div>
        <v-card
          class="shadow-md h-screen lg:h-auto w-full md:w-md flex flex-col items-start justify-start lg:justify-center min-w-sm px-5"
          flat
        >
          <div class="w-full flex flex-col mt-20">
            <div class="w-65 flex flex-col lg:hidden items-center self-center">
              <img
                alt="Logo da prefeitura"
                src="/src/assets/images/logo-gestao.png"
              />
              <img
                alt="Logo da saude"
                class="w-55"
                src="/src/assets/images/logo-saude.png"
              />
            </div>

            <h1
              class="text-2xl text-blue-800 font-bold tracking-wide text-center lg:mb-10 mt-20 lg:mt-0"
            >
              <v-icon>mdi-clipboard-check-outline</v-icon> Sistema de Regulação
            </h1>

            <div class="flex-grow items-center justify-center lg:mt-0 mb-20">
              <v-card-title class="text-2xl text-center mb-4"
                >Conecte-se</v-card-title
              >
              <v-card-text>
                <v-alert
                  v-if="feedbackMessage"
                  class="mb-4"
                  closable
                  close-icon="mdi-close-circle"
                  icon="mdi-alert-circle"
                  type="error"
                  @click:close="feedbackMessage = ''"
                >
                  {{ feedbackMessage }}
                </v-alert>

                <v-form @submit.prevent="submit">
                  <v-text-field
                    v-model="user"
                    autocomplete="username"
                    density="comfortable"
                    :error-messages="errors.user"
                    label="Usuário"
                    prepend-icon="mdi-account"
                    variant="solo-filled"
                  />

                  <v-text-field
                    v-model="password"
                    :append-inner-icon="
                      showPassword ? 'mdi-eye-off' : 'mdi-eye'
                    "
                    autocomplete="current-password"
                    density="comfortable"
                    :error-messages="errors.password"
                    label="Senha"
                    prepend-icon="mdi-lock"
                    :type="showPassword ? 'text' : 'password'"
                    variant="solo-filled"
                    @click:append-inner="showPassword = !showPassword"
                  />

                  <v-btn
                    block
                    class="mt-4"
                    color="primary"
                    :loading="isSubmitting"
                    type="submit"
                  >
                    <span v-if="!isSubmitting">Entrar</span>
                  </v-btn>
                </v-form>
              </v-card-text>
            </div>
          </div>
        </v-card>
      </div>

      <div class="z-10 hidden lg:block mx-auto mb-15 max-w-2xl">
        <img
          alt="logo da prefeitura"
          src="/src/assets/images/logo-gestao.png"
        />
        <img
          alt="Logo da saude"
          class="w-2/3 m-auto"
          src="/src/assets/images/logo-saude.png"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import secretaria from "@/assets/images/secretaria.jpeg";
import { useAuthStore } from "@/stores/authStore";
import { useField, useForm } from "vee-validate";
import { ref } from "vue";
import { object, string } from "yup";

const schema = object({
  user: string().required("Campo usuário é obrigatório"),
  password: string().required("Campo senha é obrigatório"),
});

const { handleSubmit, errors, isSubmitting } = useForm({
  validationSchema: schema,
});

const { value: user } = useField("user");
const { value: password } = useField("password");

const showPassword = ref(false);
const feedbackMessage = ref("");

const authStore = useAuthStore();
const submit = handleSubmit(async (values) => {
  feedbackMessage.value = "";
  try {
    await authStore.login(values.user, values.password);
  } catch (error) {
    feedbackMessage.value =
      error.response?.data?.message || error.message || "Erro ao fazer login.";
  }
});
</script>
