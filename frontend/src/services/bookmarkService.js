import api from './api'

export const bookmarkService = {
  async getAll() {
    const { data } = await api.get('/bookmarks')
    return data
  },

  async create(bookmarkData) {
    const { data } = await api.post('/bookmarks', bookmarkData)
    return data
  },

  async update(id, bookmarkData) {
    const { data } = await api.put(`/bookmarks/${id}`, bookmarkData)
    return data
  },

  async toggleFavorite(id) {
    const { data } = await api.patch(`/bookmarks/${id}/favorite`)
    return data
  },

  async remove(id) {
    const { data } = await api.delete(`/bookmarks/${id}`)
    return data
  },
}
