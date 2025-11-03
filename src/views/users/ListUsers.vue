<template>
  <Toast />
  <ConfirmDialog />
  <Card>
    <template #content>
      <div class="flex justify-between items-center mb-4">
        <div class="font-semibold text-xl">Listado de Usuarios</div>
        <Button 
          label="Crear Nuevo Usuario" 
          icon="pi pi-plus" 
          @click="openCreateModal"
          severity="success"
        />
      </div>
      <DataTable
        :value="users"
        size="small"
        paginator
        :rows="10"
        :rowsPerPageOptions="[5, 10, 20, 50]"
        stripedRows
        rowHover
      >
        <template #empty>
          No hay usuarios para mostrar
        </template>
        <Column field="username" header="Usuario" sortable />
        <Column field="first_name" header="Nombre" sortable />
        <Column field="last_name" header="Apellido" sortable />
        <Column field="email" header="Email" sortable />
        <Column field="cellphone" header="Teléfono" sortable />
        <Column field="role" header="Rol" sortable />
        <Column header="Acciones">
          <template #body="{data}">
            <Button
              icon="pi pi-pencil"
              severity="warning"
              size="small"
              class="mx-1"
              @click="openEditModal(data)"
              title="Editar usuario"
            />
            <Button
              icon="pi pi-trash"
              severity="danger"
              size="small"
              class="mx-1"
              @click="confirmDeleteUser(data)"
              title="Eliminar usuario"
            />
          </template>
        </Column>
      </DataTable>
    </template>
  </Card>

  <UserModal 
    v-model:visible="showModal" 
    :userData="selectedUser"
    @saved="handleUserSaved"
    @error="handleError"
  />

</template>

<script>
import ApiService from '@/service/ApiService'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import Button from 'primevue/button'
import Card from 'primevue/card'
import Toast from 'primevue/toast'
import ConfirmDialog from 'primevue/confirmdialog'
import { useToast } from "primevue/usetoast"
import { useConfirm } from "primevue/useconfirm"
import UserModal from './components/UserModal.vue'

ApiService.setHeader();

export default {
  name: 'ListUsers',
  components: {
    DataTable,
    Column,
    Button,
    Card,
    Toast,
    ConfirmDialog,
    UserModal
  },
  data() {
    return {
      users: [],
      toast: null,
      confirm: null,
      showModal: false,
      selectedUser: null,
      loading: false
    }
  },
  methods: {
    async loadUsers() {
      try {
        const { data } = await ApiService.get('/user/')
        this.users = data
      } catch (error) {
        console.error('Error al cargar usuarios:', error)
        this.toast.add({ 
          severity: 'error', 
          summary: 'Error', 
          detail: 'No se pudieron cargar los usuarios', 
          life: 3000 
        })
      }
    },
    openCreateModal() {
      this.selectedUser = null
      this.showModal = true
    },
    openEditModal(user) {
      this.selectedUser = user
      this.showModal = true
    },
    handleUserSaved(userData) {
      const message = this.selectedUser 
        ? 'Usuario actualizado correctamente' 
        : 'Usuario creado correctamente'
      
      this.toast.add({ 
        severity: 'success', 
        summary: 'Éxito', 
        detail: message,
        life: 3000 
      })
      this.loadUsers()
    },
    handleError(message) {
      this.toast.add({ 
        severity: 'error', 
        summary: 'Error', 
        detail: message, 
        life: 3000 
      })
    },
    confirmDeleteUser(user) {
      this.confirm.require({
        message: `¿Está seguro que desea eliminar al usuario "${user.username}"?`,
        header: 'Confirmar eliminación',
        icon: 'pi pi-exclamation-triangle',
        acceptClass: 'p-button-danger',
        accept: async () => {
          try {
            await ApiService.delete(`/user/${user.id}/`)
            this.toast.add({ 
              severity: 'success', 
              summary: 'Eliminado', 
              detail: 'Usuario eliminado correctamente',
              life: 3000 
            })
            await this.loadUsers()
          } catch (error) {
            console.error('Error al eliminar usuario:', error)
            this.toast.add({ 
              severity: 'error', 
              summary: 'Error', 
              detail: 'No se pudo eliminar el usuario', 
              life: 3000 
            })
          }
        }
      })
    }
  },
  mounted() {
    this.toast = useToast()
    this.confirm = useConfirm()
    this.loadUsers()
  }
}
</script>