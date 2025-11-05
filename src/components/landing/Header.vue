<template>
    <header class="bg-white dark:bg-gray-800 shadow-sm relative">
        <div class="container mx-auto px-6 py-4 flex items-center justify-between">
            <router-link to="/" class="flex items-center gap-3">
                <img src="@/assets/images/logo.png" alt="Logo CanEduca" class="w-12 h-12" />
                <span class="font-semibold text-2xl">CanEduca</span>
            </router-link>

            <!-- Desktop nav -->
            <nav class="hidden md:flex items-center gap-8 text-lg">
                <button class="hover:text-green-700" @click="$emit('cambiar-seccion', 'inicio')">Inicio</button>
                <button class="hover:text-green-700" @click="$emit('cambiar-seccion', 'quienes')">Quiénes somos</button>
                <button class="hover:text-green-700" @click="$emit('cambiar-seccion', 'planes')">Planes</button>
                <button class="hover:text-green-700" @click="$emit('cambiar-seccion', 'contacto')">Contacto</button>
            </nav>

            <!-- Right actions (hidden on mobile) -->
            <div v-if="!isAuth" class="hidden md:flex items-center gap-3">
                <router-link to="/auth/login" class="px-4 py-2 bg-primary-500 text-white rounded hover:opacity-90"
                    >Iniciar sesión</router-link
                >
                <router-link to="/auth/register" class="px-4 py-2 bg-primary-500 text-white rounded hover:opacity-90"
                    >Registrarse</router-link
                >
            </div>
            <div v-if="isAuth" class="hidden md:flex items-center gap-3">
                Hola, {{ user.first_name + ' ' + user.last_name }}
                <router-link to="/dashboard" class="px-4 py-2 bg-primary-500 text-white rounded hover:opacity-90"
                    >Ir al Panel</router-link
                >
            </div>

            <!-- Mobile menu button (always visible on small screens) -->
            <button class="md:hidden p-2 rounded focus:outline-none" aria-label="Abrir menú" @click="toggleMenu">
                <svg
                    class="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M4 6h16M4 12h16M4 18h16"
                    ></path>
                </svg>
            </button>
        </div>

        <!-- Mobile menu (overlay) -->
        <transition name="slide-right">
            <div v-if="menuOpen" class="md:hidden absolute left-0 right-0 bg-white dark:bg-gray-800 shadow-lg z-50">
                <div class="container mx-auto px-6 py-4">
                    <nav class="flex flex-col gap-3">
                        <button
                            class="block py-2 text-left hover:text-green-700"
                            @click="
                                $emit('cambiar-seccion', 'inicio');
                                closeMenu();
                            "
                        >
                            Inicio
                        </button>
                        <button
                            class="block py-2 text-left hover:text-green-700"
                            @click="
                                $emit('cambiar-seccion', 'quienes');
                                closeMenu();
                            "
                        >
                            Quiénes somos
                        </button>
                        <button
                            class="block py-2 text-left hover:text-green-700"
                            @click="
                                $emit('cambiar-seccion', 'planes');
                                closeMenu();
                            "
                        >
                            Planes
                        </button>
                        <button
                            class="block py-2 text-left hover:text-green-700"
                            @click="
                                $emit('cambiar-seccion', 'contacto');
                                closeMenu();
                            "
                        >
                            Contacto
                        </button>
                    </nav>

                    <div v-if="!isAuth" class="mt-4 flex flex-col gap-2">
                        <router-link
                            to="/auth/login"
                            class="w-full text-center px-4 py-2 bg-primary-500 text-white rounded"
                            @click.native="closeMenu"
                            >Iniciar sesión</router-link
                        >
                        <router-link
                            to="/auth/register"
                            class="w-full text-center px-4 py-2 border border-primary-500 rounded"
                            @click.native="closeMenu"
                            >Registrarse</router-link
                        >
                    </div>
                </div>
            </div>
        </transition>

        <hr class="border-t-1 border-green-600 my-2 w-3/4 mx-auto rounded" />
    </header>
</template>

<script>
import { useAuthStore } from '@/stores/auth';

export default {
    name: 'Header',
    emits: ['cambiar-seccion'],
    data() {
        return {
            menuOpen: false,
            isAuth: false,
            user: null
        };
    },
    mounted() {
        const store = useAuthStore();
        this.user = store.user?.user || null;
        console.log('Usuario en Header:', this.user);
        if (this.user && this.user.id) {
            this.isAuth = true;
        }
    },
    methods: {
        toggleMenu() {
            this.menuOpen = !this.menuOpen;
        },
        closeMenu() {
            this.menuOpen = false;
        }
    }
};
</script>

<style scoped>
.container {
    max-width: 1100px;
}
:root {
    --primary-color: #2563eb;
}
.bg-primary-500 {
    background-color: var(--primary-color);
}
</style>
