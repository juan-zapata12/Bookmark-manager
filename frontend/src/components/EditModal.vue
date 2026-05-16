<template>
  <div class="modal-overlay" @click.self="$emit('close')">
    <div class="modal">
      <div class="modal-header">
        <h3><Pencil :size="16" /> Editar Bookmark</h3>
        <button class="modal-close" @click="$emit('close')">
          <X :size="16" />
        </button>
      </div>

      <div v-if="error" class="alert alert-error">
        <AlertCircle :size="14" /> {{ error }}
      </div>

      <div class="form-group">
        <label>URL</label>
        <div class="url-input-wrap">
          <input v-model="localForm.url" type="text" @input="validateUrl"
            :class="{ 'input-error': urlError, 'input-valid': urlValid }" />
          <span class="url-badge" v-if="urlValid"><Check :size="11" /> Válida</span>
          <span class="url-badge url-badge-error" v-if="urlError"><X :size="11" /> Inválida</span>
        </div>
        <span v-if="urlError" class="field-error">{{ urlError }}</span>
      </div>

      <div class="form-group">
        <label>Título</label>
        <input v-model="localForm.title" type="text" />
      </div>

      <div class="form-group">
        <label>Descripción <span class="optional">(opcional)</span></label>
        <input v-model="localForm.description" type="text" />
      </div>

      <div class="modal-footer">
        <button class="btn-secondary" @click="$emit('close')">Cancelar</button>
        <button class="btn-primary" @click="handleSave" :disabled="loading">
          <span v-if="loading" class="spinner"></span>
          <Save v-else :size="14" />
          {{ loading ? 'Guardando...' : 'Guardar cambios' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, watch } from 'vue'
import { useBookmarkStore } from '../stores/bookmarkStore'
import { Pencil, X, Check, AlertCircle, Save } from 'lucide-vue-next'

const props = defineProps({
  bookmark: { type: Object, required: true },
})
const emit = defineEmits(['close'])

const bookmarkStore = useBookmarkStore()
const loading = ref(false)
const error = ref('')
const urlError = ref('')
const urlValid = ref(false)
const localForm = reactive({ url: '', title: '', description: '' })

watch(() => props.bookmark, (val) => {
  localForm.url = val.url
  localForm.title = val.title
  localForm.description = val.description || ''
  urlValid.value = true
  error.value = ''
  urlError.value = ''
}, { immediate: true })

function validateUrl() {
  urlError.value = ''
  urlValid.value = false
  if (!localForm.url) return
  try { new URL(localForm.url); urlValid.value = true }
  catch { urlError.value = 'La URL no es válida (debe incluir https://)' }
}

async function handleSave() {
  error.value = ''
  if (urlError.value) return
  if (!localForm.title.trim()) { error.value = 'El título es requerido'; return }
  loading.value = true
  const result = await bookmarkStore.editBookmark(props.bookmark._id, localForm)
  loading.value = false
  if (result.success) emit('close')
  else error.value = result.message
}
</script>
