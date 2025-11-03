<template>
  <footer class="bg-surface-200 dark:bg-surface-900 text-surface-900 dark:text-surface-0 mt-12">
    <div class="container mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-3 gap-8">
      <div>
        <img src="@/assets/images/logo.png" alt="CanEduca" class="w-28 mb-4" />
        <p class="text-sm text-muted-color">CanEduca — educación canina basada en respeto y positivismo. Fortalecemos el vínculo entre familias y sus perros.</p>
      </div>

      <div>
        <h4 class="font-semibold mb-3">Enlaces</h4>
        <ul class="text-sm space-y-2">
          <li><router-link to="#" class="hover:text-primary-500">Inicio</router-link></li>
          <li><router-link to="#" class="hover:text-primary-500">Quienes somos</router-link></li>
          <li><router-link to="#" class="hover:text-primary-500">Planes</router-link></li>
          <li><router-link to="#" class="hover:text-primary-500">Contacto</router-link></li>
        </ul>
      </div>

      <div>
        <h4 class="font-semibold mb-3">Contacto</h4>
        <p class="text-sm">Correo: <a href="mailto:info@caneduca.example" class="text-primary-500">info@caneduca.example</a></p>
        <p class="text-sm mt-2">Tel: <a href="tel:+1234567890" class="text-primary-500">+1 234 567 890</a></p>

        <div class="flex gap-3 mt-4">
          <a href="#" aria-label="Facebook" class="w-8 h-8 rounded-full bg-primary-500 text-white flex items-center justify-center">f</a>
          <a href="#" aria-label="Instagram" class="w-8 h-8 rounded-full bg-primary-500 text-white flex items-center justify-center">ig</a>
          <a href="#" aria-label="Twitter" class="w-8 h-8 rounded-full bg-primary-500 text-white flex items-center justify-center">t</a>
        </div>
      </div>
    </div>

    <div class="border-t border-surface-300 dark:border-surface-800">
      <div class="container mx-auto px-6 py-4 text-center text-sm text-muted-color">© <span>{{ year }}</span> CanEduca. Todos los derechos reservados.</div>
    </div>
  </footer>
</template>

<script setup>
import { ref } from 'vue'
const year = ref(new Date().getFullYear())
</script>

<style scoped>
.container{max-width:1100px}
:root{--primary-color:#2563eb}
.text-muted-color{color:var(--muted,#6b7280)}
.text-primary-500{color:var(--primary-color)}
.bg-primary-500{background-color:var(--primary-color)}
</style>
