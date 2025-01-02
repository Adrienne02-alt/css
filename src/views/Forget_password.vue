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
                  <a href="" class="text-nowrap logo-img text-center d-block py-3 w-100">
                    <img src="../../public/images/logos/Image1.png" width="180" alt="Logo">
                  </a>
                  <p class="text-center">Engagé pour une énergie meilleure</p>
                  <form action="" method="post">
                    <div class="mb-3">
                      <label for="email" class="form-label">Identifiant employés (Matricule) ou email</label>
                      <input 
                        type="email" 
                        class="form-control" 
                        name="email" 
                        id="email" 
                        aria-describedby="emailHelp"
                      >
                    </div>
                    <div class="mb-4">
                      <label for="password" class="form-label">Mot de passe</label>
                      <input 
                        type="password" 
                        class="form-control" 
                        name="pass" 
                        id="password"
                      >
                    </div>
                    <input 
                      type="submit" 
                      class="btn btn-danger w-100 py-8 fs-4 mb-4 rounded-2" 
                      value="Changer mot de passe"
                    >
                    <div class="d-flex align-items-center justify-content-center">
                      <router-link :to="{name:'LoginConnexion'}" class="text-danger fw-bold ms-2" href="#">Se connecter</router-link>
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
  export default {
    name: 'ForgetPassword',
  };
  </script>
  