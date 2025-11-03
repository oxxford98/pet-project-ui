<template>
  <header class="bg-white dark:bg-gray-800 shadow-sm relative">
    <div class="container mx-auto px-6 py-4 flex items-center justify-between">
      <router-link to="/" class="flex items-center gap-3">
        <img src="@/assets/images/logo.png" alt="Logo CanEduca" class="w-12 h-12" />
        <span class="font-semibold text-2xl">CanEduca</span>
      </router-link>

<!-- Desktop nav -->
      <nav class="hidden md:flex items-center gap-8 text-lg">
        <button @click="$emit('cambiar-seccion', 'inicio')" class="hover:text-green-700">Inicio</button>
        <button @click="$emit('cambiar-seccion', 'quienes')" class="hover:text-green-700">Quiénes somos</button>
        <button @click="$emit('cambiar-seccion', 'planes')" class="hover:text-green-700">Planes</button>
        <button @click="$emit('cambiar-seccion', 'contacto')" class="hover:text-green-700">Contacto</button>
      </nav>

      <!-- Right actions (hidden on mobile) -->
      <div class="hidden md:flex items-center gap-3">
        <router-link to="/auth/login" class="px-4 py-2 bg-primary-500 text-white rounded hover:opacity-90">Iniciar sesión</router-link>
        <router-link to="/auth/register" class="px-4 py-2 bg-primary-500 text-white rounded hover:opacity-90">Registrarse</router-link>
      </div>

      <!-- Mobile menu button (always visible on small screens) -->
      <button @click="toggleMenu" class="md:hidden p-2 rounded focus:outline-none" aria-label="Abrir menú">
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>
        </svg>
      </button>
    </div>

    <!-- Mobile menu (overlay) -->
    <transition name="slide-right">
      <div v-if="menuOpen" class="md:hidden absolute left-0 right-0 bg-white dark:bg-gray-800 shadow-lg z-50">
        <div class="container mx-auto px-6 py-4">
          <nav class="flex flex-col gap-3">
            <router-link @click.native="closeMenu" to="#" class="block py-2">Inicio</router-link>
            <router-link @click.native="closeMenu" to="#" class="block py-2">Quiénes somos</router-link>
            <router-link @click.native="closeMenu" to="#" class="block py-2">Planes</router-link>
            <router-link @click.native="closeMenu" to="#" class="block py-2">Contacto</router-link>
          </nav>

          <div class="mt-4 flex flex-col gap-2">
            <router-link @click.native="closeMenu" to="/auth/login" class="w-full text-center px-4 py-2 bg-primary-500 text-white rounded">Iniciar sesión</router-link>
            <router-link @click.native="closeMenu" to="/auth/register" class="w-full text-center px-4 py-2 border border-primary-500 rounded">Registrarse</router-link>
          </div>
        </div>
      </div>
    </transition>

    <hr class="border-t-1 border-green-600 my-2 w-3/4 mx-auto rounded" />
  </header>
</template>

<script setup>
import { ref } from 'vue'

const menuOpen = ref(false)

function toggleMenu() {
  menuOpen.value = !menuOpen.value
}

function closeMenu() {
  menuOpen.value = false
}
</script>

<style scoped>
.container{max-width:1100px}
:root{--primary-color:#2563eb}
.bg-primary-500{background-color:var(--primary-color)}


</style>
