<template>
  <div class="auth-page">
    <div class="auth-card">
      <div class="auth-header">
        <img src="/LOGOBOOKSF.png" alt="Logo" class="logo" />
        <h1>Crear cuenta</h1>
        <p>Únete y organiza tus bookmarks</p>
      </div>

      <form @submit.prevent="handleRegister" novalidate>
        <div v-if="errorMsg" class="alert alert-error">
          <AlertCircle :size="14" /> {{ errorMsg }}
        </div>
        <div v-if="successMsg" class="alert alert-success">
          <CheckCircle :size="14" /> {{ successMsg }}
        </div>

        <div class="form-group">
          <label for="name">Nombre completo</label>
          <input id="name" v-model="form.name" type="text" placeholder="Tu nombre"
            :class="{ 'input-error': fieldErrors.name }" autocomplete="name" />
          <span v-if="fieldErrors.name" class="field-error">{{ fieldErrors.name }}</span>
        </div>

        <div class="form-group">
          <label for="email">Correo electrónico</label>
          <input id="email" v-model="form.email" type="email" placeholder="tu@email.com"
            :class="{ 'input-error': fieldErrors.email }" autocomplete="email" />
          <span v-if="fieldErrors.email" class="field-error">{{ fieldErrors.email }}</span>
        </div>

        <div class="form-group">
          <label for="password">Contraseña</label>
          <div class="input-password">
            <input id="password" v-model="form.password" :type="showPassword ? 'text' : 'password'"
              placeholder="Mínimo 6 caracteres" :class="{ 'input-error': fieldErrors.password }"
              autocomplete="new-password" />
            <button type="button" class="toggle-password" @click="showPassword = !showPassword">
              <Eye v-if="!showPassword" :size="16" />
              <EyeOff v-else :size="16" />
            </button>
          </div>
          <span v-if="fieldErrors.password" class="field-error">{{ fieldErrors.password }}</span>
        </div>

        <div class="form-group">
          <label for="confirmPassword">Confirmar contraseña</label>
          <input id="confirmPassword" v-model="form.confirmPassword"
            :type="showPassword ? 'text' : 'password'" placeholder="Repite tu contraseña"
            :class="{ 'input-error': fieldErrors.confirmPassword }" autocomplete="new-password" />
          <span v-if="fieldErrors.confirmPassword" class="field-error">{{ fieldErrors.confirmPassword }}</span>
        </div>

        <button type="submit" class="btn-primary" :disabled="authStore.loading">
          <span v-if="authStore.loading" class="spinner"></span>
          <UserPlus v-else :size="15" />
          {{ authStore.loading ? 'Creando cuenta...' : 'Registrarse' }}
        </button>
      </form>

      <p class="auth-footer">
        ¿Ya tienes cuenta? <router-link to="/login">Inicia sesión</router-link>
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/authStore'
import { AlertCircle, CheckCircle, Eye, EyeOff, UserPlus } from 'lucide-vue-next'

const router = useRouter()
const authStore = useAuthStore()

const form = reactive({ name: '', email: '', password: '', confirmPassword: '' })
const showPassword = ref(false)
const errorMsg = ref('')
const successMsg = ref('')
const fieldErrors = reactive({ name: '', email: '', password: '', confirmPassword: '' })

function validateForm() {
  let valid = true
  Object.keys(fieldErrors).forEach((k) => (fieldErrors[k] = ''))
  if (!form.name || form.name.trim().length < 2) { fieldErrors.name = 'El nombre debe tener al menos 2 caracteres'; valid = false }
  if (!form.email) { fieldErrors.email = 'El email es requerido'; valid = false }
  if (!form.password || form.password.length < 6) { fieldErrors.password = 'La contraseña debe tener al menos 6 caracteres'; valid = false }
  if (form.password !== form.confirmPassword) { fieldErrors.confirmPassword = 'Las contraseñas no coinciden'; valid = false }
  return valid
}

async function handleRegister() {
  errorMsg.value = ''
  successMsg.value = ''
  if (!validateForm()) return
  const result = await authStore.register(form)
  if (result.success) {
    router.push('/dashboard')
  } else {
    if (result.errors?.length) {
      result.errors.forEach((e) => { if (fieldErrors.hasOwnProperty(e.field)) fieldErrors[e.field] = e.message })
    } else {
      errorMsg.value = result.message
    }
  }
}
</script>
