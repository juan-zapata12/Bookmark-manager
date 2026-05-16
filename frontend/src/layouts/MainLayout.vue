<template>
  <div class="dashboard">
    <header class="dash-header">
      <div class="dash-brand">
        <img src="/LOGOBOOKSF.png" alt="Logo" style="height: 40px; width: auto;" />
        <span style="font-size: 1rem;">Bookmark Manager</span>
      </div>
      <div class="dash-user">
        <span>Hola, <strong>{{ authStore.currentUser?.name }}</strong></span>
        <span class="badge" :class="authStore.isAdmin ? 'badge-admin' : 'badge-user'">
          {{ authStore.currentUser?.role }}
        </span>
        <router-link v-if="authStore.isAdmin" to="/admin" class="btn-admin">
          <ShieldCheck :size="14" /> Panel Admin
        </router-link>
        <button class="btn-logout" @click="handleLogout">
          <LogOut :size="14" /> Cerrar sesión
        </button>
      </div>
    </header>
    <main class="dash-content">
      <slot />
    </main>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/authStore'
import { ShieldCheck, LogOut } from 'lucide-vue-next'

const router = useRouter()
const authStore = useAuthStore()

function handleLogout() {
  authStore.logout()
  router.push('/login')
}
</script>
