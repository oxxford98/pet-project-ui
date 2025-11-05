<script setup lang="ts">
import Header from '@/components/landing/Header.vue';
import Footer from '@/components/landing/Footer.vue';
import { ref } from 'vue';

// Variable reactiva que indica la sección actual (para referencia)
const seccionActual = ref('inicio');

function cambiarSeccion(nombre) {
    seccionActual.value = nombre;

    // Hacer scroll suave a la sección correspondiente con offset para el header fijo
    const elemento = document.getElementById(nombre);
    if (elemento) {
        const headerHeight = 96; // Altura del header fijo (mismo valor que en CSS .page)
        const elementPosition = elemento.offsetTop - headerHeight;

        window.scrollTo({
            top: elementPosition,
            behavior: 'smooth'
        });
    }
}
</script>

<template>
    <Header class="header" @cambiar-seccion="cambiarSeccion" />
    <!-- <Header @cambiar-seccion="cambiarSeccion" /> -->

    <div class="text-center p-8 page">
        <!-- Sección de Inicio -->
        <section id="inicio" class="section-spacing">
            <h1 class="text-5xl font-bold titulo">Bienvenido a CanEduca</h1>
            <p class="text-2xl mt-4">"Formamos vínculos, no solo obediencia."</p>
            <img src="@/assets/images/fondo.png" alt="Fondo" class="mx-auto w-3/4 rounded mt-4" />
        </section>

        <!-- Sección de Quiénes Somos -->
        <section id="quienes" class="section-spacing">
            <h1 class="text-5xl font-bold">¿Quiénes Somos?</h1>
            <div class="flex flex-col md:flex-row items-center gap-6 mt-3">
                <p class="text-2xl md:w-1/2 font-sans-serif">
                    En CanEduca creemos que la educación transforma vidas, tanto humanas como caninas. Somos un equipo
                    apasionado por el bienestar animal, dedicado a enseñar a los tutores a comprender, guiar y cuidar a
                    sus perros de manera respetuosa y amorosa.
                </p>
                <img
                    src="@/assets/images/perro1.jpg"
                    alt="Perro"
                    class="w-full md:w-1/2 rounded shadow-lg object-cover"
                />
            </div>
            <div class="flex flex-col md:flex-row items-center gap-6 mt-3">
                <img
                    src="@/assets/images/perro2.jpg"
                    alt="Perro"
                    class="w-full md:w-1/2 rounded shadow-lg object-cover"
                />
                <p class="text-2xl md:w-1/2 font-sans-serif">
                    Nuestro objetivo es fortalecer el vínculo entre las personas y sus mascotas a través de la educación
                    positiva, la empatía y el respeto por la naturaleza canina. Contamos con entrenadores certificados,
                    especialistas en comportamiento canino y profesionales en bienestar animal que trabajan con técnicas
                    modernas, sin castigos, para crear entornos felices y equilibrados. En CanEduca no solo formamos
                    perros, formamos familias más unidas.
                </p>
            </div>
        </section>

        <!-- Sección de Planes -->
        <section id="planes" class="section-spacing">
            <div>
                <h1 class="text-6xl font-bold">Planes de Entrenamiento</h1>
                <p class="text-xl mt-2 mb-6">
                    Ofrecemos programas personalizados para cada perro y familia. Selecciona la duración y el tipo de
                    transporte al matricularte.
                </p>
                <br />
            </div>
            <div>
                <!-- Imagen transporte a la izquierda -->
                <div class="w-full md:w-1/2 mx-auto mb-6">
                    <img src="@/assets/images/transporte.jpg" alt="Transporte" class="w-full h-64 md:h-auto object-cover rounded shadow-md" />
                </div>

                <!-- Planes a la derecha -->

                <div class="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
                    <!-- Plan corto: 1 mes -->
                    <div class="border rounded-lg p-4 shadow-sm bg-gray-200 flex flex-col justify-between h-full">
                        <div>
                            <h3 class="text-4xl font-semibold mb-2">1 Mes</h3>
                            <div class="text-3xl font-bold text-primary-500 mb-3">$250,000</div>
                            <ul class="text-sm mb-3 space-y-1">
                                <li>
                                    <i class="fa fa-check text-green-500"></i>
                                    Entrenamiento básico
                                </li>
                                <li>
                                    <i class="fa fa-check text-green-500"></i>
                                    1 sesión semanal
                                </li>
                                <li>
                                    <i class="fa fa-check text-green-500"></i>
                                    Evaluación inicial
                                </li>
                            </ul>
                            <div class="text-sm mb-3">
                                <div>No incluye transporte</div>
                            </div>
                        </div>
                        <router-link to="/auth/register" class="inline-block w-full text-center bg-primary-500 text-white py-2 rounded mt-auto">Matricular</router-link>
                    </div>

                    <!-- 1 Bimestre -->
                    <div class="border rounded-lg p-4 shadow-sm bg-gray-200 flex flex-col justify-between h-full">
                        <div>
                            <h3 class="text-4xl font-semibold mb-2">1 Bimestre</h3>
                            <div class="text-3xl font-bold text-primary-500 mb-3">$450,000</div>
                            <ul class="text-sm mb-3 space-y-1">
                                <li>Entrenamiento básico + refuerzo</li>
                                <li>2 sesiones semanales</li>
                                <li>Asesoría a tutores</li>
                            </ul>
                            <div class="text-sm mb-3">
                                <div>No incluye transporte</div>
                            </div>
                        </div>
                        <router-link to="/auth/register" class="inline-block w-full text-center bg-primary-500 text-white py-2 rounded mt-auto">Matricular</router-link>
                    </div>

                    <!-- 1 Trimestre -->
                    <div class="border rounded-lg p-4 shadow-sm bg-gray-200 flex flex-col justify-between h-full">
                        <div>
                            <h3 class="text-4xl font-semibold mb-2">1 Trimestre</h3>
                            <div class="text-3xl font-bold text-primary-500 mb-3">$650,000</div>
                            <ul class="text-sm mb-3 space-y-1">
                                <li>Programa intensivo</li>
                                <li>3 sesiones semanales</li>
                                <li>Seguimiento personalizado</li>
                            </ul>
                            <div class="text-sm mb-3">
                                <div>No incluye transporte</div>
                            </div>
                        </div>
                        <router-link to="/auth/register" class="inline-block w-full text-center bg-primary-500 text-white py-2 rounded mt-auto">Matricular</router-link>
                    </div>

                    <!-- 6 Meses -->
                    <div class="border rounded-lg p-4 shadow-sm bg-gray-200 flex flex-col justify-between h-full">
                        <div>
                            <h3 class="text-4xl font-semibold mb-2">6 Meses</h3>
                            <div class="text-3xl font-bold text-primary-500 mb-3">$1,100,000</div>
                            <ul class="text-sm mb-3 space-y-1">
                                <li>Programa avanzado</li>
                                <li>Sesiones personalizadas</li>
                                <li>Acceso a talleres</li>
                            </ul>
                            <div class="text-sm mb-3">
                                <div class="text-xl font-semibold mb-2">Transporte incluido</div>
                            </div>
                        </div>
                        <router-link to="/auth/register" class="inline-block w-full text-center bg-primary-500 text-white py-2 rounded mt-auto">Matricular</router-link>
                    </div>

                    <!-- 1 Año -->
                    <div class="border rounded-lg p-4 shadow-sm bg-gray-200 flex flex-col justify-between h-full">
                        <div>
                            <h3 class="text-4xl font-semibold mb-2">1 Año</h3>
                            <div class="text-3xl font-bold text-primary-500 mb-3">$1,900,000</div>
                            <ul class="text-sm mb-3 space-y-1">
                                <li>Programa integral</li>
                                <li>Soporte continuo</li>
                                <li>Acceso prioritario a talleres</li>
                            </ul>
                            <div class="text-sm mb-3">
                                <div class="text-xl font-semibold mb-2">Transporte incluido</div>
                            </div>
                        </div>
                        <router-link to="/auth/register" class="inline-block w-full text-center bg-primary-500 text-white py-2 rounded mt-auto">Matricular</router-link>
                    </div>
                </div>
            </div>
        </section></div>
    </section>

    <!-- Sección de Contacto -->
    <section id="contacto" class="section-spacing">
        <div class="max-w-6xl mx-auto bg-white dark:bg-surface-900 rounded-xl shadow-lg overflow-hidden p-6">
            <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
                <!-- Left: Hero / Intro -->
                <div class="lg:col-span-2 p-6">
                    <h1 class="text-4xl font-bold">Contáctanos</h1>
                    <p class="text-lg mt-2 text-muted-color">Estamos listos para ayudarte a fortalecer el vínculo con tu perro. A continuación tienes nuestros datos de contacto y opciones para comunicarte con nuestro equipo.</p>

                    <div class="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div class="p-4 border rounded-lg">
                            <h4 class="font-semibold mb-2">Teléfono</h4>
                            <p class="text-sm">Central (atención): <span class="font-medium">+57 312 555 0199</span></p>
                            <p class="text-sm mt-1">Línea rápida: <span class="font-medium">+57 310 444 7788</span></p>
                        </div>

                        <div class="p-4 border rounded-lg">
                            <h4 class="font-semibold mb-2">Correo</h4>
                            <p class="text-sm">Para información general: <a class="text-primary-600 font-medium" href="mailto:info@caneduca.example">info@caneduca.example</a></p>
                            <p class="text-sm mt-1">Matriculas: <a class="text-primary-600 font-medium" href="mailto:matriculas@caneduca.example">matriculas@caneduca.example</a></p>
                        </div>
                    </div>

                    <div class="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div class="p-4 border rounded-lg">
                            <h4 class="font-semibold mb-2">Dirección</h4>
                            <p class="text-sm">Cll 123 #45-67, Barrio Demo — Bogotá, Colombia</p>
                            <p class="text-sm mt-1">Ver en mapa: <a class="text-primary-600" href="#">Ubicación demo</a></p>
                        </div>

                        <div class="p-4 border rounded-lg">
                            <h4 class="font-semibold mb-2">Horario</h4>
                            <p class="text-sm">Lun - Vie: 07:00 - 19:00</p>
                            <p class="text-sm">Sáb: 08:00 - 14:00 · Dom: Cerrado</p>
                        </div>
                    </div>

                    <div class="mt-6">
                        <h4 class="font-semibold mb-2">Contacto rápido</h4>
                        <p class="text-sm mb-3">¿Quieres que te contactemos por WhatsApp o email? Usa el botón a continuación para escribirnos directamente.</p>
                        <div class="flex gap-3 justify-center">
                            <Button icon="fa-brands fa-whatsapp" as="a" href="https://wa.me/573125550199" target="_blank" label="Enviar WhatsApp"></Button>
                            <Button severity="secondary" icon="fa fa-envelope" as="a" href="mailto:info@caneduca.example?subject=Consulta%20desde%20landing" label="Enviar correo"></Button>
                        </div>
                    </div>
                </div>

                <!-- Right: Mini contact card / demo form (static) -->
                <aside class="p-4 bg-gradient-to-br from-primary-500 to-green-400 text-white rounded-lg my-auto">
                    <h3 class="text-xl font-bold mb-2">Habla con un asesor</h3>
                    <p class="text-sm opacity-90 mb-4">Nuestro equipo responde en menos de 24 horas. También puedes reservar una visita o solicitar matrícula.</p>

                    <div class="space-y-3">
                        <div class="text-sm">
                            <div class="opacity-80">Asesor disponible</div>
                            <div class="font-semibold">Laura Gómez</div>
                            <div class="text-xs">Especialista en socialización</div>
                        </div>

                        <div class="text-sm">
                            <div class="opacity-80">Teléfono</div>
                            <div class="font-semibold">+57 310 444 7788</div>
                        </div>

                        <div class="pt-3">
                            <a href="mailto:asistencia@caneduca.example?subject=Quiero%20info%20de%20matr%C3%ADcula" class="block w-full text-center bg-white text-primary-600 py-2 rounded font-semibold">Solicitar matrícula</a>
                        </div>
                    </div>
                </aside>
            </div>
        </div>
    </section>
    </div>
    <Footer />
</template>
<style>
.section-spacing {
    padding: 40px 0 60px 0;
    display: flex;
    flex-direction: column;
    justify-content: center;
}

.fondo {
    width: 75%;
    margin: auto;
    border-radius: 8px 8px 0 0;
    margin-bottom: 1rem;
}
.titulo {
    box-sizing: border-box;
    font-size: 3rem;
    font-weight: bold;
    text-align: center;
    margin-top: 0;
    margin-bottom: 0.5rem;
}
h2 {
    font-size: 1.5rem;
    text-align: center;
    margin-bottom: 2rem;
}
.header {
    box-sizing: content-box;
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    z-index: 50; /* asegurar que el header quede sobre el contenido */
}

/* Añadir espacio superior para que el contenido no quede detrás del header fijo */
.page {
    padding-top: 96px; /* ajusta según la altura real del header */
}
</style>
