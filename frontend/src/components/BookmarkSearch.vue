<template>
  <div class="toolbar-row">
    <div class="search-wrap">
      <Search :size="15" class="search-icon-svg" />
      <input
        :value="modelValue"
        @input="$emit('update:modelValue', $event.target.value)"
        type="text"
        placeholder="Buscar por título o URL..."
        class="search-input"
      />
      <button v-if="modelValue" class="search-clear" @click="$emit('update:modelValue', '')">
        <X :size="13" />
      </button>
    </div>

    <div class="toolbar-actions">
      <button class="btn-filter" :class="{ active: onlyFavorites }" @click="$emit('toggle-favorites')">
        <Star :size="13" :fill="onlyFavorites ? 'currentColor' : 'none'" />
        {{ onlyFavorites ? 'Solo favoritos' : 'Favoritos' }}
      </button>

      <select :value="sortBy" @change="$emit('update:sortBy', $event.target.value)" class="sort-select">
        <option value="date_desc">Más reciente</option>
        <option value="date_asc">Más antiguo</option>
        <option value="title_asc">Título A-Z</option>
        <option value="title_desc">Título Z-A</option>
        <option value="favorites">Favoritos primero</option>
      </select>

      <button class="btn-export" @click="$emit('export')" :disabled="total === 0">
        <Download :size="13" /> Exportar JSON
      </button>
    </div>
  </div>
</template>

<script setup>
import { Search, X, Star, Download } from 'lucide-vue-next'

defineProps({
  modelValue: { type: String, default: '' },
  sortBy: { type: String, default: 'date_desc' },
  onlyFavorites: { type: Boolean, default: false },
  total: { type: Number, default: 0 },
})
defineEmits(['update:modelValue', 'update:sortBy', 'toggle-favorites', 'export'])
</script>
