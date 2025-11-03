<template>
  <Toast />

  <Card>
    <template #header>
      <div class="p-4">
        <div class="font-semibold text-xl">Registrar Mascota</div>
      </div>
    </template>

    <template #content>
      <div class="grid grid-cols-2 gap-4">
        <FloatLabel class="my-4">
          <InputText
            id="name"
            class="w-full"
            v-model="form.name"
            :invalid="validate && !form.name"
          />
          <label for="name">Nombre *</label>
        </FloatLabel>

        <FloatLabel class="my-4">
          <InputText
            id="breed"
            class="w-full"
            v-model="form.breed"
            :invalid="validate && !form.breed"
          />
          <label for="breed">Raza *</label>
        </FloatLabel>

        <FloatLabel class="my-4">
          <Select
            id="size"
            class="w-full"
            v-model="form.size"
            :options="sizeOptions"
            optionLabel="name"
            optionValue="id"
            :invalid="validate && !form.size"
          >
            <template #empty>No hay opciones</template>
          </Select>
          <label for="size">Seleccione Talla *</label>
        </FloatLabel>

        <FloatLabel class="my-4">
          <DatePicker
            id="birth_date"
            v-model="form.birth_date"
            class="w-full"
            dateFormat="dd/mm/yy"
            :maxDate="today"
            :invalid="validate && !form.birth_date"
          />
          <label for="birth_date">Fecha de Nacimiento *</label>
        </FloatLabel>
      </div>

      <Message
        v-if="validate && !isFormValidBasic"
        severity="error"
        size="small"
        class="mt-2"
      >
        Por favor complete los campos obligatorios.
      </Message>
    </template>

    <template #footer>
      <div class="flex justify-end gap-2 p-4">
        <Button
          label="Limpiar"
          icon="pi pi-replay"
          severity="secondary"
          outlined
          @click="resetForm"
        />
        <Button
          label="Guardar"
          icon="pi pi-save"
          :loading="saving"
          @click="submit"
        />
      </div>
    </template>
  </Card>
</template>

<script>
import Card from 'primevue/card'
import InputText from 'primevue/inputtext'
import FloatLabel from 'primevue/floatlabel'
import Select from 'primevue/select'
import DatePicker from 'primevue/datepicker'
import Button from 'primevue/button'
import Message from 'primevue/message'
import Toast from 'primevue/toast'
import { useToast } from 'primevue/usetoast'
import ApiService from '@/service/ApiService'

export default {
  name: 'NewPet',
  components: {
    Card,
    InputText,
    FloatLabel,
    Select,
    DatePicker,
    Button,
    Message,
    Toast
  },
  data() {
    return {
      toast: null,
      saving: false,
      validate: false,
      today: new Date(),
      form: {
        name: '',
        breed: '',
        size: null,        // 1: Pequeño, 2: Mediano, 3: Grande
        birth_date: null   
      },
      sizeOptions: [
        { id: 1, name: 'Pequeño' },
        { id: 2, name: 'Mediano' },
        { id: 3, name: 'Grande' }
      ]
    }
  },
  computed: {
    isFormValidBasic() {
      return !!(this.form.name && this.form.breed && this.form.size && this.form.birth_date)
    }
  },
  methods: {
    resetForm() {
      this.form = {
        name: '',
        breed: '',
        size: null,
        birth_date: null
      }
      this.validate = false
    },
    formatDateToYMD(date) {
      if (!date) return null
      const d = typeof date === 'string' ? new Date(date) : date
      const yyyy = d.getFullYear()
      const mm = String(d.getMonth() + 1).padStart(2, '0')
      const dd = String(d.getDate()).padStart(2, '0')
      return `${yyyy}-${mm}-${dd}`
    },
    async submit() {
      this.validate = true
      if (!this.isFormValidBasic) {
        this.toast.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Complete los campos obligatorios',
          life: 3000
        })
        return
      }

      this.saving = true
      try {
        ApiService.setHeader()

        const payload = {
          name: this.form.name,
          breed: this.form.breed,
          size: this.form.size,
          birth_date: this.formatDateToYMD(this.form.birth_date)
        }

        await ApiService.post('/canine/', payload)

        this.toast.add({
          severity: 'success',
          summary: 'Éxito',
          detail: 'Mascota creada correctamente',
          life: 2500
        })
        this.resetForm()
      } catch (error) {
        console.error('Error creando mascota:', error)
        this.toast.add({
          severity: 'error',
          summary: 'Error',
          detail: error.response?.data?.detail || 'No se pudo crear la mascota',
          life: 3500
        })
      } finally {
        this.saving = false
      }
    }
  },
  mounted() {
    this.toast = useToast()
    ApiService.setHeader()
  }
}
</script>