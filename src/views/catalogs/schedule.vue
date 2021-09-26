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

        <template #[`item.time`]="{ item }">
          {{ item.time }}
          <v-icon
            color="blue darken-2"
          >
            mdi-calendar-clock
          </v-icon>
        </template>

        <template #[`item.actions`]="{ item }">
          <v-row
            align="center"
            justify="space-around"
          >
            <v-tooltip top>
              <template #activator="{ on, attrs }">
                <v-btn
                  v-if="checkSpecificPermission('edit-schedules')"
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

            <el-popconfirm
              title="¿Eliminar?"
              confirm-button-text="Eliminar"
              cancel-button-text="Cancelar"
              confirm-button-type="danger force-white-color"
              @confirm="deleteSchedules(item)"
            >
              <v-btn
                v-if="checkSpecificPermission('delete-schedules')"
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
                    cols="6"
                  >

                    <v-menu
                      ref="menu"
                      v-model="menu"
                      :close-on-content-click="false"
                      :nudge-right="40"
                      :return-value.sync="schedule.time"
                      transition="scale-transition"
                      offset-y
                      max-width="290px"
                      min-width="290px"
                    >
                      <template #activator="{ on, attrs }">
                        <v-text-field
                          v-model="schedule.time"
                          label="Turno"
                          prepend-icon="mdi-clock-time-four-outline"
                          readonly
                          v-bind="attrs"
                          :rules="timeRules"
                          required
                          v-on="on"
                        />
                      </template>
                      <v-time-picker
                        v-if="menu"
                        v-model="schedule.time"
                        full-width
                        @click:minute="$refs.menu.save(schedule.time)"
                      />
                    </v-menu>
                  </v-col>
                  <v-col cols="6" md="6">
                    <v-checkbox
                      v-model="schedule.status"
                      :label="`Activo`"
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

  </v-main>
</template>

<script>
import { getSchedule, saveSchedule, updateSchedule, deleteSchedule } from '@/api/schedules'
import { checkSpecificPermission } from '@/utils/permission'

export default {
  name: 'Movie',
  data() {
    return {
      headers: [
        { value: 'id', align: 'center', text: 'Folio' },
        { value: 'time', text: 'Turno', sortable: true },
        { value: 'created_at', with: '100%', sortable: true, align: 'right', text: 'Registrado' },
        { value: 'status', text: 'Activo', sortable: true },
        { value: 'actions', text: 'Acciones', sortable: false }
      ],
      search: '',
      schedule: {
        time: null
      },
      toggler: false,
      listLoading: true,
      dialogLoading: false,
      isUpdate: false,
      dialog: false,
      list: [],
      valid: false,
      title: 'Turnos',
      timeRules: [
        v => !!v || 'tiempo es requerido'
      ],
      menu: false
    }
  },
  computed: {
  },
  created() {
    this.getList()
  },
  methods: {
    async getList() {
      this.listLoading = true
      const data = await getSchedule()
      this.list = data || []
      this.total = data.length || 0
      this.listLoading = false
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
      this.schedule = {}
    },
    checkSpecificPermission,
    async save() {
      if (this.$refs.form.validate()) {
        this.dialog = false
        this.dialogLoading = true
        try {
          await saveSchedule(this.schedule)
          this.getList()
          this.dialogLoading = false
        } catch (error) {
          console.log('try catch')
          console.log(error)
          this.dialogLoading = false
        }
      }
    },
    async deleteSchedules(item) {
      this.dialogLoading = true
      try {
        await deleteSchedule(item.id)
        this.getList()
        this.dialogLoading = false
      } catch (error) {
        console.log('try catch')
        console.log(error)
        this.dialogLoading = false
      }
    },
    editMovie(item) {
      this.isUpdate = true
      const _this = this
      Object.keys(item).forEach(function(key) {
        switch (key) {
          case 'status':
            _this.schedule[key] = item[key]
            if (item[key] === 0) { delete _this.schedule[key] }
            break
          default:
            _this.schedule[key] = item[key]
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
        formData.append('time', this.schedule.time)
        formData.append('status', this.schedule.status === false ? 0 : 1)
        formData.append('id', this.schedule.id)
        try {
          await updateSchedule(formData, this.schedule.id)
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
