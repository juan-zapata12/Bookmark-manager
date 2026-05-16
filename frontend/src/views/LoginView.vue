<template>
  <div class="auth-page">
    <div class="auth-card">
      <div class="auth-header">
        <img src="/LOGOBOOKSF.png" alt="Logo" class="logo" />
        <h1>Bienvenido</h1>
        <p>Inicia sesión en tu gestor de bookmarks</p>
      </div>

      <form @submit.prevent="handleLogin" novalidate>
        <div v-if="errorMsg" class="alert alert-error">
          <AlertCircle :size="14" /> {{ errorMsg }}
        </div>

        <div class="form-group">
          <label for="email">Correo electrónico</label>
          <input id="email" v-model="form.email" type="text" placeholder="tu@email.com"
            :class="{ 'input-error': fieldErrors.email }" autocomplete="email" />
          <span v-if="fieldErrors.email" class="field-error">{{ fieldErrors.email }}</span>
        </div>

        <div class="form-group">
          <label for="password">Contraseña</label>
          <div class="input-password">
            <input id="password" v-model="form.password" :type="showPassword ? 'text' : 'password'"
              placeholder="••••••••" :class="{ 'input-error': fieldErrors.password }"
              autocomplete="current-password" />
            <button type="button" class="toggle-password" @click="showPassword = !showPassword">
              <Eye v-if="!showPassword" :size="16" />
              <EyeOff v-else :size="16" />
            </button>
          </div>
          <span v-if="fieldErrors.password" class="field-error">{{ fieldErrors.password }}</span>
        </div>

        <button type="submit" class="btn-primary" :disabled="authStore.loading">
          <span v-if="authStore.loading" class="spinner"></span>
          <LogIn v-else :size="15" />
          {{ authStore.loading ? 'Ingresando...' : 'Iniciar sesión' }}
        </button>
      </form>

      <p class="auth-footer">
        ¿No tienes cuenta?
        <router-link to="/register">Regístrate aquí</router-link>
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '../stores/authStore'
import { AlertCircle, Eye, EyeOff, LogIn } from 'lucide-vue-next'

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()

const form = reactive({ email: '', password: '' })
const showPassword = ref(false)
const errorMsg = ref('')
const fieldErrors = reactive({ email: '', password: '' })

function validateForm() {
  let valid = true
  fieldErrors.email = ''
  fieldErrors.password = ''
  if (!form.email) { fieldErrors.email = 'El email es requerido'; valid = false }
  if (!form.password) { fieldErrors.password = 'La contraseña es requerida'; valid = false }
  return valid
}

async function handleLogin() {
  errorMsg.value = ''
  if (!validateForm()) return
  const result = await authStore.login(form)
  if (result.success) {
    const redirect = route.query.redirect || '/dashboard'
    router.push(redirect)
  } else {
    errorMsg.value = result.message
  }
}
</script>
