<template>
    <Toast />
    <ConfirmDialog />
    <Card>
        <template #content>
            <div class="flex justify-between items-center mb-4">
                <div class="font-semibold text-xl">Listado de Matrículas Activas</div>
            </div>

            <!-- Advanced Filters -->
            <Card class="mb-4 bg-gray-50">
                <template #content>
                    <div class="font-semibold text-lg mb-3">Filtros Avanzados</div>
                    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div class="flex flex-col gap-2">
                            <label for="sizeFilter" class="font-medium">Tamaño</label>
                            <Select
                                id="sizeFilter"
                                v-model="filters.size"
                                :options="sizeOptions"
                                option-label="label"
                                option-value="value"
                                placeholder="Seleccionar tamaño"
                                show-clear
                                class="w-full"
                            />
                        </div>
                        <div class="flex flex-col gap-2">
                            <label for="breedFilter" class="font-medium">Raza</label>
                            <InputText
                                id="breedFilter"
                                v-model="filters.breed"
                                placeholder="Buscar por raza"
                                class="w-full"
                            />
                        </div>
                        <div class="flex items-end">
                            <Button 
                                label="Filtrar" 
                                icon="pi pi-filter" 
                                severity="primary" 
                                @click="applyFilters"
                                
                            />
                        </div>
                    </div>
                </template>
            </Card>

            <DataTable
                :value="enrollments"
                size="small"
                paginator
                :rows="10"
                :rows-per-page-options="[5, 10, 20, 50]"
                striped-rows
                row-hover
                :loading="loading"
            >
                <template #empty> No hay matrículas activas para mostrar </template>
                
                <!-- Canine Data -->
                <Column field="canine.id" header="ID Canino" sortable>
                    <template #body="{ data }">
                        {{ data.canine?.id || 'N/D' }}
                    </template>
                </Column>
                <Column field="canine.name" header="Nombre" sortable>
                    <template #body="{ data }">
                        {{ data.canine?.name || 'N/D' }}
                    </template>
                </Column>
                <Column field="canine.breed" header="Raza" sortable>
                    <template #body="{ data }">
                        {{ data.canine?.breed || 'N/D' }}
                    </template>
                </Column>
                <Column field="canine.size" header="Tamaño" sortable>
                    <template #body="{ data }">
                        {{ sizeLabel(data.canine?.size) }}
                    </template>
                </Column>

                <!-- Plan Data -->
                <Column field="plan.name" header="Plan" sortable>
                    <template #body="{ data }">
                        {{ data.plan?.name || 'N/D' }}
                    </template>
                </Column>
                <Column field="plan.price" header="Precio" sortable>
                    <template #body="{ data }">
                        {{ formatPrice(data.plan?.price) }}
                    </template>
                </Column>
                <Column field="plan.duration_days" header="Duración" sortable>
                    <template #body="{ data }">
                        {{ durationLabel(data.plan?.duration_days) }}
                    </template>
                </Column>
                <Column field="plan.transport_type" header="Tipo de Transporte" sortable>
                    <template #body="{ data }">
                        {{ transportTypeLabel(data.plan?.transport_type) }}
                    </template>
                </Column>

                <!-- Enrollment Dates -->
                <Column field="start_date" header="Fecha Inicio" sortable>
                    <template #body="{ data }">
                        {{ formatDate(data.start_date) }}
                    </template>
                </Column>
                <Column field="end_date" header="Fecha Fin" sortable>
                    <template #body="{ data }">
                        {{ formatDate(data.end_date) }}
                    </template>
                </Column>

                <!-- Actions -->
                <Column header="Acciones">
                    <template #body="{ data }">
                        <Button
                            icon="pi pi-pencil"
                            severity="warning"
                            size="small"
                            class="mx-1"
                            title="Editar matrícula"
                            @click="openEditModal(data)"
                        />
                        <Button
                            icon="pi pi-trash"
                            severity="danger"
                            size="small"
                            class="mx-1"
                            title="Eliminar matrícula"
                            @click="confirmDeleteEnrollment(data)"
                        />
                    </template>
                </Column>
            </DataTable>
        </template>
    </Card>
</template>

<script>
import ApiService from '@/service/ApiService'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import Button from 'primevue/button'
import Card from 'primevue/card'
import Select from 'primevue/select'
import InputText from 'primevue/inputtext'
import Toast from 'primevue/toast'
import ConfirmDialog from 'primevue/confirmdialog'
import { useToast } from 'primevue/usetoast'
import { useConfirm } from 'primevue/useconfirm'

ApiService.setHeader()

export default {
    name: 'ListEnrollments',
    components: {
        DataTable,
        Column,
        Button,
        Card,
        Select,
        InputText,
        Toast,
        ConfirmDialog
    },
    data() {
        return {
            enrollments: [],
            toast: null,
            confirm: null,
            loading: false,
            filters: {
                size: null,
                breed: ''
            },
            sizeOptions: [
                { label: 'Pequeño', value: 1 },
                { label: 'Mediano', value: 2 },
                { label: 'Grande', value: 3 }
            ]
        }
    },
    mounted() {
        this.toast = useToast()
        this.confirm = useConfirm()
        this.loadEnrollments()
    },
    methods: {
        async loadEnrollments(filterPayload = null) {
            this.loading = true
            try {
                let response
                if (filterPayload) {
                    // POST with filters
                    response = await ApiService.post('/enrollment/active-to-director', filterPayload)
                } else {
                    // POST without filters (initial load)
                    response = await ApiService.post('/enrollment/active-to-director', {})
                }
                this.enrollments = response.data
            } catch (error) {
                console.error('Error al cargar matrículas:', error)
                this.toast.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: 'No se pudieron cargar las matrículas',
                    life: 3000
                })
            } finally {
                this.loading = false
            }
        },
        applyFilters() {
            const payload = {}
            
            if (this.filters.size !== null && this.filters.size !== undefined) {
                payload.size = this.filters.size
            }
            
            if (this.filters.breed && this.filters.breed.trim() !== '') {
                payload.breed = this.filters.breed.trim()
            }

            // Call with payload (even if empty)
            this.loadEnrollments(payload)
        },
        formatDate(dateStr) {
            if (!dateStr) return '-'
            // Parse YYYY-MM-DD format to avoid timezone issues
            const [yyyy, mm, dd] = dateStr.split('-')
            return `${dd}/${mm}/${yyyy}`
        },
        formatPrice(price) {
            if (!price) return '-'
            const numPrice = typeof price === 'string' ? parseFloat(price) : price
            return new Intl.NumberFormat('es-CO', {
                style: 'currency',
                currency: 'COP',
                minimumFractionDigits: 0
            }).format(numPrice)
        },
        sizeLabel(size) {
            const labels = {
                1: 'Pequeño',
                2: 'Mediano',
                3: 'Grande'
            }
            return labels[size] || 'N/D'
        },
        durationLabel(days) {
            if (!days) return 'N/D'
            if (days >= 365) return `${Math.floor(days / 365)} año(s)`
            if (days >= 30) return `${Math.floor(days / 30)} mes(es)`
            return `${days} día(s)`
        },
        transportTypeLabel(type) {
            const labels = {
                1: 'Completo',
                2: 'Solo mañana',
                3: 'Solo tarde',
                4: 'Ninguno'
            }
            return labels[type] || 'N/D'
        },
        openEditModal(enrollment) {
            // TODO: Implement edit functionality
            console.log('Edit enrollment:', enrollment)
            this.toast.add({
                severity: 'info',
                summary: 'Información',
                detail: 'Funcionalidad de edición por implementar',
                life: 3000
            })
        },
        confirmDeleteEnrollment(enrollment) {
            this.confirm.require({
                message: `¿Está seguro que desea eliminar la matrícula de "${enrollment.canine?.name}"?`,
                header: 'Confirmar eliminación',
                icon: 'pi pi-exclamation-triangle',
                acceptClass: 'p-button-danger',
                accept: async () => {
                    try {
                        // TODO: Implement delete endpoint
                        await ApiService.delete(`/enrollment/${enrollment.id}/`)
                        this.toast.add({
                            severity: 'success',
                            summary: 'Eliminado',
                            detail: 'Matrícula eliminada correctamente',
                            life: 3000
                        })
                        await this.loadEnrollments()
                    } catch (error) {
                        console.error('Error al eliminar matrícula:', error)
                        this.toast.add({
                            severity: 'error',
                            summary: 'Error',
                            detail: 'No se pudo eliminar la matrícula',
                            life: 3000
                        })
                    }
                }
            })
        }
    }
}
</script>