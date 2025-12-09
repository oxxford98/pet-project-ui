<template>
    <Dialog
        v-model:visible="isVisible"
        modal
        :header="isEditMode ? 'Editar Matrícula' : 'Crear Matrícula'"
        :style="{ width: '50rem' }"
        :breakpoints="{ '1199px': '75vw', '575px': '90vw' }"
    >
        <div class="flex flex-col gap-4">
            <!-- Canine Information (Read-only) -->
            <div class="flex flex-col gap-2">
                <label class="font-medium">Canino</label>
                <InputText
                    :value="canineInfo"
                    disabled
                    class="bg-gray-100"
                />
            </div>

            <!-- Plan Selector with Filter -->
            <div class="flex flex-col gap-2">
                <label for="plan" class="font-medium">Plan <span class="text-red-500">*</span></label>
                <Select
                    id="plan"
                    v-model="formData.plan"
                    :options="plans"
                    option-label="name"
                    option-value="id"
                    placeholder="Seleccionar plan"
                    filter
                    show-clear
                    class="w-full"
                    :class="{ 'p-invalid': submitted && !formData.plan }"
                >
                    <template #option="slotProps">
                        <div class="flex flex-col">
                            <span class="font-semibold">{{ slotProps.option.name }}</span>
                            <span class="text-sm text-gray-600">
                                {{ formatPrice(slotProps.option.price) }} - 
                                {{ durationLabel(slotProps.option.duration_days) }} - 
                                {{ transportTypeLabel(slotProps.option.transport_type) }}
                            </span>
                        </div>
                    </template>
                </Select>
                <small v-if="submitted && !formData.plan" class="p-error">El plan es requerido</small>
            </div>

            <!-- Start Date -->
            <div class="flex flex-col gap-2">
                <label for="startDate" class="font-medium">Fecha de Inicio <span class="text-red-500">*</span></label>
                <DatePicker
                    id="startDate"
                    v-model="formData.start_date"
                    date-format="dd/mm/yy"
                    placeholder="Seleccionar fecha de inicio"
                    show-icon
                    :class="{ 'p-invalid': submitted && !formData.start_date }"
                />
                <small v-if="submitted && !formData.start_date" class="p-error">La fecha de inicio es requerida</small>
            </div>

            <!-- End Date -->
            <div class="flex flex-col gap-2">
                <label for="endDate" class="font-medium">Fecha de Fin <span class="text-red-500">*</span></label>
                <DatePicker
                    id="endDate"
                    v-model="formData.end_date"
                    date-format="dd/mm/yy"
                    placeholder="Seleccionar fecha de fin"
                    show-icon
                    :class="{ 'p-invalid': submitted && !formData.end_date }"
                />
                <small v-if="submitted && !formData.end_date" class="p-error">La fecha de fin es requerida</small>
            </div>
        </div>

        <template #footer>
            <Button label="Cancelar" icon="pi pi-times" text @click="closeModal" />
            <Button
                :label="isEditMode ? 'Actualizar' : 'Guardar'"
                icon="pi pi-check"
                :loading="loading"
                @click="saveEnrollment"
            />
        </template>
    </Dialog>
</template>

<script>
import Dialog from 'primevue/dialog'
import Button from 'primevue/button'
import InputText from 'primevue/inputtext'
import Select from 'primevue/select'
import DatePicker from 'primevue/datepicker'
import ApiService from '@/service/ApiService'

ApiService.setHeader()

export default {
    name: 'EnrollmentModal',
    components: {
        Dialog,
        Button,
        InputText,
        Select,
        DatePicker
    },
    props: {
        visible: {
            type: Boolean,
            default: false
        },
        enrollmentData: {
            type: Object,
            default: null
        }
    },
    emits: ['update:visible', 'saved', 'error'],
    data() {
        return {
            formData: {
                plan: null,
                start_date: null,
                end_date: null
            },
            plans: [],
            canineInfo: '',
            submitted: false,
            loading: false
        }
    },
    computed: {
        isVisible: {
            get() {
                return this.visible
            },
            set(value) {
                this.$emit('update:visible', value)
            }
        },
        isEditMode() {
            return !!this.enrollmentData
        }
    },
    watch: {
        visible(newVal) {
            if (newVal) {
                this.loadPlans()
                if (this.enrollmentData) {
                    this.loadEnrollmentData()
                } else {
                    this.resetForm()
                }
            }
        }
    },
    methods: {
        async loadPlans() {
            try {
                const { data } = await ApiService.get('/plan/')
                this.plans = data
            } catch (error) {
                console.error('Error al cargar planes:', error)
                this.$emit('error', 'No se pudieron cargar los planes')
            }
        },
        loadEnrollmentData() {
            if (!this.enrollmentData) return

            // Set canine info (read-only)
            const canine = this.enrollmentData.canine
            this.canineInfo = `${canine.id} - ${canine.name}`

            // Set form data
            this.formData.plan = this.enrollmentData.plan?.id || null
            
            // Parse dates from YYYY-MM-DD to Date objects
            if (this.enrollmentData.start_date) {
                const [y1, m1, d1] = this.enrollmentData.start_date.split('-')
                this.formData.start_date = new Date(y1, m1 - 1, d1)
            }
            
            if (this.enrollmentData.end_date) {
                const [y2, m2, d2] = this.enrollmentData.end_date.split('-')
                this.formData.end_date = new Date(y2, m2 - 1, d2)
            }

            this.submitted = false
        },
        resetForm() {
            this.formData = {
                plan: null,
                start_date: null,
                end_date: null
            }
            this.canineInfo = ''
            this.submitted = false
        },
        formatDateToAPI(date) {
            if (!date) return null
            const d = new Date(date)
            const year = d.getFullYear()
            const month = String(d.getMonth() + 1).padStart(2, '0')
            const day = String(d.getDate()).padStart(2, '0')
            return `${year}-${month}-${day}`
        },
        async saveEnrollment() {
            this.submitted = true

            // Validation
            if (!this.formData.plan || !this.formData.start_date || !this.formData.end_date) {
                return
            }

            this.loading = true
            try {
                const payload = {
                    plan: this.formData.plan,
                    start_date: this.formatDateToAPI(this.formData.start_date),
                    end_date: this.formatDateToAPI(this.formData.end_date)
                }

                if (this.isEditMode) {
                    // PATCH /enrollment/{id_enrollment}/
                    await ApiService.patch(`/enrollment/${this.enrollmentData.id}/`, payload)
                } else {
                    // POST /enrollment/ (if needed in future)
                    await ApiService.post('/enrollment/', payload)
                }

                this.$emit('saved')
                this.closeModal()
            } catch (error) {
                console.error('Error al guardar matrícula:', error)
                const errorMsg = error.response?.data?.message || 'Error al guardar la matrícula'
                this.$emit('error', errorMsg)
            } finally {
                this.loading = false
            }
        },
        closeModal() {
            this.resetForm()
            this.isVisible = false
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
        }
    }
}
</script>