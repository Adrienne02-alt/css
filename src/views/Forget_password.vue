<template>
  <div
    class="page-wrapper"
    style="background-color: rgb(254, 102, 102);"
    id="main-wrapper"
    data-layout="vertical"
    data-navbarbg="skin6"
    data-sidebartype="full"
    data-sidebar-position="fixed"
    data-header-position="fixed"
  >
    <div
      class="position-relative overflow-hidden radial-gradient min-vh-100 d-flex align-items-center justify-content-center"
    >
      <div class="d-flex align-items-center justify-content-center w-100">
        <div class="row justify-content-center w-100">
          <div class="col-md-8 col-lg-6 col-xxl-3">
            <div class="card mb-0">
              <div class="card-body">
                <a href="#" class="text-nowrap logo-img text-center d-block py-3 w-100">
                  <img src="../../public/images/logos/Image1.png" width="180" alt="Logo" />
                </a>
                <p class="text-center">Engagé pour une énergie meilleure</p>
                <form @submit.prevent="handleLogin">
                  <div class="mb-3">
                    <label for="email" class="form-label">Identifiant employés (Matricule) ou email</label>
                    <input
                      type="email"
                      class="form-control"
                      v-model="email"
                      id="email"
                      required
                    />
                  </div>
                  <div class="mb-4">
                    <label for="password" class="form-label">Mot de passe</label>
                    <input
                      type="password"
                      class="form-control"
                      v-model="password"
                      id="password"
                      required
                    />
                  </div>
                  <button
                    type="submit"
                    class="btn btn-danger w-100 py-8 fs-4 mb-4 rounded-2"
                  >
                    Changer mot de passe
                  </button>
                  <div class="d-flex align-items-center justify-content-center">
                    <router-link :to="{ name: 'LoginConnexion' }" class="text-danger fw-bold ms-2">
                      Se connecter
                    </router-link>
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
  name: 'ForgetPassword',
  data() {
    return {
      email: '',
      password: '',
    };
  },
  methods: {
    async handleLogin() {
      if (!this.email) {
        window.alert('Veuillez entrer un email valide.');
        return;
      }

      try {
        const response = await postData(
          `/update_password/${this.email}`,
          { password: this.password }
        );
        console.log(response);
        localStorage.setItem('user', this.email);
        this.$router.push({name:'LoginConnexion'});
      } catch (error) {
        if (error.response) {
          window.alert(`Erreur ${error.response.status} : ${error.response.data || 'Erreur inconnue'}`);
        } else {
          window.alert(`Une erreur est survenue : ${error.message || 'Erreur inconnue'}`);
        }
      }
    },
  },
};
</script>
