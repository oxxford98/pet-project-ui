<script setup lang="ts">
    import Header from '@/components/Header.vue'
</script>

<template>
    <Header class="header"/>
    <Card>
        <template #content>
            <h1 class="titulo">Bienvenido a CanEduca</h1>
            <h2>“Formamos vínculos, no solo obediencia.”</h2>
            <img src="@/assets/images/fondo.png" alt="Fondo" class="fondo" />
                Aquí va el landing page
            <Button icon="pi pi-user" label="Ir al Login" as="a" href="auth/login"></Button>
        </template>
    </Card>
</template>
<style>

.fondo {
    width: 75%;
    margin: auto;
    border-radius: 8px 8px 0 0;
    margin-bottom: 1rem;
}
.titulo {
    font-size: 3rem;
    font-weight: bold;
    text-align: center;
    margin-bottom: 0.5rem;
}
h2 {
    font-size: 1.5rem;
    text-align: center;
    margin-bottom: 2rem;
}
.header {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
}
</style>


