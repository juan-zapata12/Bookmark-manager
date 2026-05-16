import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { authService } from '../services/authService'

export const useAuthStore = defineStore('auth', () => {
  // ─── Estado ──────────────────────────────────────────────────────
  const user = ref(JSON.parse(localStorage.getItem('user')) || null)
  const token = ref(localStorage.getItem('token') || null)
  const loading = ref(false)
  const error = ref(null)

  // ─── Getters (computed) ─────────────────────────────────────────
  const isAuthenticated = computed(() => !!token.value)
  const isAdmin = computed(() => user.value?.role === 'admin')
  const currentUser = computed(() => user.value)

  // ─── Acciones ───────────────────────────────────────────────────
  function setSession(userData, tokenValue) {
    user.value = userData
    token.value = tokenValue
    localStorage.setItem('user', JSON.stringify(userData))
    localStorage.setItem('token', tokenValue)
  }

  function clearSession() {
    user.value = null
    token.value = null
    localStorage.removeItem('user')
    localStorage.removeItem('token')
  }

  async function register(userData) {
    loading.value = true
    error.value = null
    try {
      const response = await authService.register(userData)
      setSession(response.data.user, response.data.token)
      return { success: true }
    } catch (err) {
      const message = err.response?.data?.message || 'Error al registrarse'
      const errors = err.response?.data?.errors || []
      error.value = message
      return { success: false, message, errors }
    } finally {
      loading.value = false
    }
  }

  async function login(credentials) {
    loading.value = true
    error.value = null
    try {
      const response = await authService.login(credentials)
      setSession(response.data.user, response.data.token)
      return { success: true }
    } catch (err) {
      const message = err.response?.data?.message || 'Credenciales inválidas'
      error.value = message
      return { success: false, message }
    } finally {
      loading.value = false
    }
  }

  function logout() {
    clearSession()
  }

  return {
    user, token, loading, error,
    isAuthenticated, isAdmin, currentUser,
    register, login, logout,
  }
})
