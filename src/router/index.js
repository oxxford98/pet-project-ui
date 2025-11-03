import AppLayout from '@/layout/AppLayout.vue';
import { createRouter, createWebHistory } from 'vue-router';

const router = createRouter({
    history: createWebHistory(),
    routes: [
        {
            path: '/dashboard',
            component: AppLayout,
            children: [
                {
                    path: '/dashboard',
                    name: 'dashboard',
                    component: () => import('@/views/Dashboard.vue'),
                    meta: {
                        middleware: "auth"
                    }
                },
            ]
        },
         {
            path: '/admin',
            component: AppLayout,
            children: [

                {
                    path: '/admin/users',
                    name: 'users',
                    component: () => import('@/views/users/ListUsers.vue'),
                    meta: {
                        middleware: "auth"
                    }
                },
                {
                    path: '/admin/profile',
                    name: 'profile',
                    component: () => import('@/views/users/ProfileUser.vue'),
                    meta: {
                        middleware: "auth"
                    }
                },
                {
                    path: '/admin/new-pet',
                    name: 'new-pet',
                    component: () => import('@/views/pets/NewPet.vue'),
                    meta: {
                        middleware: "auth"
                    }
                },
                {
                    path: '/admin/pets',
                    name: 'pets',
                    component: () => import('@/views/pets/ListPets.vue'),
                    meta: {
                        middleware: "auth"
                    }
                },

            ]
        },
        {
            path: '/',
            name: 'landing',
            component: () => import('@/views/landing/Landing.vue')
        },
        {
            path: '/test',
            name: 'test-landing',
            component: () => import('@/views/landing/Test.vue')
        },
        {
            path: '/pages/notfound',
            name: 'notfound',
            component: () => import('@/views/pages/NotFound.vue')
        },

        {
            path: '/auth/login',
            name: 'login',
            component: () => import('@/views/pages/auth/Login.vue')
        },
        {
            path: '/auth/access',
            name: 'accessDenied',
            component: () => import('@/views/pages/auth/Access.vue')
        },
        {
            path: '/auth/error',
            name: 'error',
            component: () => import('@/views/pages/auth/Error.vue')
        }
    ]
});

export default router;
