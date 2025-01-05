import { createRouter, createWebHistory } from "vue-router";
import LoginConnexion from '../views/Login.vue';
import Inscription from '../views/Inscription.vue';
import Forget_password from "@/views/Forget_password.vue";
import CategorieView from '@/views/CategorieView.vue';
import Liste_Ticket from "@/views/Liste_Ticket.vue";
import SuiviTicket from "@/views/SuiviTicket.vue";
import AssignationTicketView from "@/views/AssignationTicketView.vue";
import RapportTicket from "@/views/RapportTicket.vue";
import NotationTicket from "@/views/NotationTicket.vue";
import HistoriqueTicket from "@/views/HistoriqueTicket.vue";
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import 'quill/dist/quill.snow.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
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
    {
        path: '/categorie',
        name: 'categorie',
        component: CategorieView,
        meta: { title: 'categorie' }
    },
    {
        path: '/liste_ticket',
        name: 'liste_ticket',
        component: Liste_Ticket,
        meta: { title: 'liste_ticket' }
    },
    {
        path: '/assignation',
        name: 'assignation',
        component: AssignationTicketView,
        meta: { title: 'assignation' }
    },
    {
        path: '/Suivi',
        name: 'Suivi',
        component: SuiviTicket,
        meta: { title: 'Suivi' }
    },
    {
        path: '/Rapport',
        name: 'Rapport',
        component: RapportTicket,
        meta: { title: 'Rapport' }
    },
    {
        path: '/Notation',
        name: 'Notation',
        component: NotationTicket,
        meta: { title: 'Notation' }
    },
    {
        path: '/Historique',
        name: 'Historique',
        component: HistoriqueTicket,
        meta: { title: 'Historique' }
    },
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});
export default router;