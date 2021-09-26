<template>
  <v-row>
    <v-col
      v-for="card in list"
      :key="card.id"
      class="d-flex child-flex"
      cols="4"
    >

      <v-card
        :loading="loading"
        class="mx-auto my-12"
        max-width="374"
      >
        <template slot="progress">
          <v-progress-linear
            color="deep-purple"
            height="10"
            indeterminate
          />
        </template>

        <v-img
          height="250"
          :src="card.img"
        />

        <v-card-title>{{ card.name }}</v-card-title>

        <v-card-text>
          <v-row
            align="center"
            class="mx-0"
          >
            <v-rating
              :value="4.5"
              color="amber"
              dense
              half-increments
              readonly
              size="14"
            />

            <div class="grey--text ms-4">
              4.5
            </div>
          </v-row>
          <div class="my-4 text-subtitle-1" />
          <div>{{ card.description }}</div>
        </v-card-text>

        <v-divider class="mx-4" />

        <v-card-title>Turnos</v-card-title>

        <v-card-text>
          <v-chip-group
            v-model="card.selection"
            active-class="deep-purple accent-4 white--text"
            column
          >
            <v-chip
              v-for="schedule in card.schedules"
              :key="schedule.id"
            >
              {{ schedule.time }}
            </v-chip>
          </v-chip-group>
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>
</template>

<script>

import { getMovies } from '@/api/movies'

export default {
  name: 'MovieCards',
  data() {
    return {
      colors: [
        'indigo',
        'warning',
        'pink darken-2',
        'red lighten-1',
        'deep-purple accent-4'
      ],
      slides: [
        'First',
        'Second',
        'Third',
        'Fourth',
        'Fifth'
      ],
      loading: false,
      selection: false,
      list: []
    }
  },
  created() {
    this.getList()
  },
  methods: {
    async getList() {
      this.listLoading = true
      const data = await getMovies()
      this.list = data || []
      this.total = data.length || 0
      this.listLoading = false
    }
  }
}
</script>
