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
                            <h5 class="card-title fw-semibold mb-4">Noter le services</h5>
                        </div>
                    </div>
                    <div class="card-body">
                        <div class="row">
                            <div class="col-md-4" v-for="ticket in tickets.filter(ticket => ticket.statut === 'ferme' && ticket.employe && ticket.employe.id === this.userId)" :key="ticket.id">
                                <div class="card">
                                    <div class="card-header bg-danger text-white">
                                        {{ ticket.categorie }}
                                    </div>
                                    <div class="card-body">
                                        <h5 class="card-title">{{ ticket.titre }}</h5>
                                        <p><span class="fw-bold">Technicien :</span> {{ ticket.technicien.nom }} ({{ ticket.technicien.role }})</p>
                                        <p><span class="fw-bold">Description :</span> {{ ticket.description }}</p>
                                        <p><span class="fw-bold">Priorité :</span> {{ ticket.priorite }}</p>
                                        <p><span class="fw-bold">Deadline :</span> {{ ticket.deadline }}</p>
                                        <p><span class="fw-bold">Etat :</span> {{ ticket.statut }}</p>
                                        <p><span class="fw-bold">Évolution :</span></p>
                                        <div class="progress">
                                            <div class="progress-bar" role="progressbar" :style="{ width: ticket.pourcentage + '%' }" aria-valuenow="ticket.pourcentage" aria-valuemin="0" aria-valuemax="100">{{ ticket.pourcentage }}%</div>
                                        </div>
                                        <br>
                                        <!-- Vérifier si le ticket a une note -->
                                        <button class="btn btn-info" :data-bs-target="'#detailsModal'" :data-bs-toggle="'modal'" @click="voirDetails(ticket)">
                                            {{ hasNoteForTicket(ticket.id) ? 'Voir détails' : 'Noter le ticket' }}
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

                    <!-- Commentaire avec éditeur de texte enrichi (Quill) -->
                    <div v-if="!currentTicket.noteRating">
                        <div class="mb-3">
                            <label for="modalTicketCommentaire" class="form-label">Commentaire:</label>
                            <div id="modalTicketCommentaire" style="height: 200px;"></div>
                        </div>

                        <!-- Évaluation du service -->
                        <div class="mb-3">
                            <label class="form-label">Évaluation du service lié au ticket</label><br>
                            <div class="stars">
                                <input type="radio" id="star5" name="rating" value="5" v-model="rating"><label for="star5" class="fa fa-star"></label>
                                <input type="radio" id="star4" name="rating" value="4" v-model="rating"><label for="star4" class="fa fa-star"></label>
                                <input type="radio" id="star3" name="rating" value="3" v-model="rating"><label for="star3" class="fa fa-star"></label>
                                <input type="radio" id="star2" name="rating" value="2" v-model="rating"><label for="star2" class="fa fa-star"></label>
                                <input type="radio" id="star1" name="rating" value="1" v-model="rating"><label for="star1" class="fa fa-star"></label>
                            </div>
                        </div>
                    </div>
                    <div v-else>
                        <div>
                            <strong>Note attribuée :</strong>
                            <span v-for="index in 5" :key="index" class="fa" 
                                :class="{'fa-star': index <= currentTicket.noteRating, 'fa-star-o': index > currentTicket.noteRating}"
                                style="color: #ffcc00; font-size: 1.5rem;">
                            </span>
                        </div>
                        <br>
                        <p><strong>Commentaire :</strong> <span v-html="currentTicket.noteCommentaire"></span></p>
                    </div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Fermer</button>
                    <button type="button" class="btn btn-primary" @click="submitEvaluation">Soumettre l'évaluation</button>
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
    name: 'NotationsTicketsView',
    components: {
        Menu,
        HeaderBar
    },
    data() {
        return {
            tickets: [],
            rapports: [],
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
                pourcentage: 0,
                rapport: null,
                note: null,
                noteCommentaire: '',
                noteRating: 0,
            },
            userId: null,
            nom: '',
            role: '',
            quill: null,
            rating: 0,
            comment: '',
            notations: []  // Liste des notations
        };
    },
    methods: {
        async loadTickets() {
            this.tickets = await fetchData('/tickets/all');
        },
        async loadRapports() {
            this.rapports = await fetchData('/allRapports');
        }, 
        async loadNotations() {
            try {
                this.notations = await fetchData('/notations/all'); // Charger les notations depuis l'API
            } catch (error) {
                console.error('Erreur lors du chargement des notations:', error);
            }
        },
        voirDetails(ticket) {
            this.currentTicket = { ...ticket };
            // Vérifier si une notation existe pour ce ticket
            const notation = this.notations.find(n => n.ticket.id === ticket.id);
            if (notation) {
                this.currentTicket.noteRating = notation.note;
                this.currentTicket.noteCommentaire = notation.commentaire;
            }
            // Récupérer le rapport associé au ticket
            this.currentTicket.rapport = this.rapports.find(rapport => rapport.ticket.id === ticket.id);
        },
        async submitEvaluation() {
            const notationData = {
                ticket: { id: this.currentTicket.id },
                note: this.rating,
                commentaire: this.quill.root.innerHTML,
            };

            try {
                // Envoi de la requête POST au backend pour enregistrer l'évaluation
                const response = await postData('/notations/create', notationData);
                console.log('Évaluation soumise avec succès:', response.data);

                // Enregistrer l'historique de l'action de notation
                const historique = {
                    ticket: this.currentTicket.id,  // Associer le ticket
                    action: `Notation de ${notationData.note} par employe' ${this.userId}`, // Action à enregistrer
                    utilisateur: { id: this.userId }  // ID de l'utilisateur qui effectue l'action
                };

                // Envoi de l'historique
                await postData('/historique_tickets/create', historique);
                console.log('Historique enregistré avec succès');

                // Fermer la modal et actualiser les tickets
                const modal = Modal.getInstance(document.getElementById('detailsModal'));
                modal.hide();
                this.loadTickets();  // Recharger les tickets après soumission
            } catch (error) {
                console.error('Erreur lors de la soumission de l\'évaluation ou de l\'historique:', error);
            }
        },

        hasNoteForTicket(ticketId) {
            return Array.isArray(this.notations) && this.notations.some(n => n.ticket.id === ticketId);
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
        this.loadNotations();
        this.quill = new Quill('#modalTicketCommentaire', {
            theme: 'snow',
            placeholder: 'Écrivez votre rapport ici...',
            modules: {
                toolbar: [
                    [{ 'header': '1' }, { 'header': '2' }],
                    [{ 'list': 'ordered' }, { 'list': 'bullet' }],
                    [{ 'align': [] }],
                    ['bold', 'italic', 'underline'],
                    ['link'],
                ],
            },
        });
    }
};
</script>

<style>
body {
    background-color: rgb(254, 102, 102);
}
.stars {
    display: flex;
    flex-direction: row-reverse;
    justify-content: space-evenly;
}
.stars input {
    display: none;
}
.stars label {
    font-size: 2rem;
    color: #ccc;
    cursor: pointer;
}
.stars input:checked ~ label {
    color: #ffcc00;
}
.stars input:checked + label {
    color: #ffcc00;
}
.stars label:hover,
.stars label:hover ~ label {
    color: #ffcc00;
}
</style>
