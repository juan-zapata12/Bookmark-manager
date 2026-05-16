<template>
  <div class="dashboard">
    <header class="dash-header">
      <div class="dash-brand">
        <img src="/LOGOBOOKSF.png" alt="Logo" style="height: 40px; width: auto;" />
        <span style="font-size: 1rem;">Panel de Administración</span>
      </div>
      <div class="dash-user">
        <span><strong>{{ authStore.currentUser?.name }}</strong></span>
        <span class="badge badge-admin">admin</span>
        <router-link to="/dashboard" class="btn-admin">
          <ArrowLeft :size="13" /> Dashboard
        </router-link>
        <button class="btn-logout" @click="handleLogout">
          <LogOut :size="13" /> Cerrar sesión
        </button>
      </div>
    </header>

    <main class="dash-content">
      <AdminStats :users="users" :bookmarks="allBookmarks" />

      <AdminUsersTable
        :users="users"
        :currentUserId="authStore.currentUser?._id"
        :loading="loadingUsers"
        @role-change="handleRoleChange"
        @delete="handleDeleteUser"
      />

      <AdminBookmarksTable
        :bookmarks="allBookmarks"
        :loading="loadingBookmarks"
      />
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/authStore'
import { adminService } from '../services/adminService'
import { ArrowLeft, LogOut } from 'lucide-vue-next'
import AdminStats from '../components/AdminStats.vue'
import AdminUsersTable from '../components/AdminUsersTable.vue'
import AdminBookmarksTable from '../components/AdminBookmarksTable.vue'

const router = useRouter()
const authStore = useAuthStore()

const users = ref([])
const allBookmarks = ref([])
const loadingUsers = ref(false)
const loadingBookmarks = ref(false)

onMounted(async () => {
  loadingUsers.value = true
  loadingBookmarks.value = true
  try {
    const [usersRes, bookmarksRes] = await Promise.all([
      adminService.getUsers(),
      adminService.getAllBookmarks(),
    ])
    users.value = usersRes.data
    allBookmarks.value = bookmarksRes.data
  } finally {
    loadingUsers.value = false
    loadingBookmarks.value = false
  }
})

async function handleRoleChange(userId) {
  const result = await adminService.changeRole(userId)
  const index = users.value.findIndex((u) => u._id === userId)
  if (index !== -1) users.value[index] = result.data
}

async function handleDeleteUser(userId) {
  if (!confirm('¿Eliminar este usuario y todos sus bookmarks?')) return
  await adminService.deleteUser(userId)
  users.value = users.value.filter((u) => u._id !== userId)
  allBookmarks.value = allBookmarks.value.filter((b) => b.user?._id !== userId)
}

function handleLogout() {
  authStore.logout()
  router.push('/login')
}
</script>
