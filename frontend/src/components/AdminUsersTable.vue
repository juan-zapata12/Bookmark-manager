<template>
  <div class="section-card">
    <h2 class="section-title"><Users :size="17" /> Gestión de Usuarios</h2>

    <div v-if="loading" class="empty-state">
      <div class="spinner large"></div>
    </div>

    <div v-else-if="users.length === 0" class="empty-state">
      <p>No hay usuarios registrados.</p>
    </div>

    <div v-else class="table-wrap">
      <table class="admin-table">
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Email</th>
            <th>Rol</th>
            <th>Registrado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="user in users"
            :key="user._id"
            :class="{ 'row-self': user._id === currentUserId }"
          >
            <td>{{ user.name }}</td>
            <td>{{ user.email }}</td>
            <td>
              <span class="badge" :class="user.role === 'admin' ? 'badge-admin' : 'badge-user'">
                {{ user.role }}
              </span>
            </td>
            <td>{{ formatDate(user.createdAt) }}</td>
            <td>
              <div class="table-actions" v-if="user._id !== currentUserId">
                <button class="btn-role" @click="$emit('role-change', user._id)">
                  <ShieldCheck v-if="user.role !== 'admin'" :size="13" />
                  <ShieldOff v-else :size="13" />
                  {{ user.role === 'admin' ? 'Quitar admin' : 'Hacer admin' }}
                </button>
                <button class="btn-delete-sm" @click="$emit('delete', user._id)">
                  <Trash2 :size="13" /> Eliminar
                </button>
              </div>
              <span v-else class="self-label">Tú</span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { Users, ShieldCheck, ShieldOff, Trash2 } from 'lucide-vue-next'

defineProps({
  users: { type: Array, required: true },
  currentUserId: { type: String, required: true },
  loading: { type: Boolean, default: false },
})

defineEmits(['role-change', 'delete'])

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString('es-CO', {
    day: '2-digit', month: 'short', year: 'numeric',
  })
}
</script>
