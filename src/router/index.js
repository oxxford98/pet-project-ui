import AppLayout from '@/layout/AppLayout.vue';
import { useAuthStore } from '@/stores/auth';
import { createRouter, createWebHistory } from 'vue-router';

const router = createRouter({
    history: createWebHistory(),
    routes: [
        {
            path: '/admin',
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
        // {
        //     path: '/contact',
        //     name: 'contact',
        //     component: () => import('@/views/Contact.vue')
        // },
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
            path: '/auth/register',
            name: 'register',
            component: () => import('@/views/pages/auth/Register.vue')
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

router.beforeEach(async (to, from, next) => {
    const authStore = useAuthStore();

    // Set current page title
    // document.title = `${to.meta.pageTitle} - ${import.meta.env.VITE_APP_TITLE}`;

    try {
        await authStore.verifyAuth();
        if (to.fullPath === '/auth/login') {
            if (authStore.isAuthenticated) {
                next({ name: 'dashboard' });
            }
        }
        if (to.meta.middleware === 'auth') {
            // If route requires authentication
            if (!authStore.isAuthenticated) {
                return next({ name: 'login' });
            }
        }

        // Scroll page to top on every route change
        window.scrollTo({
            top: 0,
            left: 0,
            behavior: 'smooth'
        });

        next();
    } catch (error) {
        next({ name: 'landing' });
    }
});

export default router;
