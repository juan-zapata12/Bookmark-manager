import { defineStore } from 'pinia'
import { ref } from 'vue'
import { bookmarkService } from '../services/bookmarkService'

export const useBookmarkStore = defineStore('bookmarks', () => {
  const bookmarks = ref([])
  const loading = ref(false)
  const error = ref(null)

  async function fetchBookmarks() {
    loading.value = true
    error.value = null
    try {
      const response = await bookmarkService.getAll()
      bookmarks.value = response.data
    } catch (err) {
      error.value = err.response?.data?.message || 'Error al cargar bookmarks'
    } finally {
      loading.value = false
    }
  }

  async function addBookmark(bookmarkData) {
    loading.value = true
    error.value = null
    try {
      const response = await bookmarkService.create(bookmarkData)
      bookmarks.value.unshift(response.data)
      return { success: true }
    } catch (err) {
      const message = err.response?.data?.message || 'Error al crear bookmark'
      const errors = err.response?.data?.errors || []
      return { success: false, message, errors }
    } finally {
      loading.value = false
    }
  }

  async function editBookmark(id, bookmarkData) {
    loading.value = true
    try {
      const response = await bookmarkService.update(id, bookmarkData)
      const index = bookmarks.value.findIndex((b) => b._id === id)
      if (index !== -1) bookmarks.value[index] = response.data
      return { success: true }
    } catch (err) {
      const message = err.response?.data?.message || 'Error al editar bookmark'
      const errors = err.response?.data?.errors || []
      return { success: false, message, errors }
    } finally {
      loading.value = false
    }
  }

  async function toggleFavorite(id) {
    try {
      const response = await bookmarkService.toggleFavorite(id)
      const index = bookmarks.value.findIndex((b) => b._id === id)
      if (index !== -1) bookmarks.value[index] = response.data
      return { success: true }
    } catch (err) {
      return { success: false, message: err.response?.data?.message || 'Error al actualizar favorito' }
    }
  }

  async function removeBookmark(id) {
    try {
      await bookmarkService.remove(id)
      bookmarks.value = bookmarks.value.filter((b) => b._id !== id)
      return { success: true }
    } catch (err) {
      return { success: false, message: err.response?.data?.message || 'Error al eliminar' }
    }
  }

  // Exportar bookmarks a JSON y descargar
  function exportToJson() {
    const data = bookmarks.value.map((b) => ({
      title: b.title,
      url: b.url,
      description: b.description,
      favorite: b.favorite,
      createdAt: b.createdAt,
    }))
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `bookmarks_${new Date().toISOString().slice(0, 10)}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  return {
    bookmarks, loading, error,
    fetchBookmarks, addBookmark, editBookmark,
    toggleFavorite, removeBookmark, exportToJson,
  }
})
