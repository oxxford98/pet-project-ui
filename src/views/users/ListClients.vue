<template>
    <Toast />
    <Card>
        <template #content>
            <div class="flex justify-between items-center mb-4">
                <div class="font-semibold text-xl">Listado de Clientes</div>
            </div>
            
            <!-- Global Search -->
            <div class="mb-4">
                <InputText
                    v-model="globalSearch"
                    placeholder="Buscar clientes..."
                    class="w-full"
                >
                    <template #prefix>
                        <i class="pi pi-search" />
                    </template>
                </InputText>
            </div>

            <DataTable
                :value="filteredClients"
                size="small"
                paginator
                :rows="10"
                :rows-per-page-options="[5, 10, 20, 50]"
                striped-rows
                row-hover
                :loading="loading"
            >
                <template #empty> No hay clientes para mostrar </template>
                <Column field="first_name" header="Nombre" sortable />
                <Column field="second_name" header="Segundo Nombre" sortable />
                <Column field="last_name" header="Apellido" sortable />
                <Column field="second_last_name" header="Segundo Apellido" sortable />
                <Column field="identification" header="Identificación" sortable />
                <Column field="email" header="Email" sortable />
                <Column field="cellphone" header="Teléfono" sortable />
                <Column header="Rol">
                    <template #body>
                        Cliente
                    </template>
                </Column>
            </DataTable>
        </template>
    </Card>
</template>

<script>
import ApiService from '@/service/ApiService';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Card from 'primevue/card';
import InputText from 'primevue/inputtext';
import Toast from 'primevue/toast';
import { useToast } from 'primevue/usetoast';

ApiService.setHeader();

export default {
    name: 'ListClients',
    components: {
        DataTable,
        Column,
        Card,
        InputText,
        Toast
    },
    data() {
        return {
            clients: [],
            globalSearch: '',
            toast: null,
            loading: false
        };
    },
    computed: {
        filteredClients() {
            if (!this.globalSearch) {
                return this.clients;
            }

            const search = this.globalSearch.toLowerCase();
            return this.clients.filter(client => {
                return (
                    client.first_name?.toLowerCase().includes(search) ||
                    client.second_name?.toLowerCase().includes(search) ||
                    client.last_name?.toLowerCase().includes(search) ||
                    client.second_last_name?.toLowerCase().includes(search) ||
                    client.identification?.toLowerCase().includes(search) ||
                    client.email?.toLowerCase().includes(search) ||
                    client.cellphone?.toLowerCase().includes(search)
                );
            });
        }
    },
    mounted() {
        this.toast = useToast();
        this.loadClients();
    },
    methods: {
        async loadClients() {
            this.loading = true;
            try {
                const { data } = await ApiService.get('/user/director-clients-list');
                this.clients = data;
            } catch (error) {
                console.error('Error al cargar clientes:', error);
                this.toast.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: 'No se pudieron cargar los clientes',
                    life: 3000
                });
            } finally {
                this.loading = false;
            }
        }
    }
};
</script>