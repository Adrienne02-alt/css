import { createRouter, createWebHistory } from "vue-router";
import LoginConnexion from '../views/Login.vue';
import Inscription from '../views/Inscription.vue';
import Forget_password from "@/views/Forget_password.vue";
const routes = [
    {
        path: '/',
        name: 'LoginConnexion',
        component: LoginConnexion,
        meta: { title: 'Connexion' }
    },
    {
        path: '/inscription',
        name: 'Inscription',
        component: Inscription,
        meta: { title: 'Inscription' }
    },
    {
        path: '/forget_password',
        name: 'forget_password',
        component: Forget_password,
        meta: { title: 'forget_password' }
    },

];

const router = createRouter({
    history: createWebHistory(),
    routes,
});
export default router;