<template>
  <v-main class="ma-10">
    <v-card>
      <v-card-title>
        <v-tooltip top>
          <template #activator="{ on, attrs }">
            <v-btn
              color="primary mr-3"
              dark
              v-bind="attrs"
              v-on="on"
              @click="showModal"
            >
              <v-icon
                class="mr-2"
                right
                dark
              >
                mdi-plus
              </v-icon>
              Nuevo
            </v-btn>
          </template>
          <span>Crear nuevo</span>
        </v-tooltip>
        {{ title }}
        <v-spacer />
        <v-text-field
          v-model="search"
          append-icon="mdi-magnify"
          label="Buscar"
          single-line
          hide-details
        />
      </v-card-title>
      <v-data-table
        :headers="headers"
        class="elevation-1"
        :items="list"
        :search="search"
        :items-per-page="5"
        :loading="listLoading"
        :footer-props="{
          itemsPerPageText: 'Filas por página',
          itemsPerPageAll: 'Todos',
          itemsPerPageOptions: [10,20],
        }"
        loading-text="Cargando....... Espere un momento"
      >
        <template #[`item.status`]="{ item }">
          <span v-if="item.status == 1"> SI </span>
          <span v-else> NO </span>
        </template>

        <template #[`item.img`]="{ item }">
          <v-container fluid>
            <v-layout justify-center align-center>
              <v-flex shrink>
                <div>
                  <FsLightbox
                    :toggler="toggler"
                    :sources="[
                      item.img
                    ]"
                  />
                  <v-img
                    style="cursor:pointer"
                    contain
                    :lazy-src="item.url"
                    max-height="100"
                    max-width="120"
                    :src="item.img"
                  />
                </div>
              </v-flex>
            </v-layout>
          </v-container>
        </template>

        <template #[`item.actions`]="{ item }">
          <v-row
            align="center"
            justify="space-around"
          >
            <v-tooltip top>
              <template #activator="{ on, attrs }">
                <v-btn
                  v-if="checkSpecificPermission('edit-movies')"
                  class="mx-2"
                  fab
                  dark
                  v-bind="attrs"
                  x-small
                  color="green"
                  v-on="on"
                  @click="editMovie(item)"
                >
                  <v-icon dark>
                    mdi-pencil
                  </v-icon>
                </v-btn>
              </template>
              <span>Editar</span>
            </v-tooltip>

            <v-tooltip top>
              <template #activator="{ on, attrs }">
                <v-btn
                  v-if="checkSpecificPermission('edit-schedules')"
                  class="mx-2"
                  fab
                  dark
                  v-bind="attrs"
                  x-small
                  color="blue"
                  v-on="on"
                  @click="addSchedule(item)"
                >
                  <v-icon dark>
                    mdi-alarm-plus
                  </v-icon>
                </v-btn>
              </template>
              <span>Asignar turno</span>
            </v-tooltip>

            <el-popconfirm
              title="¿Eliminar?"
              confirm-button-text="Eliminar"
              cancel-button-text="Cancelar"
              confirm-button-type="danger force-white-color"
              @confirm="deletemovie(item)"
            >
              <v-btn
                v-if="checkSpecificPermission('delete-movies')"
                slot="reference"
                class="mx-2"
                fab
                dark
                x-small
                color="red"
              >
                <v-icon dark>
                  mdi-delete-variant
                </v-icon>
              </v-btn>
            </el-popconfirm>

          </v-row>
        </template>
      </v-data-table>
    </v-card>

    <v-dialog
      v-model="dialogLoading"
      hide-overlay
      persistent
      width="300"
    >
      <v-card
        color="primary"
        dark
      >
        <v-card-text>
          Guardando.... espera un momento
          <v-progress-linear
            indeterminate
            color="white"
            class="mb-0"
          />
        </v-card-text>
      </v-card>
    </v-dialog>

    <v-row justify="center">
      <v-dialog
        v-model="dialog"
        persistent
        max-width="600px"
      >
        <v-card>
          <v-card-title>
            <span class="headline">{{ title }}</span>
          </v-card-title>
          <v-card-text>
            <v-container>
              <v-form
                ref="form"
                v-model="valid"
                lazy-validation
              >
                <v-row>
                  <v-col
                    cols="12"
                  >
                    <v-text-field
                      v-model="movie.name"
                      label="Nombre*"
                      :rules="nameRules"
                      required
                    />
                  </v-col>
                  <v-col
                    cols="12"
                  >
                    <v-text-field
                      v-model="movie.description"
                      label="Descripción*"
                      :rules="nameRules"
                      required
                    />
                  </v-col>
                  <v-col cols="6" md="6">
                    <v-checkbox
                      v-model="movie.status"
                      :label="`Activo`"
                    />
                  </v-col>
                  <v-col cols="6" md="6">
                    <v-file-input
                      v-model="movie.file"
                      placeholder="Subir imagen"
                      label="Imagen"
                      :rules="fileRules"
                      accept="image/*"
                      prepend-icon="mdi-paperclip"
                    >
                      <template #selection="{ text }">
                        <v-chip
                          small
                          label
                          color="primary"
                        >
                          {{ text }}
                        </v-chip>
                      </template>
                    </v-file-input>
                  </v-col>
                </v-row>
              </v-form>
            </v-container>
            <small class="red--text">*Campos obligatorios</small>
          </v-card-text>
          <v-card-actions>
            <v-spacer />
            <v-btn
              color="grey darken-1"
              text
              @click="dialog = false"
            >
              Cerrar
            </v-btn>
            <v-btn
              v-if="isUpdate == false"
              color="primary darken-1"
              text
              @click="save()"
            >
              Guardar
            </v-btn>
            <v-btn
              v-else
              color="primary darken-1"
              text
              @click="update()"
            >
              Actualizar
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-row>

    <v-row justify="center">
      <v-dialog
        v-model="dialog2"
        persistent
        max-width="600px"
      >
        <v-card>
          <v-card-title>
            <span class="headline">Agregar turno: {{ movie.name }}</span>
          </v-card-title>
          <v-card-text>
            <v-container>
              <v-form
                ref="form2"
                v-model="valid"
                lazy-validation
              >
                <v-row>
                  <v-col cols="6" md="6">
                    <v-rating
                      v-model="ranking"
                      background-color="grey lighten-1"
                      color="warning"
                      readonly
                      hover
                      length="5"
                      size="24"
                    />
                    <v-img
                      class="d-flex flex-column align-middle"
                      style="cursor:pointer"
                      contain
                      :lazy-src="movie.img"
                      max-height="150"
                      max-width="128"
                      :src="movie.img"
                    />
                  </v-col>
                  <v-col
                    cols="6"
                    sm="6"
                  >
                    <v-select
                      v-model="movie_schedule.schedule_id"
                      :items="schedules"
                      label="Turnos"
                      item-text="time"
                      item-value="id"
                    />
                  </v-col>
                </v-row>
              </v-form>
            </v-container>
            <small class="red--text">*Campos obligatorios</small>
          </v-card-text>
          <v-card-actions>
            <v-spacer />
            <v-btn
              color="grey darken-1"
              text
              @click="dialog2 = false"
            >
              Cerrar
            </v-btn>
            <v-btn
              v-if="isUpdate == false"
              color="primary darken-1"
              text
              @click="saveScheduleForm()"
            >
              Guardar
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-row>

  </v-main>
</template>

<script>
import { getMovies, saveMovie, updateMovie, deleteMovie } from '@/api/movies'
import { saveMovieSchedule } from '@/api/movie-schedule'
import { getSchedule } from '@/api/schedules'
import { checkSpecificPermission } from '@/utils/permission'
import FsLightbox from 'fslightbox-vue'

export default {
  name: 'Movie',
  components: { FsLightbox },
  data() {
    return {
      headers: [
        { value: 'id', align: 'center', text: 'Folio' },
        { value: 'name', text: 'Nombre', sortable: true },
        { value: 'img', text: 'Imagen', sortable: true },
        { value: 'description', text: 'Descripción', sortable: true },
        { value: 'created_at', with: '100%', sortable: true, align: 'right', text: 'Registrado' },
        { value: 'status', text: 'Activo', sortable: true },
        { value: 'actions', text: 'Acciones', sortable: false }
      ],
      search: '',
      movie: {},
      toggler: false,
      listLoading: true,
      dialogLoading: false,
      isUpdate: false,
      dialog: false,
      list: [],
      valid: false,
      ranking: 1,
      movie_schedule: {},
      schedules: [],
      title: 'Peliculas',
      nameRules: [
        v => !!v || 'Nombre es requerido'
      ],
      fileRules: [
        v => !!v || 'Archivo es requerido'
      ],
      dialog2: false
    }
  },
  computed: {
  },
  created() {
    this.getList()
    this.getSchedules()
  },
  methods: {
    async getList() {
      this.listLoading = true
      const data = await getMovies()
      this.list = data || []
      this.total = data.length || 0
      this.listLoading = false
    },
    async getSchedules() {
      const resp = await getSchedule()
      this.schedules = resp || []
    },
    showModal() {
      this.clearInputs()
      this.isUpdate = false
      this.dialog = true
      this.$nextTick(() => {
        this.$refs.form.resetValidation()
      })
      // setTimeout(() => this.$refs.form.resetValidation(), 200)
    },
    clearInputs() {
      this.movie = {}
    },
    checkSpecificPermission,
    async saveScheduleForm() {
      if (this.$refs.form2.validate()) {
        this.dialog = false
        this.dialogLoading = true
        this.movie_schedule.movie_id = this.movie.id
        try {
          await saveMovieSchedule(this.movie_schedule)
          this.dialog2 = false
          this.clearInputs()
          this.getList()
          this.dialogLoading = false
        } catch (error) {
          console.log('try catch')
          console.log(error)
          this.dialogLoading = false
        }
      }
    },
    async save() {
      if (this.$refs.form.validate()) {
        this.dialog = false
        this.dialogLoading = true

        const formData = new FormData()
        formData.append('file', this.movie.file, this.movie.file.name)
        formData.append('name', this.movie.name)
        formData.append('status', this.movie.status)
        formData.append('description', this.movie.description)

        try {
          await saveMovie(formData)
          this.getList()
          this.dialogLoading = false
        } catch (error) {
          console.log('try catch')
          console.log(error)
          this.dialogLoading = false
        }
      }
    },
    async deletemovie(item) {
      this.dialogLoading = true
      try {
        await deleteMovie(item.id)
        this.getList()
        this.dialogLoading = false
      } catch (error) {
        console.log('try catch')
        console.log(error)
        this.dialogLoading = false
      }
    },
    addSchedule(item) {
      this.movie = item
      this.ranking = Math.floor(Math.random() * 5) + 1
      this.$nextTick(() => {
        this.dialog2 = true
      })
    },
    editMovie(item) {
      this.isUpdate = true
      const _this = this
      Object.keys(item).forEach(function(key) {
        switch (key) {
          case 'status':
            _this.movie[key] = item[key]
            if (item[key] === 0) { delete _this.movie[key] }
            break
          default:
            _this.movie[key] = item[key]
            break
        }
      })
      this.dialog = true
    },
    async update() {
      if (this.$refs.form.validate()) {
        this.dialog = false
        this.dialogLoading = true

        const formData = new FormData()
        formData.append('file', this.movie.file, this.movie.file.name)
        formData.append('name', this.movie.name)
        formData.append('status', this.movie.status === false ? 0 : 1)
        formData.append('id', this.movie.id)
        formData.append('description', this.movie.description)
        try {
          await updateMovie(formData, this.movie.id)
          this.getList()
          this.dialogLoading = false
        } catch (error) {
          console.log('try catch')
          console.log(error)
          this.dialogLoading = false
        }
      }
    }

  }
}
</script>
<style>
  button.el-button.el-button--text.el-button--mini {
    color:inherit  !important;
  }
</style>
