<template>
    <Dialog
        v-model:visible="dialogVisible"
        :header="isEditing ? 'Editar Asistencia' : 'Nueva Asistencia'"
        modal
        :style="{ width: '50vw' }"
        :breakpoints="{ '1199px': '75vw', '575px': '90vw' }"
        @hide="closeModal"
    >
        <div class="grid grid-cols-2 gap-4">
            <FloatLabel class="my-4 col-span-2">
                <Select
                    v-model="formData.canine"
                    :options="canines"
                    option-label="label"
                    option-value="id"
                    class="w-full"
                    :invalid="validate && !formData.canine"
                    filter
                    :loading="loadingCanines"
                >
                    <template #empty> No hay caninos disponibles </template>
                </Select>
                <label for="canine">Canino *</label>
            </FloatLabel>

            <FloatLabel class="my-4 col-span-2">
                <DatePicker
                    v-model="formData.incoming_time"
                    show-time
                    hourFormat="24"
                    class="w-full"
                    dateFormat="dd/mm/yy"
                    :invalid="validate && !formData.incoming_time"
                />
                <label for="incoming_time">Registro de Llegada *</label>
            </FloatLabel>

            <FloatLabel class="my-4 col-span-2">
                <Select
                    v-model="formData.type_service_incoming"
                    :options="transportOptions"
                    option-label="label"
                    option-value="value"
                    class="w-full"
                    :invalid="validate && !formData.type_service_incoming"
                >
                    <template #empty> No hay opciones </template>
                </Select>
                <label for="type_service_incoming">Transporte de Entrada *</label>
            </FloatLabel>

            <FloatLabel class="my-4 col-span-2">
                <DatePicker
                    v-model="formData.outgoing_time"
                    show-time
                    hourFormat="24"
                    class="w-full"
                    dateFormat="dd/mm/yy"
                />
                <label for="outgoing_time">Registro de Salida</label>
            </FloatLabel>

            <FloatLabel class="my-4 col-span-2">
                <Select
                    v-model="formData.type_service_outgoing"
                    :options="transportOptions"
                    option-label="label"
                    option-value="value"
                    class="w-full"
                >
                    <template #empty> No hay opciones </template>
                </Select>
                <label for="type_service_outgoing">Transporte de Salida</label>
            </FloatLabel>

            <FloatLabel class="my-4 col-span-2">
                <Textarea
                    v-model="formData.observations"
                    rows="4"
                    class="w-full"
                />
                <label for="observations">Observaciones(Opcional)</label>
            </FloatLabel>
        </div>

        <template #footer>
            <Button label="Cancelar" icon="pi pi-times" severity="secondary" outlined @click="closeModal" />
            <Button
                :label="isEditing ? 'Actualizar' : 'Crear'"
                icon="pi pi-check"
                :loading="saving"
                @click="saveAttendance"
            />
        </template>
    </Dialog>
</template>

<script>
import Dialog from 'primevue/dialog'
import Select from 'primevue/select'
import DatePicker from 'primevue/datepicker'
import Textarea from 'primevue/textarea'
import FloatLabel from 'primevue/floatlabel'
import Button from 'primevue/button'
import ApiService from '@/service/ApiService'

export default {
    name: 'AttendanceModal',
    components: {
        Dialog,
        Select,
        DatePicker,
        Textarea,
        FloatLabel,
        Button
    },
    props: {
        visible: {
            type: Boolean,
            default: false
        },
        attendanceData: {
            type: Object,
            default: null
        }
    },
    emits: ['update:visible', 'saved', 'error'],
    data() {
        return {
            formData: {
                canine: null,
                incoming_time: null,
                outgoing_time: null,
                observations: '',
                type_service_incoming: null,
                type_service_outgoing: null
            },
            canines: [],
            transportOptions: [
                { label: 'Dueño', value: 1 },
                { label: 'Ruta escolar', value: 2 }
            ],
            validate: false,
            saving: false,
            loadingCanines: false
        }
    },
    computed: {
        isEditing() {
            return !!this.attendanceData
        },
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
                this.loadCanines()
                if (this.attendanceData) {
                    this.loadAttendanceData()
                } else {
                    this.resetForm()
                }
            }
        }
    },
    methods: {
        async loadCanines() {
            this.loadingCanines = true
            try {
                const { data } = await ApiService.get('/canine/')
                this.canines = data.map(c => ({
                    id: c.id,
                    label: `${c.id} - ${c.name}`
                }))
            } catch (error) {
                console.error('Error al cargar caninos:', error)
                this.$emit('error', 'No se pudieron cargar los caninos')
            } finally {
                this.loadingCanines = false
            }
        },
        loadAttendanceData() {
            this.formData = {
                canine: this.attendanceData.id || null,
                incoming_time: this.attendanceData.incoming_time ? new Date(this.attendanceData.incoming_time) : null,
                outgoing_time: this.attendanceData.outgoing_time ? new Date(this.attendanceData.outgoing_time) : null,
                observations: this.attendanceData.observations || '',
                type_service_incoming: this.attendanceData.type_service_incoming || null,
                type_service_outgoing: this.attendanceData.type_service_outgoing || null
            }
            this.validate = false
        },
        resetForm() {
            this.formData = {
                canine: null,
                incoming_time: null,
                outgoing_time: null,
                observations: '',
                type_service_incoming: null,
                type_service_outgoing: null
            }
            this.validate = false
        },
        validateForm() {
            this.validate = true
            return !!(this.formData.canine && this.formData.incoming_time && this.formData.type_service_incoming)
        },
        formatToISO(date) {
            if (!date) return null
            return date.toISOString()
        },
        async saveAttendance() {
            if (!this.validateForm()) {
                return
            }

            this.saving = true

            try {
                const payload = {
                    canine: this.formData.canine,
                    incoming_time: this.formatToISO(this.formData.incoming_time),
                    type_service_incoming: this.formData.type_service_incoming,
                    outgoing_time: this.formatToISO(this.formData.outgoing_time),
                    type_service_outgoing: this.formData.type_service_outgoing,
                    observations: this.formData.observations || null
                }

                let response
                if (this.isEditing) {
                    response = await ApiService.patch(`/attendance/${this.attendanceData.id}/`, payload)
                } else {
                    response = await ApiService.post('/attendance/', payload)
                }

                this.$emit('saved', response.data)
                this.closeModal()
            } catch (error) {
                console.error('Error al guardar asistencia:', error)
                this.$emit('error', error.response?.data?.detail || 'Error al guardar la asistencia')
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