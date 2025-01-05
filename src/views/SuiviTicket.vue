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
                            <h5 class="card-title fw-semibold mb-4">Suivi de mes tickets</h5>
                            
                        </div>
                    </div>
                    <div class="card-body">
                        <div class="row">
                            <div class="col-md-4" v-for="ticket in tickets.filter(ticket => ticket.employe.id === this.userId || ticket.technicien.id === this.userId)" :key="ticket.id">
                                <div class="card">
                                    <div class="card-header bg-danger text-white">
                                    {{ticket.categorie}}
                                    </div>
                                    <div class="card-body">
                                        <h5 class="card-title">{{ticket.titre}}</h5>
                                        <p><span class="fw-bold">Plaignant :</span> {{nom}} ({{role}})</p>
                                        <p><span class="fw-bold">Description :</span> {{ticket.description}}</p>
                                        <p><span class="fw-bold">Priorité :</span> {{ticket.priorite}}</p>
                                        <p><span class="fw-bold">Deadline :</span> {{ticket.deadline}}</p>
                                        <p><span class="fw-bold">Etat :</span> {{ticket.statut}}</p>
                                        <p><span class="fw-bold">Évolution :</span></p>
                                        <div class="progress">
                                            <div class="progress-bar" role="progressbar" :style="{ width: ticket.pourcentage + '%' }" aria-valuenow="ticket.pourcentage" aria-valuemin="0" aria-valuemax="100">{{ticket.pourcentage}}%</div>
                                        </div>
                                        <br>
                                        <!-- Button Modifier Progress -->
                                        <button class="btn btn-primary" data-bs-toggle="modal" v-if="ticket.technicien && ticket.technicien.id === userId" data-bs-target="#progressModal" @click="setProgress(ticket)">
                                            Modifier Progression
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- Modal pour afficher les détails du ticket -->
    <div class="modal fade" id="ticketModal" tabindex="-1" aria-labelledby="ticketModalLabel" aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="ticketModalLabel">Détails du Ticket</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <p><strong>Titre :</strong> {{ currentTicket.titre }}</p>
                    <p><strong>Catégorie :</strong> {{ currentTicket.categorie }}</p>
                    <p><strong>Date de demande :</strong> {{ formatDate(currentTicket.date_creation) }}</p>
                    <p><strong>Deadline :</strong> {{ formatDate(currentTicket.deadline) }}</p>
                    <p><strong>Date de commencement :</strong> {{ formatDate(currentTicket.dateMiseAJour) }}</p>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Fermer</button>
                </div>
            </div>
        </div>
    </div>

    <!-- Modal pour modifier la progression du ticket -->
    <div class="modal fade" id="progressModal" tabindex="-1" aria-labelledby="progressModalLabel" aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="progressModalLabel">Modifier Progression</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <p><strong>Ticket :</strong> {{ currentTicket.titre }}</p>
                    <div class="mb-3">
                        <label for="progressSlider" class="form-label">Évolution (en %)</label>
                        <input type="range" class="form-range" id="progressSlider" min="0" max="100" v-model="currentTicket.pourcentage">
                        <div class="d-flex justify-content-between">
                            <span>0%</span>
                            <span>100%</span>
                        </div>
                        <div class="text-center mt-3">
                            <span>{{ currentTicket.pourcentage }}%</span>
                        </div>
                    </div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Fermer</button>
                    <button type="button" class="btn btn-primary" @click="updateTicketProgress">Sauvegarder</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import Menu from '../components/Menu.vue';
import HeaderBar from '../components/HeaderBar.vue';
import { fetchData, putData, postData } from '../service/apiService';
import { Modal } from 'bootstrap';

export default {
    name: 'RapportTicketsView',
    components: {
        Menu,
        HeaderBar
    },
    data() {
        return {
            tickets: [],
            selectedTickets: [],
            selectAll: false,
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
                pourcentage: 0,  // Ajoutez la gestion du pourcentage ici
            },
            userId: null,
            nom: '',
            role: ''
        };
    },
    methods: {
        async loadTickets() {
            this.tickets = await fetchData('/tickets/all');
        },
        async loadCategories() {
            this.categories = await fetchData('/allCategorie');
        },
        voirDetails(ticket) {
            this.currentTicket = { ...ticket };
        },
        setProgress(ticket) {
            this.currentTicket = { ...ticket };  // Cloner le ticket pour pouvoir modifier le pourcentage
        },
        async updateTicketProgress() {
            const pourcentage = parseFloat(this.currentTicket.pourcentage);
            let updatedTicket = { 
                ...this.currentTicket,
                pourcentage: this.currentTicket.pourcentage,
                dateMiseAJour: new Date().toISOString(),
            };

            // Vérification du pourcentage avant la mise à jour
            console.log('Pourcentage actuel:', this.currentTicket.pourcentage);

            // Si le pourcentage est à 100, changer le statut en "fermé"
            if (pourcentage === 100) {
                console.log('Le pourcentage est 100, mise à jour du statut en "fermé"');
                updatedTicket.statut = 'ferme';
            } else {
                console.log('Le pourcentage n\'est pas 100, statut inchangé');
            }

            // Mise à jour du ticket dans la base de données
            try {
                const createdTicket = await putData(`/tickets/update/${this.currentTicket.id}`, updatedTicket);
                if (createdTicket) {
                    const historique = {
                        ticket: parseInt(this.currentTicket.id), // Associe le ticket
                        action: `Avancement de ${pourcentage}% par le technicien ${updatedTicket.technicien.id}`,
                        utilisateur: { id: this.userId }
                    };

                    // Envoi de l'historique
                    await postData('/historique_tickets/create', historique);
                }
                console.log('Ticket mis à jour avec succès');
            } catch (error) {
                console.error('Erreur lors de la mise à jour du ticket:', error);
            }

            // Rechargement des tickets
            this.loadTickets();

            // Fermeture du modal
            const modal = Modal.getInstance(document.getElementById('progressModal'));
            modal.hide();
        },

        formatDate(date) {
            const options = { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' };
            return new Date(date).toLocaleString('fr-FR', options);
        }
    },
    mounted() {
        if (typeof window !== "undefined" && localStorage.getItem("id")) {
            this.userId = parseInt(localStorage.getItem("id"));
            this.nom = localStorage.getItem('nom') || 'Nom non disponible';
            this.role = localStorage.getItem('role') || 'Rôle non disponible';
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
