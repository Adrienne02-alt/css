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
                            <h5 class="card-title fw-semibold mb-4">Rapport de tickets</h5>
                        </div>
                    </div>
                    <div class="card-body">
                        <div class="row">
                            <div class="col-md-4" v-for="ticket in tickets.filter(ticket => ticket.statut === 'ferme' && ticket.technicien.id === this.userId)" :key="ticket.id">
                                <div class="card">
                                    <div class="card-header bg-danger text-white">
                                        {{ ticket.categorie }}
                                    </div>
                                    <div class="card-body">
                                        <h5 class="card-title">{{ ticket.titre }}</h5>
                                        <p><span class="fw-bold">Plaignant :</span> {{ nom }} ({{ role }})</p>
                                        <p><span class="fw-bold">Description :</span> {{ ticket.description }}</p>
                                        <p><span class="fw-bold">Priorité :</span> {{ ticket.priorite }}</p>
                                        <p><span class="fw-bold">Deadline :</span> {{ ticket.deadline }}</p>
                                        <p><span class="fw-bold">Etat :</span> {{ ticket.statut }}</p>
                                        <p><span class="fw-bold">Évolution :</span></p>
                                        <div class="progress">
                                            <div class="progress-bar" role="progressbar" :style="{ width: ticket.pourcentage + '%' }" aria-valuenow="ticket.pourcentage" aria-valuemin="0" aria-valuemax="100">{{ ticket.pourcentage }}%</div>
                                        </div>
                                        <br>
                                        <!-- Button Modifier Progress -->
                                        <button v-if="!hasRapport(ticket)" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#progressModal" @click="setProgress(ticket)">
                                            Faire rapport
                                        </button>
                                        <button v-if="hasRapport(ticket)" class="btn btn-info" data-bs-toggle="modal" data-bs-target="#detailsModal" @click="voirDetails(ticket)">
                                            Voir détails
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

    <!-- Modal pour voir les détails du ticket avec le rapport -->
    <div class="modal fade" id="detailsModal" tabindex="-1" aria-labelledby="detailsModalLabel" aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="detailsModalLabel">Détails du Ticket</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <p><strong>Ticket :</strong> {{ currentTicket.titre }}</p>
                    <p><strong>Catégorie :</strong> {{ currentTicket.categorie }}</p>
                    <p><strong>Date de demande :</strong> {{ currentTicket.dateCreation }}</p>
                    <p><strong>Deadline :</strong> {{ currentTicket.deadline }}</p>
                    <p><strong>Date de finalisation :</strong> {{ currentTicket.dateMiseAJour }}</p>
                    <p><strong>État :</strong> {{ currentTicket.statut }}</p>
                    <p><strong>Priorité :</strong> {{ currentTicket.priorite }}</p>
                    <p><strong>Description :</strong> {{ currentTicket.description }}</p>

                    <!-- Afficher le rapport associé, si disponible -->
                    <div v-if="currentTicket.rapport">
                        <h6><strong>Rapport :</strong></h6>
                        <div v-html="currentTicket.rapport.contenu"></div>
                    </div>
                    <div v-else>
                        <p>Aucun rapport disponible pour ce ticket.</p>
                    </div>
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
                    <p><strong>Titre :</strong> <span id="modalTicketTitre">{{ currentTicket.titre }}</span></p>
                    <p><strong>Catégorie :</strong> <span id="modalTicketCategorie">{{ currentTicket.categorie }}</span></p>
                    <p><strong>Date de demande :</strong> <span id="modalTicketDateDemande">{{ currentTicket.dateCreation }}</span></p>
                    <p><strong>Deadline :</strong> <span id="modalTicketDeadline">{{ currentTicket.deadline }}</span></p>
                    <p><strong>Date de finalisation :</strong> <span id="modalTicketDeadline">{{ currentTicket.dateMiseAJour }}</span></p>
                    <!-- Évolution -->
                    <div class="mb-3">
                        <label for="modalTicketEvolution" class="form-label">Évolution</label>
                        <div class="progress" id="progressContainer" style="cursor: pointer;" onclick="updateProgress(event)">
                            <div class="progress-bar" id="progressBarModal" role="progressbar" style="width: 100%" aria-valuenow="100" aria-valuemin="0" aria-valuemax="100">100%</div>
                        </div>
                    </div>
        
                    <!-- Commentaire avec éditeur de texte enrichi (Quill) -->
                    <div class="mb-3">
                    <label for="modalTicketCommentaire" class="form-label">Faire un rapport détaillé</label>
                    <div id="modalTicketCommentaire" style="height: 200px;"></div>
                    </div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Fermer</button>
                    <button type="button" class="btn btn-primary" @click="setRapport">Sauvegarder</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import Menu from '../components/Menu.vue';
import HeaderBar from '../components/HeaderBar.vue';
import { fetchData, postData } from '../service/apiService';
import { Modal } from 'bootstrap';
import Quill from 'quill';

export default {
    name: 'RapportTicketsView',
    components: {
        Menu,
        HeaderBar
    },
    data() {
        return {
            tickets: [],
            rapports: [], // Liste des rapports
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
                rapport: null // Ajout pour stocker le rapport
            },
            userId: null,
            nom: '',
            role: '',
            quill: null
        };
    },
    methods: {
        async loadTickets() {
            this.tickets = await fetchData('/tickets/all');
        },
        async loadRapports() {
            this.rapports = await fetchData('/allRapports');
        },
        voirDetails(ticket) {
            this.currentTicket = { ...ticket };
            // Récupérer le rapport associé au ticket
            this.currentTicket.rapport = this.rapports.find(rapport => rapport.ticket.id === ticket.id);
        },
        setProgress(ticket) {
            this.currentTicket = { ...ticket };  // Cloner le ticket pour pouvoir modifier le pourcentage
        },
        hasRapport(ticket) {
            // Vérifie si un rapport existe pour ce ticket
            return this.rapports.some(rapport => rapport.ticket.id === ticket.id);
        },
        async setRapport() {
            // Préparer les données pour le rapport
            const updatedTicket = { 
                contenu: this.quill.root.innerHTML,
                ticket: { id: this.currentTicket.id }, // Associer le ticket
                createur: { id: this.userId }         // ID du technicien (ou créateur)
            };

            try {
                // Enregistrer le rapport dans la base de données
                const createdRapport = await postData(`/save_rapport`, updatedTicket);
                
                if (createdRapport) {
                    // Préparer les données pour l'historique
                    const historique = {
                        ticket: this.currentTicket.id,  // Associer le ticket
                        action: `Rapport créé par le technicien ${this.userId}`, // Message d'action
                        utilisateur: { id: this.userId } // Utilisateur qui effectue l'action
                    };

                    // Envoi de l'historique
                    await postData('/historique_tickets/create', historique);

                    console.log('Rapport et historique enregistrés avec succès');
                }
            } catch (error) {
                console.error('Erreur lors de la création du rapport ou de l\'historique:', error);
            }

            // Recharger la liste des tickets
            this.loadTickets();

            // Fermer le modal après l'enregistrement
            const modal = Modal.getInstance(document.getElementById('progressModal'));
            if (modal) {
                modal.hide();
            }
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
        this.loadRapports();
        this.quill = new Quill('#modalTicketCommentaire', {
            theme: 'snow',
            placeholder: 'Écrivez votre rapport ici...',
            modules: {
                toolbar: [
                    [{ 'header': '1' }, { 'header': '2' }],
                    [{ 'list': 'ordered' }, { 'list': 'bullet' }],
                    [{ 'align': [] }],
                    ['bold', 'italic', 'underline'],
                    ['link']
                ]
            }
        });
    }
};
</script>

<style>
body {
    background-color: rgb(254, 102, 102);
}
</style>
