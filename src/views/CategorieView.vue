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
                            <h5 class="fw-semibold">Gestion des catégories</h5>
                            <button class="btn btn-warning" data-bs-toggle="modal" data-bs-target="#addModal" @click="resetModal">
                                Ajouter une catégorie
                            </button>
                        </div>
                    </div>
                    <div class="card-body">
                        <table class="table table-bordered mt-3">
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Nom</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="category in categories" :key="category.id">
                                    <td>{{ category.id }}</td>
                                    <td>{{ category.nom }}</td>
                                    <td>
                                        <button class="btn btn-warning btn-sm" data-bs-toggle="modal" data-bs-target="#editModal" 
                                            @click="setEditModal(category)">
                                            Modifier
                                        </button>
  
                                        <form @submit.prevent="deleteCategory(category.id)" style="display:inline;">
                                            <button type="submit" class="btn btn-danger btn-sm">Supprimer</button>
                                        </form>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
  
        <!-- Modal d'ajout -->
        <div class="modal fade" id="addModal" tabindex="-1" aria-labelledby="addModalLabel" aria-hidden="true">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="addModalLabel">Ajouter une catégorie</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        <form @submit.prevent="addCategory">
                            <div class="mb-3">
                                <label for="categorynom" class="form-label">Nom</label>
                                <input type="text" class="form-control" id="categorynom" v-model="newCategory.nom" required>
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
                        <h5 class="modal-title" id="editModalLabel">Modifier une catégorie</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        <form @submit.prevent="updateCategory">
                            <div class="mb-3">
                                <label for="editCategorynom" class="form-label">Nom</label>
                                <input type="text" class="form-control" id="editCategorynom" v-model="currentCategory.nom" required>
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
  import { postData, fetchData, putData } from '../service/apiService';
  import bootstrap from 'bootstrap';
  
  export default {
    name: 'CategorieView',
    components: {
        Menu,
        HeaderBar
    },
    data() {
        return {
            categories: [],
            newCategory: {
                nom: '',
            },
            currentCategory: {
                id: null,
                nom: '',
            }
        };
    },
    methods: {
        async loadCategories() {
            this.categories = await fetchData('/allCategorie');
        },
        async addCategory() {
            await postData('/save_categorie', this.newCategory);
            this.newCategory = { nom: ''};
            this.loadCategories();
            const addModal = bootstrap.Modal.getInstance(document.getElementById('addModal'));
            addModal.hide();
        },
        setEditModal(category) {
            this.currentCategory = { ...category };
        },
        async updateCategory() {
            await putData(`/update_categorie/${this.currentCategory.id}`, this.currentCategory);
            this.currentCategory = { id: null, nom: ''};
            this.loadCategories();
            const editModal = bootstrap.Modal.getInstance(document.getElementById('editModal'));
            editModal.hide();
        },
        async deleteCategory(id) {
            await postData(`/delete_categorie/${id}`, { _method: 'DELETE' });
            this.loadCategories();
        },
        resetModal() {
            this.newCategory = { nom: '', description: '' };
        }
    },
    mounted() {
        this.loadCategories();
    }
  };
  </script>
  
  <style>
  body {
    background-color: rgb(254, 102, 102);
  }
  </style>
  