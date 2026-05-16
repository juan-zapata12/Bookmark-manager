import api from './api'

export const adminService = {
  async getUsers() {
    const { data } = await api.get('/admin/users')
    return data
  },

  async changeRole(userId) {
    const { data } = await api.patch(`/admin/users/${userId}/role`)
    return data
  },

  async deleteUser(userId) {
    const { data } = await api.delete(`/admin/users/${userId}`)
    return data
  },

  async getAllBookmarks() {
    const { data } = await api.get('/admin/bookmarks')
    return data
  },
}
