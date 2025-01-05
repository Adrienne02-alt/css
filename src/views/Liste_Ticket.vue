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
                        <div class="d-flex justify-content-between align-items-center">
                            <h5 class="fw-semibold">Gestion des tickets</h5>
                            <button class="btn btn-warning" data-bs-toggle="modal" data-bs-target="#addModal" @click="resetModal">
                                Ajouter un ticket
                            </button>
                        </div>
                    </div>
                    <div class="row p-4">
                        <div class="col-md-4" v-for="ticket in tickets.filter(ticket => ticket.employe.id===userId)" :key="ticket.id">
                            <div class="card">
                                <div class="card-header bg-danger text-white">
                                    {{ ticket.categorie.nom }} - (#{{ ticket.id }})
                                </div>
                                <div class="card-body">
                                    <h5 class="card-title">{{ ticket.titre }}</h5>
                                    <p><span class="fw-bold">Description :</span> {{ ticket.description }}</p>
                                    <p><span class="fw-bold">Création :</span> {{ formatDate(ticket.dateCreation) }}</p>
                                    <p><span class="fw-bold">Deadline :</span> {{ formatDate(ticket.deadline) }}</p>
                                    <p><span class="fw-bold">Etat de traitement :</span> {{ ticket.statut }}</p>
                                    <br>
                                    <!-- Buttons for edit and delete -->
                                    <div v-if="ticket.employe && ticket.employe.id === userId">
                                        <button class="btn btn-info" @click="setEditModal(ticket)" data-bs-toggle="modal" data-bs-target="#editModal">
                                            Modifier
                                        </button>
                                        <button class="btn btn-danger" @click="deleteTicket(ticket.id)">
                                            Supprimer
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Modal d'ajout -->
        <div class="modal fade" id="addModal" tabindex="-1" aria-labelledby="addModalLabel" aria-hidden="true">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="addModalLabel">Ajouter un ticket</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        <form @submit.prevent="addTicket">
                            <div class="mb-3">
                                <label for="ticketTitre" class="form-label">Titre</label>
                                <input type="text" class="form-control" id="ticketTitre" v-model="newTicket.titre" required>
                            </div>
                            <div class="mb-3">
                                <label for="ticketDescription" class="form-label">Description</label>
                                <textarea class="form-control" id="ticketDescription" v-model="newTicket.description" required></textarea>
                            </div>
                            <div class="mb-3">
                                <label for="ticketDescription" class="form-label">Deadline</label>
                                <input type="datetime-local" class="form-control" id="ticketDeadline" v-model="newTicket.deadline" />
                            </div>
                            <div class="mb-3">
                                <label for="ticketCategorie" class="form-label">Catégorie</label>
                                <select class="form-control" id="ticketCategorie" v-model="newTicket.categorie" required>
                                    <option v-for="category in categories" :key="category.id" :value="category.nom">
                                        {{ category.nom }}
                                    </option>
                                </select>
                            </div>
                            <div class="modal-footer">
                                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Fermer</button>
                                <button type="submit" class="btn btn-primary">Ajouter</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>

        <!-- Modal de modification -->
        <div class="modal fade" id="editModal" tabindex="-1" aria-labelledby="editModalLabel" aria-hidden="true">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="editModalLabel">Modifier un ticket</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        <form @submit.prevent="updateTicket">
                            <div class="mb-3">
                                <label for="editTicketTitre" class="form-label">Titre</label>
                                <input type="text" class="form-control" id="editTicketTitre" v-model="currentTicket.titre" required>
                            </div>
                            <div class="mb-3">
                                <label for="editTicketDescription" class="form-label">Description</label>
                                <textarea class="form-control" id="editTicketDescription" v-model="currentTicket.description" required></textarea>
                            </div>
                            <div class="mb-3">
                                <label for="ticketDescription" class="form-label">Deadline</label>
                                <input type="datetime-local" class="form-control" id="ticketDeadline" v-model="currentTicket.deadline" />
                            </div>
                            <div class="mb-3">
                                <label for="editTicketCategorie" class="form-label">Catégorie</label>
                                <select class="form-control" id="editTicketCategorie" v-model="currentTicket.categorie" required>
                                    <option v-for="category in categories" :key="category.id" :value="category.nom">
                                        {{ category.nom }}
                                    </option>
                                </select>
                            </div>
                            <div class="modal-footer">
                                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Fermer</button>
                                <button type="submit" class="btn btn-primary">Modifier</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import Menu from '../components/Menu.vue';
import HeaderBar from '../components/HeaderBar.vue';
import { postData, fetchData, putData, deleteData } from '../service/apiService';
import { Modal } from 'bootstrap';

export default {
    name: 'ListeTicketsView',
    components: {
        Menu,
        HeaderBar
    },
    data() {
        return {
            tickets: [],
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
            userId: null  // Store the user id from localStorage
        };
    },
    methods: {
        async loadTickets() {
            this.tickets = await fetchData('/tickets/all');
        },
        async loadCategories() {
            this.categories = await fetchData('/allCategorie');
        },
        async addTicket() {
            const id = this.userId;
            this.newTicket.employe = { id };
            const createdTicket = await postData('/tickets/create', this.newTicket);
            if (createdTicket && createdTicket.id) {
                const historique = {
                    ticket: parseInt(createdTicket.id), // Associe le ticket
                    action: 'Création du ticket',
                    utilisateur: { id }
                };

                // Envoi de l'historique
                await postData('/historique_tickets/create', historique);
            }
            this.loadTickets();
            this.resetModal();
            const addModal = new Modal(document.getElementById('addModal'));
            addModal.hide();
        },
        setEditModal(ticket) {
            this.currentTicket = { ...ticket, categorie: ticket.categorie.nom };
        },
        async updateTicket() {
            const result = await putData(`/tickets/update/${this.currentTicket.id}`, this.currentTicket);
            if(result){
                const historique = {
                    ticket: parseInt(this.currentTicket.id), // Associe le ticket
                    action: 'Modification par les employés',
                    utilisateur: { id: this.userId }
                };
                await postData('/historique_tickets/create', historique);
            }
            this.currentTicket = { id: null, titre: '', description: '', categorie: null, deadline: '' };
            this.loadTickets();
            const editModal = Modal.getInstance(document.getElementById('editModal'));
            editModal.hide();
        },
        async deleteTicket(id) {
            console.log("coucou");
            const historique = {
                ticket: parseInt(id),               // ID du ticket supprimé
                action: 'Suppression du ticket', // Action à enregistrer
                utilisateur: { id: this.userId } // Utilisateur ayant effectué l'action
            };

            console.log(historique);
            await postData('/historique_tickets/create', historique);
            await deleteData(`/tickets/delete/${id}`);
            this.loadTickets();
        },
        resetModal() {
            this.newTicket = { titre: '', description: '', categorie: null, deadline: '',  };
        },
        formatDate(date) {
            const options = { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' };
            return new Date(date).toLocaleString('fr-FR', options);
        }
    },
    mounted() {
        if (typeof window !== "undefined" && localStorage.getItem("id")) {
            this.userId = parseInt(localStorage.getItem("id"));
        }
        this.loadTickets();
        this.loadCategories();
    }
};
</script>

<style>
body {
    background-color: rgb(254, 102, 102);
}
</style>
