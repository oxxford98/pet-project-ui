<template>
  <Toast />

  <div class="flex justify-between items-center mb-4">
    <div class="font-semibold text-xl">Mis Mascotas</div>
    <Button
      label="Registrar Mascota"
      icon="pi pi-plus"
      severity="success"
      @click="$router.push({ path: '/admin/new-pet' })"
    />
  </div>

  <div v-if="loading" class="flex justify-center items-center p-8">
    <ProgressSpinner />
  </div>

  <Message v-else-if="!pets.length" severity="info" class="w-full">
    No tienes mascotas registradas aún.
  </Message>

  <div v-else class="grid grid-cols-12 gap-4">
    <div
      v-for="pet in pets"
      :key="pet.id"
      class="col-span-12 md:col-span-6 xl:col-span-4"
    >
      <Card>
        <template #header>
          <div
            class="w-full h-40 bg-surface-200 border-1 border-surface-300 rounded flex items-center justify-center"
          >
            <i class="pi pi-image text-4xl text-surface-500"></i>
          </div>
        </template>

        <template #content>
          <div class="mb-2">
            <div class="text-lg font-semibold">{{ pet.name }}</div>
            <div class="text-surface-500">Raza: {{ pet.breed }}</div>
          </div>

          <div class="text-sm space-y-1">
            <div>
              <span class="font-medium">Fecha de nacimiento:</span>
              <span class="ml-1">{{ formatDate(pet.birth_date) }}</span>
            </div>
            <div>
              <span class="font-medium">Talla:</span>
              <span class="ml-1">{{ sizeLabel(pet.size) }}</span>
            </div>
          </div>
        </template>

        <template #footer>
          <div class="flex justify-end">
            <Button
              v-if="!pet.is_matriculated"
              label="Matricular"
              icon="pi pi-check-circle"
              severity="success"
              @click="handleAction(pet)"
            />
            <Button
              v-else
              label="Ver matrícula activa"
              icon="pi pi-eye"
              severity="primary"
              outlined
              @click="handleAction(pet)"
            />
          </div>
        </template>
      </Card>
    </div>
  </div>

  <PlanModal
    v-model:visible="showPlans"
    :petId="selectedPetId"
    @enrolled="onEnrolled"
    @error="onError"
  />
</template>

<script>
import Card from 'primevue/card'
import Button from 'primevue/button'
import Toast from 'primevue/toast'
import Message from 'primevue/message'
import ProgressSpinner from 'primevue/progressspinner'
import { useToast } from 'primevue/usetoast'
import ApiService from '@/service/ApiService'
import PlanModal from './components/PlanModal.vue'

export default {
  name: 'ListPets',
  components: {
    Card,
    Button,
    Toast,
    Message,
    ProgressSpinner,
    PlanModal
  },
  data() {
    return {
      toast: null,
      loading: false,
      pets: [],
      showPlans: false,         
      selectedPetId: null
    }
  },
  methods: {
    sizeLabel(val) {
      const map = { 1: 'Pequeño', 2: 'Mediano', 3: 'Grande' }
      return map[val] || 'N/D'
    },
    formatDate(iso) {
      if (!iso) return 'N/D'
      const d = new Date(iso)
      if (Number.isNaN(d.getTime())) return iso
      const dd = String(d.getDate()).padStart(2, '0')
      const mm = String(d.getMonth() + 1).padStart(2, '0')
      const yyyy = d.getFullYear()
      return `${dd}/${mm}/${yyyy}`
    },
    async loadPets() {
      this.loading = true
      try {
        ApiService.setHeader()
        const { data } = await ApiService.get('/canine/by-client')
        this.pets = (Array.isArray(data) ? data : []).map(p => ({
          ...p,
          is_matriculated: p.is_matriculated ?? false
        }))
      } catch (error) {
        console.error('Error cargando mascotas:', error)
        this.toast.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No se pudieron cargar las mascotas',
          life: 3000
        })
      } finally {
        this.loading = false
      }
    },
    handleAction(pet) {
      if (!pet.is_matriculated) {
        this.selectedPetId = pet.id
        this.showPlans = true
      } else {
        this.$router.push({ name: 'enrollment-detail', params: { canineId: pet.id } })
      }
    },
     async onEnrolled() { 
      this.toast.add({
        severity: 'success',
        summary: 'Éxito',
        detail: 'Matrícula creada correctamente',
        life: 2500
      })
      this.showPlans = false
      await this.loadPets()
    },
    onError(msg) { 
      this.toast.add({
        severity: 'error',
        summary: 'Error',
        detail: msg || 'No se pudo realizar la matrícula',
        life: 3000
      })
    }
  },
  mounted() {
    this.toast = useToast()
    this.loadPets()
  }
}
</script>