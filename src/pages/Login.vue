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
                  type="error"
                  role="alert"
                  closable
                  close-icon="mdi-close-circle"
                  class="mb-4"
                  @click:close="feedbackMessage = ''"
                >
                  {{ feedbackMessage }}
                </v-alert>

                <!-- FORM NATIVO (obrigatório p/ autofill) -->
                <form
                  id="login-form"
                  name="login"
                  autocomplete="on"
                  @submit.prevent="submit"
                >
                  <!-- Usuário -->
                  <v-text-field
                    v-model="user"
                    label="Usuário"
                    prepend-icon="mdi-account"
                    variant="solo-filled"
                    autocomplete="username"
                    name="username"
                    id="username"
                    type="text"
                    :error-messages="errors.user"
                    required
                    density="comfortable"
                  />

                  <!-- Senha -->
                  <v-text-field
                    v-model="password"
                    :type="showPassword ? 'text' : 'password'"
                    label="Senha"
                    prepend-icon="mdi-lock"
                    :append-inner-icon="
                      showPassword ? 'mdi-eye-off' : 'mdi-eye'
                    "
                    @click:append-inner="togglePassword"
                    variant="solo-filled"
                    autocomplete="current-password"
                    name="password"
                    id="password"
                    :error-messages="errors.password"
                    required
                    density="comfortable"
                  />

                  <!-- Botão -->
                  <v-btn
                    block
                    class="mt-4"
                    :loading="isSubmitting"
                    :disabled="isSubmitting"
                    color="primary"
                    type="submit"
                  >
                    Entrar
                  </v-btn>
                </form>
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

const togglePassword = () => {
  showPassword.value = !showPassword.value;
};
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
