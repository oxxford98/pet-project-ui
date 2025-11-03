<script setup>
import { ref, computed } from 'vue';

import { useAuthStore } from '@/stores/auth.js'
import AppMenuItem from './AppMenuItem.vue';

const store = useAuthStore();

const model = ref([
    {
        label: 'Inicio',
        items: [{ label: 'Dashboard', icon: 'pi pi-fw pi-home', to: '/' }]
    },
    {
        label: 'Usuarios',
        items: [
            {
                label: 'Usuarios',
                icon: 'pi pi-fw pi-user',
                to: '/admin/users'
            },
            {
                label: 'Clientes',
                icon: 'pi pi-fw pi-user',
                to: '/admin/clients'
            },
        ]
    },
    {
        label: 'Perfil',
        items: [
            {
                label: 'Mi Perfil',
                icon: 'pi pi-fw pi-id-card',
                to: '/admin/profile'
            },
        ]
    },
    {
        label: 'Mascotas',
        items: [
            {
                label: 'Agregar Mascota',
                icon: 'pi pi-fw pi-plus',
                to: '/admin/new-pet'
            },
            {
                label: 'Mis Mascotas',
                icon: 'pi pi-fw pi-heart',
                to: '/admin/pets'
            },
        ]
    },
    
]);
</script>

<template>
    <ul class="layout-menu">
        <template v-for="(item, i) in model" :key="item">
            <app-menu-item v-if="!item.separator" :item="item" :index="i"></app-menu-item>
            <li v-if="item.separator" class="menu-separator"></li>
        </template>
    </ul>
</template>

<style lang="scss" scoped></style>
