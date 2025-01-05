<template>
    <div class="page-wrapper" id="main-wrapper" data-layout="vertical" data-navbarbg="skin6" data-sidebartype="full"
        data-sidebar-position="fixed" data-header-position="fixed">
        <!-- Sidebar Start -->
        <Menu/>
        <div class="body-wrapper">
            <HeaderBar/>
            <div class="container-fluid">
                <div class="card">
                    <div class="card-header">
                        <div class="d-flex justify-content-between">
                            <h5 class="card-title fw-semibold mb-4">Historiques des tickets</h5>
                        </div>
                    </div>
                    <div class="card-body">
                        <table class="table table-bordered">
                            <thead>
                                <tr>
                                    <th>Ticket</th>
                                    <th>Action</th>
                                    <th>Date</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="ticket in tickets.filter(ticket => ticket.utilisateur.id === this.userId)" :key="ticket.id">
                                    <td>n°{{ticket.id}}</td>
                                    <td>
                                        {{ticket.action}}
                                    </td>
                                    <td>
                                        {{ticket.dateAction}}
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import Menu from '../components/Menu.vue';
import HeaderBar from '../components/HeaderBar.vue';
import { fetchData } from '../service/apiService';

export default {
    name: 'HistoriqueTicketsView',
    components: {
        Menu,
        HeaderBar
    },
    data() {
        return {
            tickets: [],
            selectedTickets: [], // Array to hold selected tickets' IDs
            selectAll: false, // Boolean to control the "Select All" checkbox
            categories: [],
            newTicket: {
                titre: '',
                description: '',
                categorie: null,
                deadline: '',
                employe: '',
            },
            currentTicket: {
                id: null,
                titre: '',
                description: '',
                categorie: null,
                deadline: '',
                employe: '',
            },
            userId: null,  // Store the user id from localStorage
        };
    },
    methods: {
        async loadTickets() {
            this.tickets = await fetchData('/historique_tickets/all');
        },
        formatDate(date) {
            const options = { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' };
            return new Date(date).toLocaleString('fr-FR', options);
        },
    },
    mounted() {
        if (typeof window !== "undefined" && localStorage.getItem("id")) {
            this.userId = parseInt(localStorage.getItem("id"));
        }
        this.loadTickets();
    }
};
</script>

<style>
body {
    background-color: rgb(254, 102, 102);
}
</style>
