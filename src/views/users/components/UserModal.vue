<template>
  <Dialog 
    v-model:visible="dialogVisible" 
    :header="isEditing ? 'Editar Usuario' : 'Crear Usuario'" 
    modal 
    :style="{ width: '50vw' }" 
    :breakpoints="{ '1199px': '75vw', '575px': '90vw' }"
    @hide="closeModal"
  >
    <div class="grid grid-cols-2 gap-4">
      <FloatLabel class="my-4">
        <InputText 
          class="w-full" 
          id="first_name" 
          v-model="formData.first_name" 
          :invalid="validate && !formData.first_name" 
        />
        <label for="first_name">Primer Nombre *</label>
      </FloatLabel>

      <FloatLabel class="my-4">
        <InputText 
          class="w-full" 
          id="second_name" 
          v-model="formData.second_name" 
        />
        <label for="second_name">Segundo Nombre</label>
      </FloatLabel>

      <FloatLabel class="my-4">
        <InputText 
          class="w-full" 
          id="last_name" 
          v-model="formData.last_name" 
          :invalid="validate && !formData.last_name" 
        />
        <label for="last_name">Primer Apellido *</label>
      </FloatLabel>

      <FloatLabel class="my-4">
        <InputText 
          class="w-full" 
          id="second_last_name" 
          v-model="formData.second_last_name" 
        />
        <label for="second_last_name">Segundo Apellido</label>
      </FloatLabel>

      <FloatLabel class="my-4">
        <InputText 
          class="w-full" 
          id="identification" 
          v-model="formData.identification" 
          :invalid="validate && !formData.identification" 
        />
        <label for="identification">Número de Identificación *</label>
      </FloatLabel>

      <FloatLabel class="my-4">
        <InputText 
          class="w-full" 
          id="cellphone" 
          v-model="formData.cellphone" 
        />
        <label for="cellphone">Celular</label>
      </FloatLabel>

      <FloatLabel class="my-4 col-span-2">
        <InputText 
          class="w-full" 
          id="email" 
          type="email"
          v-model="formData.email" 
          :invalid="validate && validateEmail()" 
        />
        <label for="email">Correo Electrónico *</label>
      </FloatLabel>
      <Message v-if="validate && validateEmail()" severity="error" size="small" class="col-span-2">
        Debes indicar un email válido
      </Message>

      <FloatLabel class="my-4 col-span-2">
        <Select 
          v-model="formData.role" 
          :options="roles" 
          optionLabel="name" 
          optionValue="id" 
          placeholder="Seleccione un rol" 
          class="w-full" 
          :invalid="validate && !formData.role"
          filter
          :loading="loadingRoles"
        >
          <template #empty>
            No hay roles disponibles
          </template>
        </Select>
        <label for="role">Rol *</label>
      </FloatLabel>

      <div class="col-span-2 flex items-center my-4" v-if="isEditing">
        <span class="mr-2">Cambiar contraseña?</span>
        <ToggleSwitch v-model="changePassword" />
      </div>

      <FloatLabel class="my-4" v-if="changePassword || !isEditing">
        <Password 
          inputClass="w-full"
          class="w-full" 
          v-model="formData.password" 
          toggleMask
          :feedback="false"
          :invalid="validate && (!formData.password || formData.password !== formData.password_confirm)" 
        >
          <template #header>
            <h6>Ingrese una contraseña</h6>
          </template>
        </Password>
        <label for="password">Contraseña *</label>
      </FloatLabel>

      <FloatLabel class="my-4" v-if="changePassword || !isEditing">
        <Password 
          inputClass="w-full"
          class="w-full" 
          v-model="formData.password_confirm" 
          toggleMask
          :feedback="false"
          :invalid="validate && (formData.password !== formData.password_confirm)" 
        />
        <label for="password_confirm">Confirmar Contraseña *</label>
      </FloatLabel>
      <Message v-if="validate && formData.password !== formData.password_confirm" severity="error" size="small" class="col-span-2">
        Las contraseñas no coinciden
      </Message>
    </div>

    <template #footer>
      <Button 
        label="Cancelar" 
        icon="pi pi-times" 
        @click="closeModal" 
        severity="secondary"
        outlined
      />
      <Button 
        :label="isEditing ? 'Actualizar' : 'Crear'" 
        icon="pi pi-check" 
        @click="saveUser" 
        :loading="saving"
      />
    </template>
  </Dialog>
</template>

<script>
import Dialog from 'primevue/dialog'
import InputText from 'primevue/inputtext'
import FloatLabel from 'primevue/floatlabel'
import Select from 'primevue/select'
import Password from 'primevue/password'
import Button from 'primevue/button'
import Message from 'primevue/message'
import ToggleSwitch from 'primevue/toggleswitch'
import ApiService from '@/service/ApiService'

export default {
  name: 'UserModal',
  components: {
    Dialog,
    InputText,
    FloatLabel,
    Select,
    Password,
    Button,
    Message,
    ToggleSwitch
  },
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    userData: {
      type: Object,
      default: null
    }
  },
  emits: ['update:visible', 'saved', 'error'],
  data() {
    return {
      formData: {
        first_name: '',
        second_name: '',
        last_name: '',
        second_last_name: '',
        identification: '',
        cellphone: '',
        email: '',
        role: null,
        password: '',
        password_confirm: ''
      },
      roles: [],
      changePassword: false,
      validate: false,
      saving: false,
      loadingRoles: false
    }
  },
  computed: {
    isEditing() {
      return !!this.userData
    },
    // ✅ Computed property para manejar v-model
    dialogVisible: {
      get() {
        return this.visible
      },
      set(value) {
        this.$emit('update:visible', value)
      }
    }
  },
  watch: {
    visible(newVal) {
      if (newVal) {
        this.loadRoles()
        if (this.userData) {
          this.loadUserData()
        } else {
          this.resetForm()
        }
      }
    }
  },
  methods: {
    async loadRoles() {
      this.loadingRoles = true
      try {
        const { data } = await ApiService.get('/roles/to-create-intern-user')
        this.roles = data
      } catch (error) {
        console.error('Error al cargar roles:', error)
        this.$emit('error', 'No se pudieron cargar los roles')
      } finally {
        this.loadingRoles = false
      }
    },
    loadUserData() {
      this.formData = {
        first_name: this.userData.first_name || '',
        second_name: this.userData.second_name || '',
        last_name: this.userData.last_name || '',
        second_last_name: this.userData.second_last_name || '',
        identification: this.userData.identification_document || '',
        cellphone: this.userData.cellphone || '',
        email: this.userData.email || '',
        role: this.userData.role || null,
        password: '',
        password_confirm: ''
      }
      this.changePassword = false
      this.validate = false
    },
    resetForm() {
      this.formData = {
        first_name: '',
        second_name: '',
        last_name: '',
        second_last_name: '',
        identification: '',
        cellphone: '',
        email: '',
        role: null,
        password: '',
        password_confirm: ''
      }
      this.changePassword = false
      this.validate = false
    },
    validateEmail() {
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      return this.formData.email && !emailPattern.test(this.formData.email)
    },
    validateForm() {
      this.validate = true

      // Validar campos obligatorios
      if (!this.formData.first_name || !this.formData.last_name || 
          !this.formData.identification || !this.formData.email || !this.formData.role) {
        return false
      }

      // Validar email
      if (this.validateEmail()) {
        return false
      }

      // Validar contraseña solo si es necesario
      if (!this.isEditing || this.changePassword) {
        if (!this.formData.password || this.formData.password !== this.formData.password_confirm) {
          return false
        }
      }

      return true
    },
    async saveUser() {
      if (!this.validateForm()) {
        return
      }

      this.saving = true

      try {
        const payload = {
          first_name: this.formData.first_name,
          second_name: this.formData.second_name,
          last_name: this.formData.last_name,
          second_last_name: this.formData.second_last_name,
          identification_document: this.formData.identification,
          cellphone: this.formData.cellphone,
          email: this.formData.email,
          username: this.formData.email,
          role: this.formData.role
        }

        // Solo incluir password si es creación o si se está cambiando
        if (!this.isEditing || this.changePassword) {
          payload.password = this.formData.password
        }

        let response
        if (this.isEditing) {
          response = await ApiService.put(`/user/${this.userData.id}/`, payload)
        } else {
          response = await ApiService.post('/user/', payload)
        }

        this.$emit('saved', response.data)
        this.closeModal()
      } catch (error) {
        console.error('Error al guardar usuario:', error)
        this.$emit('error', error.response?.data?.detail || 'Error al guardar el usuario')
      } finally {
        this.saving = false
      }
    },
    closeModal() {
      this.resetForm()
      this.$emit('update:visible', false)
    }
  }
}
</script>