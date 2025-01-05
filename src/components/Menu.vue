<template>
  <div>
    <aside class="left-sidebar">
      <!-- Sidebar scroll-->
      <div>
        <div class="brand-logo d-flex align-items-center justify-content-between">
          <a href="" class="text-nowrap logo-img">
          <img src="../../public/images/logos/Image1.png" width="180" alt="">
          </a>
          <div class="close-btn d-xl-none d-block sidebartoggler cursor-pointer" id="sidebarCollapse">
            <i class="ti ti-x fs-8"></i>
          </div>
        </div>
        <!-- Sidebar navigation-->
        <nav class="sidebar-nav scroll-sidebar" data-simplebar="">
          <ul id="sidebarnav">
            <li class="nav-small-cap">
              <i class="ti ti-dots nav-small-cap-icon fs-4"></i>
              <span class="hide-menu">Acceuil</span>
            </li>
            <li class="sidebar-item">
              <a class="sidebar-link" href="" aria-expanded="false">
                <span>
                  <i class="ti ti-layout-dashboard"></i>
                </span>
                <!-- technicien -->
                <span class="hide-menu">Tableau de bord</span>
              </a>
            </li>
            <li class="sidebar-item">
              <a class="sidebar-link" href="" aria-expanded="false">
                <span>
                  <i class="ti ti-layout-dashboard"></i>
                </span>
                <!-- super admin -->
                <span class="hide-menu">Tableau de bord</span>
              </a>
            </li>
            <li class="nav-small-cap">
              <i class="ti ti-dots nav-small-cap-icon fs-4"></i>
              <span class="hide-menu">Activités</span>
            </li>
            <li class="sidebar-item">
                <router-link class="sidebar-link" to="/categorie" aria-expanded="false">
                    <span>
                        <i class="ti ti-article"></i>
                    </span>
                    <!-- super user -->
                    <span class="hide-menu">Gestion des categories</span>
                  </router-link>
            </li>
            <li class="sidebar-item">
                <router-link class="sidebar-link" to="/liste_ticket" aria-expanded="false">
                    <span>
                        <i class="ti ti-article"></i>
                    </span>
                    <span class="hide-menu">Mes tickets</span>
                  </router-link>
            </li>
            <li class="sidebar-item">
                <a class="sidebar-link" href="{{ route('get_ticket', ['id' => 'EMP0002']) }}" aria-expanded="false">
                    <span>
                        <i class="ti ti-article"></i>
                    </span>
                    <!-- super user -->
                    <span class="hide-menu">Liste des techniciens</span>
                </a>
            </li>

            <li class="sidebar-item">
              <router-link class="sidebar-link" to="/assignation" aria-expanded="false">
                <span>
                  <i class="ti ti-alert-circle"></i>
                </span>
                <!-- techicien -->
                <span class="hide-menu">Assignation de tickets</span>
              </router-link>
            </li>
            <li class="sidebar-item">
              <router-link class="sidebar-link" to="/Suivi" aria-expanded="false">
                <span>
                  <i class="ti ti-cards"></i>
                </span>
                <!-- technicien -->
                <span class="hide-menu">Suivi des tickets</span>
              </router-link>
            </li>
            <li class="sidebar-item">
              <router-link class="sidebar-link" to="/Rapport" aria-expanded="false">
                <span>
                  <i class="ti ti-file-description"></i>
                </span>
                <!-- technicien  -->
                <span class="hide-menu">Rapports sur les tickets</span>
              </router-link>
            </li>
            <li class="sidebar-item">
              <router-link class="sidebar-link" to="/Notation" aria-expanded="false">
                <span>
                  <i class="ti ti-file-description"></i>
                </span>
                <!-- user  -->
                <span class="hide-menu">Notations des technicien</span>
              </router-link>
            </li>
            <li class="sidebar-item">
              <router-link class="sidebar-link" to="/Historique" aria-expanded="false">
                <span>
                  <i class="ti ti-typography"></i>
                </span>
                <!-- user -->
                <span class="hide-menu">Historique</span>
              </router-link>
            </li>
          </ul>
        </nav>
        <!-- End Sidebar navigation -->
      </div>
      <!-- End Sidebar scroll-->
    </aside>
  </div>
</template>
<script>
    export default {
        name:'MenuNavigation'
    }
</script>