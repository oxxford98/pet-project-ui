<template>
    <Toast />
    <ConfirmDialog />

    <div v-if="loading" class="flex justify-center items-center p-8">
        <ProgressSpinner />
    </div>

    <div v-else-if="!enrollment" class="p-4">
        <Message severity="warn">No se encontró una matrícula activa para esta mascota.</Message>
    </div>

    <div v-else class="grid grid-cols-12 gap-4 items-stretch">
        <!-- Card Mascota (más grande) -->
        <div class="col-span-12 lg:col-span-6 h-full">
            <Card>
                <template #header>
                    <div class="p-4 text-xl font-semibold">Mascota</div>
                </template>
                <template #content>
                    <div
                        class="w-full h-56 bg-surface-200 border-1 border-surface-300 rounded flex items-center justify-center mb-4"
                    >
                        <i class="pi pi-image text-5xl text-surface-500"></i>
                    </div>

                    <div class="space-y-2 text-sm">
                        <div class="text-2xl font-bold">{{ canine.name }}</div>
                        <div class="text-surface-500">Raza: {{ canine.breed }}</div>
                        <div>
                            <span class="font-medium">Fecha de nacimiento:</span>
                            <span class="ml-1">{{ formatDate(canine.birth_date) }}</span>
                        </div>
                        <div>
                            <span class="font-medium">Talla:</span>
                            <span class="ml-1">{{ sizeLabel(canine.size) }}</span>
                        </div>
                    </div>
                </template>
            </Card>
        </div>

        <!-- Card Detalle Matrícula -->
        <div class="col-span-12 lg:col-span-6 h-full">
            <Card>
                <template #header>
                    <div class="p-4 text-xl font-semibold">Detalle de matrícula</div>
                </template>
                <template #content>
                    <div class="space-y-2 text-sm">
                        <div class="pt-2">
                            <div class="text-lg font-semibold">{{ enrollment.plan.name }}</div>
                            <div class="text-surface-500">{{ enrollment.plan.description }}</div>
                            <div class="mt-1">
                                <span class="font-medium">Vigencia:</span>
                                <span class="ml-2">{{ durationLabel(enrollment.plan.duration_days) }}</span>
                            </div>
                            <div>
                                <span class="font-medium">Transporte:</span>
                                <span class="ml-2">{{ transportLabel(enrollment.plan.transport_type) }}</span>
                            </div>
                            <div>
                                <span class="font-medium">Precio:</span>
                                <span class="ml-2 text-green-600 font-semibold">{{
                                    formatCOP(enrollment.plan.price)
                                }}</span>
                            </div>
                        </div>

                        <div class="mt-5 pt-3 border-top-1 surface-border">
                            <div class="text-base font-semibold mb-2">Detalle de vigencia</div>

                            <div>
                                <span class="font-medium">Inicio:</span>
                                <span class="ml-2">{{ formatDate(enrollment.start_date) }}</span>
                            </div>

                            <div>
                                <span class="font-medium">Fin:</span>
                                <span class="ml-2">{{ formatDate(enrollment.end_date) }}</span>
                            </div>

                            <div>
                                <span class="font-medium">Estado:</span>
                                <span
                                    class="ml-2"
                                    :class="
                                        enrollment.is_active
                                            ? 'text-green-600 font-semibold'
                                            : 'text-red-600 font-semibold'
                                    "
                                >
                                    {{ enrollment.is_active ? 'Activa' : 'Inactiva' }}
                                </span>
                            </div>
                        </div>
                    </div>
                </template>
                <template #footer>
                    <div class="flex justify-end gap-2 p-2">
                        <Button label="Editar matrícula" icon="pi pi-pencil" severity="info" @click="editEnrollment" />
                        <Button
                            label="Cancelar matrícula"
                            icon="pi pi-trash"
                            severity="danger"
                            :loading="deleting"
                            @click="confirmDelete"
                        />
                    </div>
                </template>
            </Card>
        </div>
    </div>

    <EditPlanModal
        v-if="enrollment"
        v-model:visible="showPlanEditor"
        :enrollment-id="enrollment.id"
        :current-plan-id="enrollment.plan.id"
        :current-plan="enrollment.plan"
        @updated="onUpdated"
        @error="onError"
    />
</template>

<script>
import Card from 'primevue/card';
import Button from 'primevue/button';
import Toast from 'primevue/toast';
import Message from 'primevue/message';
import ConfirmDialog from 'primevue/confirmdialog';
import ProgressSpinner from 'primevue/progressspinner';
import { useToast } from 'primevue/usetoast';
import { useConfirm } from 'primevue/useconfirm';
import ApiService from '@/service/ApiService';
import EditPlanModal from './components/EditPlanModal.vue';

export default {
    name: 'EnrollmentDetail',
    components: {
        Card,
        Button,
        Toast,
        Message,
        ConfirmDialog,
        ProgressSpinner,
        EditPlanModal
    },
    data() {
        return {
            toast: null,
            confirm: null,
            loading: false,
            deleting: false,
            enrollment: null,
            canine: {},
            showPlanEditor: false
        };
    },
    mounted() {
        this.toast = useToast();
        this.confirm = useConfirm();
        this.loadDetail();
    },
    methods: {
        sizeLabel(val) {
            const map = { 1: 'Pequeño', 2: 'Mediano', 3: 'Grande' };
            return map[val] || 'N/D';
        },
        durationLabel(d) {
            const map = { 30: 'Mensual', 60: 'Bimestral', 90: 'Trimestral', 180: 'Semestral', 365: 'Anual' };
            return map[d] || `${d} días`;
        },
        transportLabel(t) {
            const map = { 1: 'Completo', 2: 'Solo mañana', 3: 'Solo tarde', 4: 'Sin transporte' };
            return map[t] || 'N/D';
        },
        formatDate(iso) {
            if (!iso) return 'N/D';
            if (/^\d{4}-\d{2}-\d{2}$/.test(iso)) {
                const [y, m, d] = iso.split('-');
                return `${d}/${m}/${y}`;
            }
            const d = new Date(iso);
            if (Number.isNaN(d.getTime())) return iso;
            return d.toLocaleDateString('es-CO', { timeZone: 'UTC' });
        },
        formatCOP(val) {
            const n = typeof val === 'string' ? parseFloat(val) : val;
            return new Intl.NumberFormat('es-CO', {
                style: 'currency',
                currency: 'COP',
                maximumFractionDigits: 0
            }).format(n || 0);
        },
        async loadDetail() {
            this.loading = true;
            try {
                ApiService.setHeader();
                const canineId = this.$route.params.canineId;
                const { data } = await ApiService.get(`/enrollment/by-canine/${canineId}`);
                this.enrollment = data;
                this.canine = data.canine || {};
            } catch (e) {
                console.error('Error cargando matrícula:', e);
                this.toast.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: 'No se pudo cargar la matrícula',
                    life: 3000
                });
            } finally {
                this.loading = false;
            }
        },
        editEnrollment() {
            this.showPlanEditor = true;
        },
        onUpdated() {
            this.toast.add({
                severity: 'success',
                summary: 'Actualizada',
                detail: 'Matrícula actualizada correctamente',
                life: 2500
            });
            this.showPlanEditor = false;
            this.loadDetail();
        },
        onError(msg) {
            this.toast.add({
                severity: 'error',
                summary: 'Error',
                detail: msg || 'No se pudo completar la acción',
                life: 3000
            });
        },
        confirmDelete() {
            this.confirm.require({
                header: 'Confirmar cancelación',
                message:
                    'Al cancelar la matrícula no habrá reembolso y, si desea continuar en el programa, deberá adquirir un nuevo plan.',
                icon: 'pi pi-exclamation-triangle',
                acceptClass: 'p-button-danger',
                acceptLabel: 'Sí, cancelar',
                rejectLabel: 'No, volver',
                accept: this.deleteEnrollment
            });
        },
        async deleteEnrollment() {
            if (!this.enrollment?.id) return;
            this.deleting = true;
            try {
                ApiService.setHeader();
                await ApiService.delete(`/enrollment/${this.enrollment.id}/`);
                this.toast.add({
                    severity: 'success',
                    summary: 'Eliminada',
                    detail: 'Matrícula cancelada correctamente',
                    life: 2500
                });
                this.$router.push({ path: '/admin/pets' });
            } catch (e) {
                console.error('Error cancelando matrícula:', e);
                this.toast.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: 'No se pudo cancelar la matrícula',
                    life: 3000
                });
            } finally {
                this.deleting = false;
            }
        }
    }
};
</script>
