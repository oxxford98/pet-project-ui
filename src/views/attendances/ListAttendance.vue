<template>
    <Toast />
    <ConfirmDialog />
    <Card>
        <template #content>
            <div class="flex justify-between items-center mb-4">
                <div class="font-semibold text-xl">Listado de Asistencias</div>
                <Button label="Nueva Asistencia" icon="pi pi-plus" severity="success" @click="openCreateModal" />
            </div>
            <DataTable
                :value="attendances"
                size="small"
                paginator
                :rows="10"
                :rows-per-page-options="[5, 10, 20, 50]"
                striped-rows
                row-hover
                :loading="loading"
            >
                <template #empty> No hay asistencias para mostrar </template>
                <Column header="Canino">
                    <template #body="{ data }">
                        {{ data.id || 'N/D' }}
                    </template>
                </Column>
                <Column header="Registro de Llegada">
                    <template #body="{ data }">
                        {{ formatDateTime(data.incoming_time) }}
                    </template>
                </Column>
                <Column header="Registro de Salida">
                    <template #body="{ data }">
                        {{ formatDateTime(data.outgoing_time) }}
                    </template>
                </Column>
                <Column header="Observación">
                    <template #body="{ data }">
                        {{ data.observations || '-' }}
                    </template>
                </Column>
                <Column header="Transporte Entrada">
                    <template #body="{ data }">
                        {{ transportLabel(data.type_service_incoming) }}
                    </template>
                </Column>
                <Column header="Transporte Salida">
                    <template #body="{ data }">
                        {{ transportLabel(data.type_service_outgoing) }}
                    </template>
                </Column>
                <Column header="Acciones">
                    <template #body="{ data }">
                        <Button
                            icon="pi pi-pencil"
                            severity="warning"
                            size="small"
                            class="mx-1"
                            title="Editar asistencia"
                            @click="openEditModal(data)"
                        />
                        <Button
                            icon="pi pi-trash"
                            severity="danger"
                            size="small"
                            class="mx-1"
                            title="Eliminar asistencia"
                            @click="confirmDeleteAttendance(data)"
                        />
                    </template>
                </Column>
            </DataTable>
        </template>
    </Card>

    <AttendanceModal
        v-model:visible="showModal"
        :attendance-data="selectedAttendance"
        @saved="handleAttendanceSaved"
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
import { useToast } from 'primevue/usetoast'
import { useConfirm } from 'primevue/useconfirm'
import AttendanceModal from './components/AttendanceModal.vue'

ApiService.setHeader()

export default {
    name: 'ListAttendance',
    components: {
        DataTable,
        Column,
        Button,
        Card,
        Toast,
        ConfirmDialog,
        AttendanceModal
    },
    data() {
        return {
            attendances: [],
            toast: null,
            confirm: null,
            showModal: false,
            selectedAttendance: null,
            loading: false
        }
    },
    mounted() {
        this.toast = useToast()
        this.confirm = useConfirm()
        this.loadAttendances()
    },
    methods: {
        async loadAttendances() {
            this.loading = true
            try {
                const { data } = await ApiService.get('/attendance/')
                this.attendances = data
            } catch (error) {
                console.error('Error al cargar asistencias:', error)
                this.toast.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: 'No se pudieron cargar las asistencias',
                    life: 3000
                })
            } finally {
                this.loading = false
            }
        },
        formatDateTime(iso) {
            if (!iso) return '-'
            const d = new Date(iso)
            if (Number.isNaN(d.getTime())) return iso
            const dd = String(d.getDate()).padStart(2, '0')
            const mm = String(d.getMonth() + 1).padStart(2, '0')
            const yyyy = d.getFullYear()
            const hh = String(d.getHours()).padStart(2, '0')
            const min = String(d.getMinutes()).padStart(2, '0')
            return `${dd}/${mm}/${yyyy} ${hh}:${min}`
        },
        transportLabel(val) {
            const map = { 1: 'Dueño', 2: 'Ruta escolar' }
            return map[val] || '-'
        },
        openCreateModal() {
            this.selectedAttendance = null
            this.showModal = true
        },
        openEditModal(attendance) {
            this.selectedAttendance = attendance
            this.showModal = true
        },
        handleAttendanceSaved() {
            const message = this.selectedAttendance
                ? 'Asistencia actualizada correctamente'
                : 'Asistencia creada correctamente'

            this.toast.add({
                severity: 'success',
                summary: 'Éxito',
                detail: message,
                life: 3000
            })
            this.loadAttendances()
        },
        handleError(message) {
            this.toast.add({
                severity: 'error',
                summary: 'Error',
                detail: message,
                life: 3000
            })
        },
        confirmDeleteAttendance(attendance) {
            this.confirm.require({
                message: `¿Está seguro que desea eliminar esta asistencia del canino "${attendance.canine?.name}"?`,
                header: 'Confirmar eliminación',
                icon: 'pi pi-exclamation-triangle',
                acceptClass: 'p-button-danger',
                accept: async () => {
                    try {
                        await ApiService.delete(`/attendance/${attendance.id}/`)
                        this.toast.add({
                            severity: 'success',
                            summary: 'Eliminado',
                            detail: 'Asistencia eliminada correctamente',
                            life: 3000
                        })
                        await this.loadAttendances()
                    } catch (error) {
                        console.error('Error al eliminar asistencia:', error)
                        this.toast.add({
                            severity: 'error',
                            summary: 'Error',
                            detail: 'No se pudo eliminar la asistencia',
                            life: 3000
                        })
                    }
                }
            })
        }
    }
}
</script>