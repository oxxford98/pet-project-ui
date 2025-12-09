<template>
    <div class="grid grid-cols-1 gap-6">
        <!-- Page Header -->
        <div class="flex items-center justify-between">
            <div>
                <h2 class="text-2xl font-bold text-gray-800">Dashboard Director</h2>
                <p class="text-gray-600 mt-1">Panel de control y estadísticas generales</p>
            </div>
            <div class="text-right">
                <div class="text-sm text-gray-500">Año</div>
                <div class="text-2xl font-bold text-primary">2025</div>
            </div>
        </div>

        <!-- Charts Section -->
        <div class="grid grid-cols-1 xl:grid-cols-2 gap-4">
            <!-- 1. Monthly Income Chart -->
            <Card>
                <template #title>
                    <div class="flex items-center gap-2">
                        <i class="pi pi-dollar text-green-600"></i>
                        <span>Ingresos Mensuales 2025</span>
                    </div>
                </template>
                <template #content>
                    <Chart type="bar" :data="monthlyIncomeData" :options="barChartOptions" class="h-80" />
                </template>
            </Card>

            <!-- 2. Monthly Enrollments Chart -->
            <Card>
                <template #title>
                    <div class="flex items-center gap-2">
                        <i class="pi pi-chart-line text-blue-600"></i>
                        <span>Caninos Matriculados por Mes</span>
                    </div>
                </template>
                <template #content>
                    <Chart type="line" :data="monthlyEnrollmentsData" :options="lineChartOptions" class="h-80" />
                </template>
            </Card>

            <!-- 3. Size Distribution Pie Chart -->
            <Card>
                <template #title>
                    <div class="flex items-center gap-2">
                        <i class="pi pi-chart-pie text-purple-600"></i>
                        <span>Distribución por Tamaño de Perros</span>
                    </div>
                </template>
                <template #content>
                    <Chart type="doughnut" :data="sizeDistributionData" :options="pieChartOptions" class="h-80" />
                </template>
            </Card>

            <!-- 4. Top Plans Chart -->
            <Card>
                <template #title>
                    <div class="flex items-center gap-2">
                        <i class="pi pi-star text-orange-600"></i>
                        <span>Top 5 Planes Más Populares</span>
                    </div>
                </template>
                <template #content>
                    <Chart type="bar" :data="topPlansData" :options="horizontalBarChartOptions" class="h-80" />
                </template>
            </Card>
        </div>

        <!-- Tables Section -->
        <div class="grid grid-cols-1 xl:grid-cols-2 gap-4">
            <!-- 1. Recent Enrollments Table -->
            <Card>
                <template #title>
                    <div class="flex items-center gap-2">
                        <i class="pi pi-clock text-blue-600"></i>
                        <span>Últimas Matrículas Creadas</span>
                    </div>
                </template>
                <template #content>
                    <DataTable 
                        :value="recentEnrollments" 
                        size="small" 
                        striped-rows
                        :rows="5"
                        :loading="loadingTables"
                    >
                        <template #empty>No hay matrículas recientes</template>
                        <Column field="canine_name" header="Canino" sortable />
                        <Column field="client_name" header="Cliente" sortable />
                        <Column field="plan_name" header="Plan" sortable />
                        <Column field="start_date" header="Fecha Inicio" sortable>
                            <template #body="{ data }">
                                {{ formatDate(data.start_date) }}
                            </template>
                        </Column>
                        <Column field="is_active" header="Estado">
                            <template #body="{ data }">
                                <Tag 
                                    :severity="data.is_active ? 'success' : 'danger'"
                                    :value="data.is_active ? 'Activa' : 'Inactiva'"
                                />
                            </template>
                        </Column>
                    </DataTable>
                </template>
            </Card>

            <!-- 2. Expiring Enrollments Table -->
            <Card>
                <template #title>
                    <div class="flex items-center gap-2">
                        <i class="pi pi-calendar-times text-orange-600"></i>
                        <span>Matrículas Próximas a Vencer</span>
                    </div>
                </template>
                <template #content>
                    <DataTable 
                        :value="expiringEnrollments" 
                        size="small" 
                        striped-rows
                        :rows="5"
                        :loading="loadingTables"
                    >
                        <template #empty>No hay matrículas próximas a vencer</template>
                        <Column field="canine_name" header="Canino" sortable />
                        <Column field="client_name" header="Cliente" sortable />
                        <Column field="plan_name" header="Plan" sortable />
                        <Column field="end_date" header="Vencimiento" sortable>
                            <template #body="{ data }">
                                {{ formatDate(data.end_date) }}
                            </template>
                        </Column>
                        <Column field="days_remaining" header="Días">
                            <template #body="{ data }">
                                <Tag 
                                    :severity="getDaysRemainingSeverity(data.days_remaining)"
                                    :value="`${data.days_remaining} días`"
                                />
                            </template>
                        </Column>
                    </DataTable>
                </template>
            </Card>

            <!-- 3. Top Clients Table -->
            <Card>
                <template #title>
                    <div class="flex items-center gap-2">
                        <i class="pi pi-users text-green-600"></i>
                        <span>Top 10 Clientes con Más Mascotas</span>
                    </div>
                </template>
                <template #content>
                    <DataTable 
                        :value="topClients" 
                        size="small" 
                        striped-rows
                        :rows="5"
                        :loading="loadingTables"
                    >
                        <template #empty>No hay datos de clientes</template>
                        <Column field="client_name" header="Cliente" sortable />
                        <Column field="email" header="Email" sortable />
                        <Column field="total_pets" header="# Mascotas" sortable>
                            <template #body="{ data }">
                                <span class="font-semibold text-blue-600">{{ data.total_pets }}</span>
                            </template>
                        </Column>
                        <Column field="active_enrollments" header="# Matrículas" sortable>
                            <template #body="{ data }">
                                <span class="font-semibold text-green-600">{{ data.active_enrollments }}</span>
                            </template>
                        </Column>
                    </DataTable>
                </template>
            </Card>

            <!-- 4. Income by Plan Table -->
            <Card>
                <template #title>
                    <div class="flex items-center gap-2">
                        <i class="pi pi-money-bill text-purple-600"></i>
                        <span>Ingresos por Plan</span>
                    </div>
                </template>
                <template #content>
                    <DataTable 
                        :value="incomeByPlan" 
                        size="small" 
                        striped-rows
                        :rows="5"
                        :loading="loadingTables"
                    >
                        <template #empty>No hay datos de ingresos</template>
                        <Column field="plan_name" header="Plan" sortable />
                        <Column field="enrollments_count" header="# Matrículas" sortable>
                            <template #body="{ data }">
                                <span class="font-semibold">{{ data.enrollments_count }}</span>
                            </template>
                        </Column>
                        <Column field="total_income" header="Ingreso Total" sortable>
                            <template #body="{ data }">
                                <span class="font-semibold text-green-600">{{ formatPrice(data.total_income) }}</span>
                            </template>
                        </Column>
                        <Column field="percentage" header="% Total" sortable>
                            <template #body="{ data }">
                                <span class="text-sm font-medium">{{ data.percentage }}%</span>
                            </template>
                        </Column>
                    </DataTable>
                </template>
            </Card>
        </div>
    </div>
</template>

<script>
import Card from 'primevue/card'
import Chart from 'primevue/chart'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import Tag from 'primevue/tag'
import ApiService from '@/service/ApiService'
import { useToast } from 'primevue/usetoast'

ApiService.setHeader()

export default {
    name: 'Dashboard',
    components: {
        Card,
        Chart,
        DataTable,
        Column,
        Tag
    },
    data() {
        return {
            loadingCharts: false,
            loadingTables: false,
            
            // Chart 1: Monthly Income
            monthlyIncomeData: {
                labels: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'],
                datasets: [
                    {
                        label: 'Ingresos (COP)',
                        data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                        backgroundColor: 'rgba(34, 197, 94, 0.8)',
                        borderColor: 'rgba(34, 197, 94, 1)',
                        borderWidth: 2,
                        borderRadius: 8
                    }
                ]
            },
            
            // Chart 2: Monthly Enrollments
            monthlyEnrollmentsData: {
                labels: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'],
                datasets: [
                    {
                        label: 'Matrículas',
                        data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                        fill: true,
                        borderColor: 'rgba(59, 130, 246, 1)',
                        backgroundColor: 'rgba(59, 130, 246, 0.2)',
                        tension: 0.4,
                        borderWidth: 3
                    }
                ]
            },
            
            // Chart 3: Size Distribution
            sizeDistributionData: {
                labels: ['Pequeño', 'Mediano', 'Grande'],
                datasets: [
                    {
                        data: [0, 0, 0],
                        backgroundColor: [
                            'rgba(147, 51, 234, 0.8)',
                            'rgba(59, 130, 246, 0.8)',
                            'rgba(34, 197, 94, 0.8)'
                        ],
                        borderColor: [
                            'rgba(147, 51, 234, 1)',
                            'rgba(59, 130, 246, 1)',
                            'rgba(34, 197, 94, 1)'
                        ],
                        borderWidth: 2
                    }
                ]
            },
            
            // Chart 4: Top Plans
            topPlansData: {
                labels: [],
                datasets: [
                    {
                        label: 'Matrículas Activas',
                        data: [],
                        backgroundColor: 'rgba(249, 115, 22, 0.8)',
                        borderColor: 'rgba(249, 115, 22, 1)',
                        borderWidth: 2,
                        borderRadius: 8
                    }
                ]
            },
            
            // Chart Options
            barChartOptions: {
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
            
            lineChartOptions: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: true,
                        position: 'top'
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            stepSize: 1
                        }
                    }
                }
            },
            
            pieChartOptions: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom'
                    },
                    tooltip: {
                        callbacks: {
                            label: (context) => {
                                const label = context.label || ''
                                const value = context.parsed || 0
                                const total = context.dataset.data.reduce((a, b) => a + b, 0)
                                const percentage = ((value / total) * 100).toFixed(1)
                                return `${label}: ${value} (${percentage}%)`
                            }
                        }
                    }
                }
            },
            
            horizontalBarChartOptions: {
                indexAxis: 'y',
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: true,
                        position: 'top'
                    }
                },
                scales: {
                    x: {
                        beginAtZero: true,
                        ticks: {
                            stepSize: 1
                        }
                    }
                }
            },
            
            // Tables Data
            recentEnrollments: [],
            expiringEnrollments: [],
            topClients: [],
            incomeByPlan: []
        }
    },
    mounted() {
        this.loadDashboardData()
    },
    methods: {
        async loadDashboardData() {
            await Promise.all([
                this.loadChartData(),
                this.loadTableData()
            ])
        },
        
        async loadChartData() {
            this.loadingCharts = true
            try {
                await Promise.all([
                    this.loadMonthlyIncome(),
                    this.loadMonthlyEnrollments(),
                    this.loadSizeDistribution(),
                    this.loadTopPlans()
                ])
            } catch (error) {
                console.error('Error al cargar gráficas:', error)
            } finally {
                this.loadingCharts = false
            }
        },
        
        async loadTableData() {
            this.loadingTables = true
            try {
                await Promise.all([
                    this.loadRecentEnrollments(),
                    this.loadExpiringEnrollments(),
                    this.loadTopClients(),
                    this.loadIncomeByPlan()
                ])
            } catch (error) {
                console.error('Error al cargar tablas:', error)
            } finally {
                this.loadingTables = false
            }
        },
        
        // Chart Data Loaders
        async loadMonthlyIncome() {
            try {
                const currentYear = new Date().getFullYear()
                const { data } = await ApiService.get(`/user/director-stats-monthly-spending`)
                
                const monthlyAmounts = new Array(12).fill(0)
                data.monthly_data.forEach(item => {
                    monthlyAmounts[item.month - 1] = parseFloat(item.amount) || 0
                })
                
                this.monthlyIncomeData.datasets[0].data = monthlyAmounts
            } catch (error) {
                console.error('Error al cargar ingresos mensuales:', error)
            }
        },
        
        async loadMonthlyEnrollments() {
            try {
                const currentYear = new Date().getFullYear()
                const { data } = await ApiService.get(`/user/director-global-monthly-enrollments-count`)
                
                const monthlyEnrollments = new Array(12).fill(0)
                data.monthly_data.forEach(item => {
                    monthlyEnrollments[item.month - 1] = parseInt(item.count) || 0
                })
                
                this.monthlyEnrollmentsData.datasets[0].data = monthlyEnrollments
            } catch (error) {
                console.error('Error al cargar matrículas mensuales:', error)
            }
        },
        
        async loadSizeDistribution() {
            try {
                const { data } = await ApiService.get('/user/director-enrolled-by-size')
                
                this.sizeDistributionData.datasets[0].data = [
                    data.small || 0,
                    data.medium || 0,
                    data.large || 0
                ]
            } catch (error) {
                console.error('Error al cargar distribución de tamaños:', error)
            }
        },
        
        async loadTopPlans() {
            try {
                const { data } = await ApiService.get('/director/dashboard/top-plans')
                
                this.topPlansData.labels = data.map(item => item.plan_name)
                this.topPlansData.datasets[0].data = data.map(item => item.enrollments_count)
            } catch (error) {
                console.error('Error al cargar planes populares:', error)
            }
        },
        
        // Table Data Loaders
        async loadRecentEnrollments() {
            try {
                const { data } = await ApiService.get('/director/dashboard/recent-enrollments?limit=10')
                this.recentEnrollments = data
            } catch (error) {
                console.error('Error al cargar matrículas recientes:', error)
            }
        },
        
        async loadExpiringEnrollments() {
            try {
                const { data } = await ApiService.get('/director/dashboard/expiring-enrollments?limit=10')
                this.expiringEnrollments = data
            } catch (error) {
                console.error('Error al cargar matrículas por vencer:', error)
            }
        },
        
        async loadTopClients() {
            try {
                const { data } = await ApiService.get('/director/dashboard/top-clients?limit=10')
                this.topClients = data
            } catch (error) {
                console.error('Error al cargar top clientes:', error)
            }
        },
        
        async loadIncomeByPlan() {
            try {
                const { data } = await ApiService.get('/director/dashboard/income-by-plan')
                this.incomeByPlan = data
            } catch (error) {
                console.error('Error al cargar ingresos por plan:', error)
            }
        },
        
        // Utility Methods
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
        
        getDaysRemainingSeverity(days) {
            if (days <= 7) return 'danger'
            if (days <= 15) return 'warn'
            return 'info'
        }
    }
}
</script>