<template>
  <div class="stats-grid">
    <div class="stat-card">
      <Users :size="24" class="stat-icon" />
      <div class="stat-number">{{ users.length }}</div>
      <div class="stat-label">Usuarios registrados</div>
    </div>
    <div class="stat-card">
      <Bookmark :size="24" class="stat-icon" />
      <div class="stat-number">{{ bookmarks.length }}</div>
      <div class="stat-label">Bookmarks totales</div>
    </div>
    <div class="stat-card">
      <ShieldCheck :size="24" class="stat-icon" />
      <div class="stat-number">{{ adminCount }}</div>
      <div class="stat-label">Administradores</div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { Users, Bookmark, ShieldCheck } from 'lucide-vue-next'

const props = defineProps({
  users: { type: Array, required: true },
  bookmarks: { type: Array, required: true },
})

const adminCount = computed(() => props.users.filter((u) => u.role === 'admin').length)
</script>
