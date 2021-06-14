<template>
  <v-main class="ma-10">
    <v-card>
      <v-card-title>
        <v-tooltip top>
          <template v-slot:activator="{ on, attrs }">
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
          <span>Crear nuevo {{ title }}</span>
        </v-tooltip>
        Avisos
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
          itemsPerPageOptions: [5,10],
        }"
        loading-text="Cargando....... Espere un momento"
      >
        <template v-slot:[`item.url`]="{ item }">
          <v-container fluid>
            <v-layout justify-center align-center>
              <v-flex shrink>
                <div>
                  <FsLightbox
                    :toggler="toggler"
                    :sources="[
                      item.url
                    ]"
                  />
                  <v-img
                    style="cursor:pointer"
                    contain
                    :lazy-src="item.url"
                    max-height="100"
                    max-width="120"
                    :src="item.url"
                  />
                </div>
              </v-flex>
            </v-layout>
          </v-container>
        </template>
        <template v-slot:[`item.actions`]="{ item }">
          <v-row
            align="center"
            justify="space-around"
          >
            <v-tooltip top>
              <template v-slot:activator="{ on, attrs }">
                <v-btn
                  class="mx-2"
                  fab
                  dark
                  v-bind="attrs"
                  x-small
                  color="green"
                  v-on="on"
                  @click="editNotice(item)"
                >
                  <v-icon dark>
                    mdi-pencil
                  </v-icon>
                </v-btn>
              </template>
              <span>Editar {{ title }}</span>
            </v-tooltip>
            <el-popconfirm
              :title="'Eliminar ' + title + '?'"
              confirm-button-text="Eliminar"
              cancel-button-text="Cancelar"
              confirm-button-type="danger force-white-color"
              @onConfirm="deleteNotice(item)"
            >
              <v-btn
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

    <template>
      <v-row justify="center">
        <v-dialog
          v-model="dialog"
          persistent
          max-width="600px"
        >
          <v-card>
            <v-card-title>
              <span class="headline">Nuevo {{ title }}</span>
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
                        v-model="notice.name"
                        label="Nombre*"
                        :rules="nameRules"
                        required
                      />
                    </v-col>
                    <v-col cols="12" md="6">
                      <v-file-input
                        v-model="notice.file"
                        placeholder="Subir aviso"
                        label="Archivo"
                        :rules="fileRules"
                        accept="image/*"
                        prepend-icon="mdi-paperclip"
                      >
                        <template v-slot:selection="{ text }">
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
                @click="saveNotice()"
              >
                Guardar
              </v-btn>
              <v-btn
                v-else
                color="primary darken-1"
                text
                @click="updateNotice()"
              >
                Actualizar
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-row>
    </template>

  </v-main>
</template>

<script>
import { getNotices, saveNotice, updateNotice, deleteNotice } from '@/api/notices'
import FsLightbox from 'fslightbox-vue'

export default {
  name: 'Notices',
  filters: {
    statusFilter(status) {
      const statusMap = {
        published: 'success',
        draft: 'info',
        deleted: 'danger'
      }
      return statusMap[status]
    }
  },
  components: { FsLightbox },
  data() {
    return {
      list: [],
      total: 0,
      listLoading: true,
      search: '',
      title: 'aviso',
      toggler: false,
      valid: false,
      isUpdate: false,
      dialogLoading: false,
      dialog: false,
      notice: {},
      nameRules: [
        v => !!v || 'Nombre es requerido'
      ],
      fileRules: [
        v => !!v || 'Archivo es requerido'
      ],
      headers: [
        { value: 'id', align: 'center', text: 'Folio' },
        { value: 'name', text: 'Nombre', sortable: true },
        { value: 'url', align: 'center', text: 'Imagen', sortable: false },
        { value: 'created_at', with: '100%', sortable: true, align: 'center', text: 'Registrado' },
        { value: 'actions', text: 'Acciones', sortable: false }
      ],
      listQuery: {
        page: 1,
        limit: 20
      }
    }
  },
  created() {
    this.getList()
  },
  methods: {
    async getList() {
      this.listLoading = true
      this.list = await getNotices(this.$apiKey)
      this.listLoading = false
    },
    clearInputs() {
      this.notice = {}
    },
    showModal() {
      this.clearInputs()
      this.isUpdate = false
      this.fileRules = [
        v => !!v || 'Archivo es requerido'
      ]
      this.dialog = true
      this.$nextTick(() => {
        this.$refs.form.resetValidation()
      })
      // setTimeout(() => this.$refs.form.resetValidation(), 200)
    },
    async updateNotice() {
      if (this.$refs.form.validate()) {
        this.dialog = false
        this.dialogLoading = true

        const formData = new FormData()
        formData.append('file', this.notice.file, this.notice.file.name)
        formData.append('name', this.notice.name)
        formData.append('id', this.notice.id)

        try {
          await updateNotice(formData)
          this.getList()
          this.dialogLoading = false
        } catch (error) {
          console.log('try catch')
          console.log(error)
          this.dialogLoading = false
        }
      }
    },
    async saveNotice() {
      if (this.$refs.form.validate()) {
        this.dialog = false
        this.dialogLoading = true

        const formData = new FormData()
        formData.append('file', this.notice.file, this.notice.file.name)
        formData.append('name', this.notice.name)

        try {
          await saveNotice(formData)
          this.getList()
          this.dialogLoading = false
        } catch (error) {
          console.log('try catch')
          console.log(error)
          this.dialogLoading = false
        }
      }
    },
    editNotice(item) {
      this.clearInputs()
      this.isUpdate = true
      this.notice.name = item.name
      this.notice.id = item.id
      this.fileRules = []
      this.dialog = true
    },
    async deleteNotice(item) {
      this.dialogLoading = true
      try {
        await deleteNotice(item.id)
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
</script>

<style scoped>
.edit-input {
  padding-right: 100px;
}
.cancel-btn {
  position: absolute;
  right: 15px;
  top: 10px;
}
</style>
