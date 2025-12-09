<template>
    <div class="grid grid-cols-1 gap-6">
        <!-- Stats Cards Row -->
        <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
            <!-- Total Pets Card -->
            <Card class="bg-gradient-to-br from-blue-500 to-blue-600 text-white">
                <template #content>
                    <div class="flex items-center justify-between">
                        <div>
                            <div class="text-sm opacity-90 mb-1">Total Mascotas</div>
                            <div class="text-3xl font-bold">{{ stats.totalPets }}</div>
                        </div>
                        <div class="text-5xl opacity-80">
                            <i class="pi pi-heart"></i>
                        </div>
                    </div>
                </template>
            </Card>

            <!-- Enrolled Pets Card -->
            <Card class="bg-gradient-to-br from-green-500 to-green-600 text-white">
                <template #content>
                    <div class="flex items-center justify-between">
                        <div>
                            <div class="text-sm opacity-90 mb-1">Mascotas Matriculadas</div>
                            <div class="text-3xl font-bold">{{ stats.enrolledPets }}</div>
                        </div>
                        <div class="text-5xl opacity-80">
                            <i class="pi pi-check-circle"></i>
                        </div>
                    </div>
                </template>
            </Card>

            <!-- Pending Enrollment Card -->
            <Card class="bg-gradient-to-br from-orange-500 to-orange-600 text-white">
                <template #content>
                    <div class="flex items-center justify-between">
                        <div>
                            <div class="text-sm opacity-90 mb-1">Por Matricular</div>
                            <div class="text-3xl font-bold">{{ stats.pendingEnrollment }}</div>
                        </div>
                        <div class="text-5xl opacity-80">
                            <i class="pi pi-clock"></i>
                        </div>
                    </div>
                </template>
            </Card>

            <!-- Total Spent Card -->
            <Card class="bg-gradient-to-br from-purple-500 to-purple-600 text-white">
                <template #content>
                    <div class="flex items-center justify-between">
                        <div>
                            <div class="text-sm opacity-90 mb-1">Gasto Total 2025</div>
                            <div class="text-2xl font-bold">{{ formatPrice(stats.totalSpent) }}</div>
                        </div>
                        <div class="text-5xl opacity-80">
                            <i class="pi pi-dollar"></i>
                        </div>
                    </div>
                </template>
            </Card>
        </div>

        <!-- Charts Row -->
        <div class="grid grid-cols-1 xl:grid-cols-2 gap-4">
            <!-- Monthly Spending Chart -->
            <Card>
                <template #title>
                    <div class="flex items-center gap-2">
                        <i class="pi pi-chart-bar text-primary"></i>
                        <span>Gastos Mensuales 2025</span>
                    </div>
                </template>
                <template #content>
                    <Chart type="bar" :data="monthlySpendingData" :options="chartOptions" class="h-80" />
                </template>
            </Card>

            <!-- Enrollment Expiration (Option 1: Timeline) -->
            <Card>
                <template #title>
                    <div class="flex items-center gap-2">
                        <i class="pi pi-calendar text-primary"></i>
                        <span>Vencimientos de Matrículas</span>
                    </div>
                </template>
                <template #content>
                    <Timeline :value="expiringEnrollments" align="left" class="customized-timeline">
                        <template #marker="slotProps">
                            <span 
                                class="flex w-8 h-8 items-center justify-center text-white rounded-full z-10 shadow-lg"
                                :class="getExpirationColorClass(slotProps.item.daysUntilExpiration)"
                            >
                                <i class="pi pi-calendar text-xs"></i>
                            </span>
                        </template>
                        <template #content="slotProps">
                            <div class="p-3 border-l-4 rounded-lg bg-white shadow-sm hover:shadow-md transition-shadow"
                                :class="getExpirationBorderClass(slotProps.item.daysUntilExpiration)"
                            >
                                <div class="flex items-center justify-between mb-2">
                                    <span class="font-semibold text-lg">{{ slotProps.item.canineName }}</span>
                                    <Tag 
                                        :severity="getExpirationSeverity(slotProps.item.daysUntilExpiration)"
                                        :value="getExpirationLabel(slotProps.item.daysUntilExpiration)"
                                    />
                                </div>
                                <div class="text-sm text-gray-600">
                                    <div><strong>Plan:</strong> {{ slotProps.item.planName }}</div>
                                    <div class="mt-1"><strong>Vence:</strong> {{ formatDate(slotProps.item.expirationDate) }}</div>
                                </div>
                            </div>
                        </template>
                    </Timeline>
                    <div v-if="expiringEnrollments.length === 0" class="text-center text-gray-500 py-8">
                        No hay matrículas próximas a vencer
                    </div>
                </template>
            </Card>
        </div>

    </div>
</template>

<script>
import Card from 'primevue/card'
import Chart from 'primevue/chart'
import Timeline from 'primevue/timeline'
import Tag from 'primevue/tag'
import ApiService from '@/service/ApiService'
import { useToast } from 'primevue/usetoast'

ApiService.setHeader()

export default {
    name: 'DashboardClient',
    components: {
        Card,
        Chart,
        Timeline,
        Tag
    },
    data() {
        return {
            stats: {
                totalPets: 0,
                enrolledPets: 0,
                pendingEnrollment: 0,
                totalSpent: 0
            },
            monthlySpendingData: {
                labels: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'],
                datasets: [
                    {
                        label: 'Gasto en Planes (COP)',
                        data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                        backgroundColor: 'rgba(99, 102, 241, 0.8)',
                        borderColor: 'rgba(99, 102, 241, 1)',
                        borderWidth: 2,
                        borderRadius: 8
                    }
                ]
            },
            chartOptions: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: true,
                        position: 'top'
                    },
                    tooltip: {
                        callbacks: {
                            label: (context) => {
                                return this.formatPrice(context.parsed.y)
                            }
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            callback: (value) => {
                                return new Intl.NumberFormat('es-CO', {
                                    style: 'currency',
                                    currency: 'COP',
                                    minimumFractionDigits: 0
                                }).format(value)
                            }
                        }
                    }
                }
            },
            // Expiring enrollments data (hardcoded for now)
            expiringEnrollments: [
                {
                    canineName: 'Rocky',
                    planName: 'Plan Básico Mensual',
                    expirationDate: '2025-12-15',
                    daysUntilExpiration: 6
                },
                {
                    canineName: 'Luna',
                    planName: 'Plan Premium Trimestral',
                    expirationDate: '2025-12-28',
                    daysUntilExpiration: 19
                },
                {
                    canineName: 'Max',
                    planName: 'Plan Completo Anual',
                    expirationDate: '2026-01-15',
                    daysUntilExpiration: 37
                }
            ]
        }
    },
    mounted() {
        this.loadDashboardData()
    },
    methods: {
        async loadDashboardData() {
            this.loading = true
            try {
                // Cargar stats, gastos mensuales y vencimientos en paralelo
                await Promise.all([
                    this.loadStats(),
                    this.loadMonthlySpending(),
                    this.loadExpiringEnrollments()
                ])
            } catch (error) {
                console.error('Error al cargar datos del dashboard:', error)
            } finally {
                this.loading = false
            }
        },
        async loadStats() {
            try {
                const { data } = await ApiService.get('/user/client-stats')
                this.stats = {
                    totalPets: data.total_pets || 0,
                    enrolledPets: data.enrolled_pets || 0,
                    pendingEnrollment: data.pending_enrollment || 0,
                    totalSpent: data.total_spent_2025 || 0
                }
            } catch (error) {
                console.error('Error al cargar estadísticas:', error)
            }
        },
        async loadMonthlySpending() {
            try {
                const currentYear = new Date().getFullYear()
                const { data } = await ApiService.get(`/user/client-stats-monthly-spending?year=${currentYear}`)
                
                // Mapear los datos del backend al formato del gráfico
                const monthlyAmounts = new Array(12).fill(0)
                data.monthly_data.forEach(item => {
                    monthlyAmounts[item.month - 1] = parseFloat(item.amount) || 0
                })
                
                this.monthlySpendingData.datasets[0].data = monthlyAmounts
            } catch (error) {
                console.error('Error al cargar gastos mensuales:', error)
            }
        },
        async loadExpiringEnrollments() {
            try {
                const { data } = await ApiService.get('/user/client-stats-enrollment-canine')
                
                this.expiringEnrollments = data.map(item => ({
                    canineId: item.canine_id,
                    canineName: item.canine_name,
                    planName: item.plan_name,
                    expirationDate: item.end_date,
                    daysUntilExpiration: item.days_until_expiration
                }))
            } catch (error) {
                console.error('Error al cargar vencimientos:', error)
            }
        },
        formatPrice(price) {
            if (!price) return '$0'
            return new Intl.NumberFormat('es-CO', {
                style: 'currency',
                currency: 'COP',
                minimumFractionDigits: 0
            }).format(price)
        },
        formatDate(dateStr) {
            if (!dateStr) return '-'
            const [yyyy, mm, dd] = dateStr.split('-')
            return `${dd}/${mm}/${yyyy}`
        },
        getExpirationSeverity(days) {
            if (days <= 7) return 'danger'
            if (days <= 15) return 'warn'
            if (days <= 30) return 'info'
            return 'success'
        },
        getExpirationLabel(days) {
            if (days <= 0) return 'Vencida'
            if (days === 1) return '1 día'
            if (days <= 7) return `${days} días`
            if (days <= 30) return `${days} días`
            return `${days} días`
        },
        getExpirationColorClass(days) {
            if (days <= 7) return 'bg-red-500'
            if (days <= 15) return 'bg-orange-500'
            if (days <= 30) return 'bg-blue-500'
            return 'bg-green-500'
        },
        getExpirationBorderClass(days) {
            if (days <= 7) return 'border-red-500'
            if (days <= 15) return 'border-orange-500'
            if (days <= 30) return 'border-blue-500'
            return 'border-green-500'
        }
    }
}
</script>

<style scoped>
.customized-timeline :deep(.p-timeline-event-content) {
    line-height: 1;
}

.customized-timeline :deep(.p-timeline-event-opposite) {
    flex: 0;
}
</style>