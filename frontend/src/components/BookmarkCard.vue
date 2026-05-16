<template>
  <div class="bookmark-card" :class="{ 'bookmark-favorite': bookmark.favorite }">
    <div class="bookmark-favicon">
      <img
        :src="`https://www.google.com/s2/favicons?domain=${getDomain(bookmark.url)}&sz=32`"
        alt="favicon"
        @error="(e) => (e.target.style.display = 'none')"
      />
    </div>

    <div class="bookmark-info">
      <a :href="bookmark.url" target="_blank" class="bookmark-title">
        {{ bookmark.title }}
        <ExternalLink :size="11" class="link-icon" />
      </a>
      <span class="bookmark-url">{{ bookmark.url }}</span>
      <span v-if="bookmark.description" class="bookmark-desc">{{ bookmark.description }}</span>
    </div>

    <div class="bookmark-meta">
      <span class="bookmark-date">{{ formatDate(bookmark.createdAt) }}</span>
      <div class="bookmark-actions">
        <button
          class="btn-fav"
          :class="{ 'is-fav': bookmark.favorite }"
          @click="$emit('toggle-favorite', bookmark._id)"
          title="Favorito"
        >
          <Star :size="15" :fill="bookmark.favorite ? 'currentColor' : 'none'" />
        </button>
        <button class="btn-edit" @click="$emit('edit', bookmark)" title="Editar">
          <Pencil :size="14" />
        </button>
        <button class="btn-delete" @click="$emit('delete', bookmark._id)" title="Eliminar">
          <Trash2 :size="14" />
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ExternalLink, Star, Pencil, Trash2 } from 'lucide-vue-next'

defineProps({
  bookmark: { type: Object, required: true },
})
defineEmits(['toggle-favorite', 'edit', 'delete'])

function getDomain(url) {
  try { return new URL(url).hostname } catch { return '' }
}

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString('es-CO', {
    day: '2-digit', month: 'short', year: 'numeric',
  })
}
</script>
