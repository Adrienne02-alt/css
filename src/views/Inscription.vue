<template>
    <div class="page-wrapper" style="background-color: rgb(254, 102, 102);" id="main-wrapper" data-layout="vertical" data-navbarbg="skin6" data-sidebartype="full"
    data-sidebar-position="fixed" data-header-position="fixed">
    <div
      class="position-relative overflow-hidden radial-gradient min-vh-100 d-flex align-items-center justify-content-center">
      <div class="d-flex align-items-center justify-content-center w-100">
        <div class="row justify-content-center w-100">
          <div class="col-md-8 col-lg-6 col-xxl-3">
            <div class="card mb-0">
              <div class="card-body">
                <a href="" class="text-nowrap logo-img text-center d-block py-3 w-100">
                  <img src="../../public/images/logos/Image1.png" width="180" alt="">
                </a>
                <p class="text-center">Engagé pour une énergie meilleur</p>
                <form>
                  <div class="mb-3">
                    <label for="exampleInputtext1" class="form-label">Nom complet</label>
                    <input type="text" v-model="form.nom"  class="form-control" id="exampleInputtext1" aria-describedby="textHelp">
                  </div>
                  <div class="mb-3">
                    <label for="exampleInputEmail1" class="form-label">Email Address</label>
                    <input type="email" v-model="form.email"  class="form-control" id="exampleInputEmail1" aria-describedby="emailHelp">
                  </div>
                  <div class="mb-4">
                    <label for="exampleInputPassword1" class="form-label">Mot de passe</label>
                    <input type="password" v-model="form.password"  class="form-control" id="exampleInputPassword1">
                  </div>
                  <div class="mb-4">
                    <label for="exampleInputPassword1" class="form-label">Role</label>
                    <select name="role" v-model="form.role"  class="form-control" id="">
                        <option value="employe">Employe</option>
                        <option value="technicien">Technicien</option>
                    </select>
                  </div>
                  <a href="" class="btn btn-danger w-100 py-8 fs-4 mb-4 rounded-2">Enregistrer</a>
                  <div class="d-flex align-items-center justify-content-center">
                    <p class="fs-4 mb-0 fw-bold">Déja inscrit?</p>
                    <router-link :to="{name: 'LoginConnexion'}" class="text-danger fw-bold ms-2" href="./authentication-login.html">Se connecter</router-link>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  </template>
  
  <script>
  import { postData } from '../service/apiService';
  export default {
    name: 'InscriptionConnexion',
    data() {
    return {
      form: {
        nom: '',
        email: '',
        password: '',
        role: ''
      }
    };
  },
  methods: {
    async handleSubmit() {
      try {
        await postData('/insertion_user', this.form);
        this.$router.push('/dashboard');
      } catch (error) {
        console.error('Erreur lors de l\'inscription:', error);
      }
    }
  }
  };
  </script>
  