<template>
  <MainLayout>
    <BookmarkForm />
    <BookmarkList @edit="openEdit" />
    <EditModal v-if="editingBookmark" :bookmark="editingBookmark" @close="editingBookmark = null" />
  </MainLayout>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import MainLayout from '../layouts/MainLayout.vue'
import BookmarkForm from '../components/BookmarkForm.vue'
import BookmarkList from '../components/BookmarkList.vue'
import EditModal from '../components/EditModal.vue'
import { useBookmarkStore } from '../stores/bookmarkStore'

const bookmarkStore = useBookmarkStore()
const editingBookmark = ref(null)

onMounted(() => bookmarkStore.fetchBookmarks())

function openEdit(bookmark) {
  editingBookmark.value = bookmark
}
</script>
