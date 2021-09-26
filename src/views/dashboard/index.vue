<template>
  <div class="dashboard-container">
    <component :is="currentRole" />
    <v-card-title>Peliculas Recientes</v-card-title>
    <MovieCards></MovieCards>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import adminDashboard from './admin'
import MovieCards from '@/views/dashboard/movie_cards.vue'
// import editorDashboard from './editor'

export default {
  name: 'Dashboard',
  components: { adminDashboard, MovieCards },
  data() {
    return {
      currentRole: 'adminDashboard'
    }
  },
  computed: {
    ...mapGetters([
      'roles',
      'userRoutes'
    ])
  },
  created() {
    /*
    if (!this.roles.includes('admin')) {
      this.currentRole = 'editorDashboard'
    }
    */
    this.currentRole = 'adminDashboard'
  }
}
</script>
