<template>
    <Dialog
        v-model:visible="dialogVisible"
        header="Editar matrícula"
        modal
        :style="{ width: '70vw' }"
        :breakpoints="{ '1199px': '85vw', '575px': '95vw' }"
        @hide="onHide"
    >
        <div class="mb-4 grid grid-cols-2 gap-4">
            <FloatLabel>
                <Select
                    id="transport"
                    v-model="filters.transport"
                    :options="transportOptions"
                    option-label="label"
                    option-value="id"
                    class="w-full"
                />
                <label for="transport">Tipo de transporte</label>
            </FloatLabel>

            <FloatLabel>
                <Select
                    id="duration"
                    v-model="filters.duration"
                    :options="durationOptions"
                    option-label="label"
                    option-value="id"
                    placeholder="Todas"
                    class="w-full"
                />
                <label for="duration">Duración</label>
            </FloatLabel>
        </div>

        <div v-if="loading" class="flex justify-center items-center p-8">
            <ProgressSpinner />
        </div>

        <Message v-else-if="!filteredPlans.length" severity="info" class="w-full">
            No hay planes para los filtros seleccionados.
        </Message>

        <div v-else class="grid grid-cols-12 gap-4">
            <div v-for="plan in filteredPlans" :key="plan.id" class="col-span-12 md:col-span-6 xl:col-span-4">
                <Card
                    :class="
                        plan.id === currentPlanId
                            ? 'ring-2 ring-primary-500 bg-primary-50 border border-primary-200'
                            : ''
                    "
                >
                    <template #header>
                        <div class="p-4">
                            <div class="text-lg font-semibold">{{ plan.name }}</div>
                            <div class="text-surface-500 text-sm">{{ plan.description }}</div>
                        </div>
                    </template>

                    <template #content>
                        <div class="px-4 pb-2 text-sm space-y-1">
                            <div>
                                <span class="font-medium">Vigencia:</span>
                                <span class="ml-1">{{ durationLabel(plan.duration_days) }}</span>
                            </div>
                            <div>
                                <span class="font-medium">Transporte:</span>
                                <span class="ml-1">{{ transportLabel(plan.transport_type) }}</span>
                            </div>
                            <div class="mt-2">
                                <span class="font-medium">Precio:</span>
                                <span class="ml-2 text-green-600 font-semibold">{{ formatCOP(plan.price) }}</span>
                            </div>
                        </div>
                    </template>

                    <template #footer>
                        <div class="flex justify-end p-4">
                            <Button
                                :label="plan.id === currentPlanId ? 'Plan actual' : 'Cambiar a este plan'"
                                icon="pi pi-check-circle"
                                :severity="plan.id === currentPlanId ? 'secondary' : 'success'"
                                :disabled="plan.id === currentPlanId"
                                :outlined="plan.id === currentPlanId"
                                :loading="savingId === plan.id"
                                @click="onSelect(plan)"
                            />
                        </div>
                    </template>
                </Card>
            </div>
        </div>

        <template #footer>
            <div class="flex justify-end gap-2">
                <Button label="Cerrar" icon="pi pi-times" outlined severity="secondary" @click="close" />
            </div>
        </template>
    </Dialog>
</template>

<script>
import Dialog from 'primevue/dialog';
import Card from 'primevue/card';
import Button from 'primevue/button';
import Select from 'primevue/select';
import FloatLabel from 'primevue/floatlabel';
import Message from 'primevue/message';
import ProgressSpinner from 'primevue/progressspinner';
import ApiService from '@/service/ApiService';

export default {
    name: 'EditPlanModal',
    components: { Dialog, Card, Button, Select, FloatLabel, Message, ProgressSpinner },
    props: {
        visible: { type: Boolean, default: false },
        enrollmentId: { type: Number, required: true },
        currentPlanId: { type: Number, required: true },
        currentPlan: { type: Object, default: null }
    },
    emits: ['update:visible', 'updated', 'error'],
    data() {
        return {
            loading: false,
            savingId: null,
            plans: [],
            filters: {
                transport: 1,
                duration: null
            },
            transportOptions: [
                { id: 1, label: 'Transporte completo' },
                { id: 2, label: 'Solo mañana' },
                { id: 3, label: 'Solo tarde' },
                { id: 4, label: 'Sin transporte' }
            ],
            durationOptions: [
                { id: 30, label: 'Mensual (30 días)' },
                { id: 60, label: 'Bimestral (60 días)' },
                { id: 90, label: 'Trimestral (90 días)' },
                { id: 180, label: 'Semestral (180 días)' },
                { id: 365, label: 'Anual (365 días)' }
            ]
        };
    },
    computed: {
        dialogVisible: {
            get() {
                return this.visible;
            },
            set(v) {
                this.$emit('update:visible', v);
            }
        },
        filteredPlans() {
            let out = this.plans.filter(p => p.transport_type === this.filters.transport);
            if (this.filters.duration) out = out.filter(p => p.duration_days === this.filters.duration);
            return out;
        }
    },
    watch: {
        visible(v) {
            if (v) this.loadPlans();
        }
    },
    methods: {
        durationLabel(d) {
            const map = { 30: 'Mensual', 60: 'Bimestral', 90: 'Trimestral', 180: 'Semestral', 365: 'Anual' };
            return map[d] || `${d} días`;
        },
        transportLabel(t) {
            const map = { 1: 'Completo', 2: 'Solo mañana', 3: 'Solo tarde', 4: 'Sin transporte' };
            return map[t] || 'N/D';
        },
        formatCOP(val) {
            const n = typeof val === 'string' ? parseFloat(val) : val;
            return new Intl.NumberFormat('es-CO', {
                style: 'currency',
                currency: 'COP',
                maximumFractionDigits: 0
            }).format(n || 0);
        },
        async loadPlans() {
            this.loading = true;
            try {
                ApiService.setHeader();
                const { data } = await ApiService.get('/plan/');
                this.plans = Array.isArray(data) ? data : [];
                // Prefiltrar con el plan actual si está disponible
                if (this.currentPlan) {
                    this.filters.transport = this.currentPlan.transport_type ?? 1;
                    this.filters.duration = this.currentPlan.duration_days ?? null;
                }
            } catch (e) {
                console.error('Error cargando planes:', e);
                this.$emit('error', 'No se pudieron cargar los planes');
            } finally {
                this.loading = false;
            }
        },
        async onSelect(plan) {
            if (plan.id === this.currentPlanId) return;
            this.savingId = plan.id;
            try {
                ApiService.setHeader();
                await ApiService.patch(`/enrollment/${this.enrollmentId}/`, { plan: plan.id });
                this.$emit('updated', { planId: plan.id });
                this.close();
            } catch (e) {
                console.error('Error actualizando matrícula:', e);
                this.$emit('error', 'No se pudo actualizar la matrícula');
            } finally {
                this.savingId = null;
            }
        },
        onHide() {},
        close() {
            this.dialogVisible = false;
        }
    }
};
</script>
