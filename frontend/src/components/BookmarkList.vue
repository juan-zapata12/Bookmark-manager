<template>
  <div class="section-card">
    <BookmarkSearch
      v-model="searchQuery"
      v-model:sortBy="sortBy"
      :onlyFavorites="showOnlyFavorites"
      :total="bookmarkStore.bookmarks.length"
      @toggle-favorites="showOnlyFavorites = !showOnlyFavorites"
      @export="bookmarkStore.exportToJson()"
    />

    <div class="results-info">
      <span class="count-label">
        {{ filteredBookmarks.length }} de {{ bookmarkStore.bookmarks.length }} bookmarks
        <span v-if="searchQuery"> — buscando "<strong>{{ searchQuery }}</strong>"</span>
        <span v-if="showOnlyFavorites"> — solo favoritos</span>
      </span>
    </div>

    <div v-if="bookmarkStore.loading && bookmarkStore.bookmarks.length === 0" class="empty-state">
      <div class="spinner large"></div>
      <p>Cargando bookmarks...</p>
    </div>

    <div v-else-if="filteredBookmarks.length === 0 && bookmarkStore.bookmarks.length > 0" class="empty-state">
      <SearchX :size="36" class="empty-svg-icon" />
      <p>No se encontraron resultados para "<strong>{{ searchQuery }}</strong>"</p>
      <button class="btn-secondary" style="margin-top:0.5rem"
        @click="searchQuery = ''; showOnlyFavorites = false">
        Limpiar filtros
      </button>
    </div>

    <div v-else-if="bookmarkStore.bookmarks.length === 0" class="empty-state">
      <BookmarkX :size="36" class="empty-svg-icon" />
      <p>No tienes bookmarks aún. ¡Agrega el primero!</p>
    </div>

    <div v-else class="bookmark-list">
      <BookmarkCard
        v-for="bookmark in filteredBookmarks"
        :key="bookmark._id"
        :bookmark="bookmark"
        @toggle-favorite="bookmarkStore.toggleFavorite($event)"
        @edit="$emit('edit', $event)"
        @delete="handleDelete"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useBookmarkStore } from '../stores/bookmarkStore'
import { SearchX, BookmarkX } from 'lucide-vue-next'
import BookmarkCard from './BookmarkCard.vue'
import BookmarkSearch from './BookmarkSearch.vue'

defineEmits(['edit'])

const bookmarkStore = useBookmarkStore()
const searchQuery = ref('')
const showOnlyFavorites = ref(false)
const sortBy = ref('date_desc')

const filteredBookmarks = computed(() => {
  let list = [...bookmarkStore.bookmarks]
  if (showOnlyFavorites.value) list = list.filter((b) => b.favorite)
  if (searchQuery.value.trim()) {
    const q = searchQuery.value.toLowerCase()
    list = list.filter(
      (b) =>
        b.title.toLowerCase().includes(q) ||
        b.url.toLowerCase().includes(q) ||
        (b.description && b.description.toLowerCase().includes(q))
    )
  }
  if (sortBy.value === 'date_desc') list.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
  if (sortBy.value === 'date_asc') list.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
  if (sortBy.value === 'title_asc') list.sort((a, b) => a.title.localeCompare(b.title))
  if (sortBy.value === 'title_desc') list.sort((a, b) => b.title.localeCompare(a.title))
  if (sortBy.value === 'favorites') list.sort((a, b) => Number(b.favorite) - Number(a.favorite))
  return list
})

async function handleDelete(id) {
  if (!confirm('¿Seguro que quieres eliminar este bookmark?')) return
  await bookmarkStore.removeBookmark(id)
}
</script>
