<template>
  <div class="section-card">
    <h2 class="section-title"><Bookmark :size="17" /> Todos los Bookmarks</h2>

    <div v-if="loading" class="empty-state">
      <div class="spinner large"></div>
    </div>

    <div v-else-if="bookmarks.length === 0" class="empty-state">
      <p>No hay bookmarks registrados.</p>
    </div>

    <div v-else class="table-wrap">
      <table class="admin-table">
        <thead>
          <tr>
            <th>Título</th>
            <th>URL</th>
            <th>Usuario</th>
            <th>Fecha</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="bookmark in bookmarks" :key="bookmark._id">
            <td>{{ bookmark.title }}</td>
            <td>
              <a :href="bookmark.url" target="_blank" class="bookmark-url table-link">
                {{ truncate(bookmark.url) }} <ExternalLink :size="11" />
              </a>
            </td>
            <td>
              <div class="user-cell">
                <span>{{ bookmark.user?.name }}</span>
                <span
                  class="badge"
                  :class="bookmark.user?.role === 'admin' ? 'badge-admin' : 'badge-user'"
                  style="font-size: 0.6rem"
                >
                  {{ bookmark.user?.role }}
                </span>
              </div>
            </td>
            <td>{{ formatDate(bookmark.createdAt) }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { Bookmark, ExternalLink } from 'lucide-vue-next'

defineProps({
  bookmarks: { type: Array, required: true },
  loading: { type: Boolean, default: false },
})

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString('es-CO', {
    day: '2-digit', month: 'short', year: 'numeric',
  })
}

function truncate(str, n = 40) {
  return str.length > n ? str.slice(0, n) + '...' : str
}
</script>
