<template>
  <div class="section-card">
    <h2 class="section-title">
      <Plus :size="18" /> Agregar Bookmark
    </h2>

    <div v-if="formError" class="alert alert-error">
      <AlertCircle :size="15" /> {{ formError }}
    </div>
    <div v-if="formSuccess" class="alert alert-success">
      <CheckCircle :size="15" /> {{ formSuccess }}
    </div>

    <div class="form-grid">
      <div class="form-group">
        <label>URL</label>
        <div class="url-input-wrap">
          <input
            v-model="form.url"
            type="text"
            placeholder="https://ejemplo.com"
            :class="{ 'input-error': urlError, 'input-valid': urlValid }"
            @input="validateUrl"
          />
          <span class="url-badge" v-if="urlValid">
            <Check :size="11" /> Válida
          </span>
          <span class="url-badge url-badge-error" v-if="urlError && form.url">
            <X :size="11" /> Inválida
          </span>
        </div>
        <span v-if="urlError" class="field-error">{{ urlError }}</span>
      </div>

      <div class="form-group">
        <label>Título</label>
        <input
          v-model="form.title"
          type="text"
          placeholder="Nombre del bookmark"
          :class="{ 'input-error': titleError }"
        />
        <span v-if="titleError" class="field-error">{{ titleError }}</span>
      </div>

      <div class="form-group full-width">
        <label>Descripción <span class="optional">(opcional)</span></label>
        <input v-model="form.description" type="text" placeholder="Breve descripción del enlace" />
      </div>
    </div>

    <button class="btn-primary" @click="handleAdd" :disabled="bookmarkStore.loading">
      <span v-if="bookmarkStore.loading" class="spinner"></span>
      <Save v-else :size="15" />
      {{ bookmarkStore.loading ? 'Guardando...' : 'Guardar Bookmark' }}
    </button>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useBookmarkStore } from '../stores/bookmarkStore'
import { Plus, Check, X, AlertCircle, CheckCircle, Save } from 'lucide-vue-next'

const bookmarkStore = useBookmarkStore()
const form = reactive({ url: '', title: '', description: '' })
const formError = ref('')
const formSuccess = ref('')
const urlError = ref('')
const urlValid = ref(false)
const titleError = ref('')

function validateUrl() {
  urlError.value = ''
  urlValid.value = false
  if (!form.url) return
  try { new URL(form.url); urlValid.value = true }
  catch { urlError.value = 'La URL no es válida (debe incluir https://)' }
}

async function handleAdd() {
  formError.value = ''
  formSuccess.value = ''
  urlError.value = ''
  titleError.value = ''
  if (!form.url) { urlError.value = 'La URL es requerida'; return }
  if (!urlValid.value) return
  if (!form.title.trim()) { titleError.value = 'El título es requerido'; return }

  const result = await bookmarkStore.addBookmark(form)
  if (result.success) {
    formSuccess.value = '¡Bookmark guardado exitosamente!'
    form.url = ''; form.title = ''; form.description = ''
    urlValid.value = false
    setTimeout(() => (formSuccess.value = ''), 3000)
  } else {
    if (result.errors?.length) {
      result.errors.forEach((e) => {
        if (e.field === 'url') urlError.value = e.message
        if (e.field === 'title') titleError.value = e.message
      })
    } else {
      formError.value = result.message
    }
  }
}
</script>
