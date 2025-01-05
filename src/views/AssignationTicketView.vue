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
                            <h5 class="card-title fw-semibold mb-4">Assignation des tickets</h5>
                        </div>
                    </div>
                    <div class="card-body">
                        <table class="table table-bordered">
                            <thead>
                                <tr>
                                    <th><input type="checkbox" v-model="selectAll" @change="toggleSelectAll"/></th>
                                    <th>Ticket</th>
                                    <th>Etat</th>
                                    <th>Priorité</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="ticket in tickets.filter(ticket => ticket.statut === 'ouvert' && ticket.technicien === null)" :key="ticket.id">
                                    <td><input type="checkbox" v-model="selectedTickets" :value="ticket.id"/></td>
                                    <td>
                                        ({{ ticket.titre }})<br> {{ ticket.description }}
                                        <button class="btn btn-warning float-end" data-bs-toggle="modal" data-bs-target="#ticketModal" 
                                            @click="voirApercu(ticket.description, ticket.categorie, ticket.dateCreation, ticket.deadline, ticket.statut)">
                                            Voir un aperçu
                                        </button>
                                    </td>
                                    <td>
                                        <button class="btn btn-success">
                                            {{ ticket.statut }}
                                        </button>
                                    </td>
                                    <td>
                                        <select class="form-select" v-model="ticket.selectedPriority">
                                            <option value="moyenne"><span class="badge bg-secondary rounded-3 fw-semibold">Moyenne</span></option>
                                            <option value="haute"><span class="badge bg-danger rounded-3 fw-semibold">Haute</span></option>
                                            <option value="basse"><span class="badge bg-success rounded-3 fw-semibold">Basse</span></option>
                                        </select>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                        <div class="d-flex justify-content-end mt-3">
                            <button class="btn btn-primary" @click="assignTickets">
                                Assigner les tickets sélectionnés
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div class="modal fade" id="ticketModal" tabindex="-1" aria-labelledby="ticketModalLabel" aria-hidden="true">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="ticketModalLabel">Aperçu du ticket</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        <p><strong>Description:</strong> {{ currentTicket.description }}</p>
                        <p><strong>Catégorie:</strong> {{ currentTicket.categorie }}</p>
                        <p><strong>Date de création:</strong> {{ formatDate(currentTicket.dateCreation) }}</p>
                        <p><strong>Date de fin:</strong> {{ formatDate(currentTicket.deadline) }}</p>
                        <p><strong>Statut:</strong> {{ currentTicket.statut }}</p>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Fermer</button>
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
    name: 'AssignationTicketsView',
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
            this.tickets = await fetchData('/tickets/all');
        },
        async loadCategories() {
            this.categories = await fetchData('/allCategorie');
        },
        setEditModal(ticket) {
            this.currentTicket = { ...ticket, categorie: ticket.categorie.nom };
        },
        async deleteTicket(id) {
            await deleteData(`/tickets/delete/${id}`);
            this.loadTickets();
        },
        resetModal() {
            this.newTicket = { titre: '', description: '', categorie: null, deadline: '', };
        },
        formatDate(date) {
            const options = { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' };
            return new Date(date).toLocaleString('fr-FR', options);
        },
        // Méthode pour afficher l'aperçu des détails d'un ticket
        voirApercu(description, categorie, dateCreation, deadline, statut) {
            this.currentTicket = { description, categorie, dateCreation, deadline, statut };

            // Initialiser et afficher le modal via Bootstrap
            const modal = new Modal(document.getElementById('ticketModal'));
            modal.show();
        },
        async assignTickets() {
            const technicienId = this.userId; // Récupérer l'ID du technicien depuis localStorage

            try {
                // Mettre à jour uniquement les tickets sélectionnés
                const updatePromises = this.selectedTickets.map(async (ticketId) => {
                    const ticket = this.tickets.find(ticket => ticket.id === ticketId);
                    if (!ticket) return; // Si le ticket n'est pas trouvé, ignorer

                    const updatedTicket = {
                        titre: ticket.titre,                // Titre du ticket
                        description: ticket.description,    // Description du ticket
                        categorie: ticket.categorie,        // Catégorie du ticket
                        date_creation: ticket.date_creation,// Date de création
                        dateMiseAJour: new Date().toISOString(), // Date de mise à jour
                        employe: ticket.employe ? { id: ticket.employe.id } : null, // Employé
                        deadline: ticket.deadline,    
                        technicien: { id: technicienId },   // Technicien assigné
                        statut: 'en_cours',                // Statut changé
                        pourcentage: 0,                    // Pourcentage à 0%
                        priorite: ticket.selectedPriority   // Priorité choisie
                    };

                    try {
                        // Mettre à jour le ticket dans la base de données
                        const createdTicket = await putData(`/tickets/update/${ticketId}`, updatedTicket);
                        if (createdTicket && createdTicket.id) {
                            const historique = {
                                ticket: parseInt(createdTicket.id), // Associe le ticket
                                action: `Assignation de ce ticket par le technicien ${updatedTicket.technicien.id}`,
                                utilisateur: { id: technicienId }
                            };

                            // Envoi de l'historique
                            await postData('/historique_tickets/create', historique);
                        }
                    } catch (error) {
                        console.error(`Erreur lors de la mise à jour du ticket ${ticketId}:`, error);
                    }
                });

                // Attendre que toutes les mises à jour soient terminées
                await Promise.all(updatePromises);

                // Recharger la liste des tickets après mise à jour
                this.loadTickets();

            } catch (error) {
                console.error('Erreur dans assignTickets:', error);
            }
        },
        toggleSelectAll() {
            if (this.selectAll) {
                this.selectedTickets = this.tickets.map(ticket => ticket.id);
            } else {
                this.selectedTickets = [];
            }
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
