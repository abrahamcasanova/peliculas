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
          <span>Crear nuevo usuario</span>
        </v-tooltip>
        Usuarios
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
        <template v-slot:[`item.roles`]="{ item }">
          <v-chip
            v-if="item.roles[0] != null"
            :color="getColor(item.roles[0].name)"
            dark
          >
            {{ item.roles[0].name }}
          </v-chip>
        </template>
        <template v-slot:[`item.actions`]="{ item }">
          <v-row
            align="center"
            justify="space-around"
          >
            <v-tooltip top>
              <template v-slot:activator="{ on, attrs }">
                <v-btn
                  v-if="checkSpecificPermission('edit-user')"
                  class="mx-2"
                  fab
                  dark
                  v-bind="attrs"
                  x-small
                  color="green"
                  v-on="on"
                  @click="editUser(item)"
                >
                  <v-icon dark>
                    mdi-pencil
                  </v-icon>
                </v-btn>
              </template>
              <span>Editar usuario</span>
            </v-tooltip>
            <el-popconfirm
              title="¿Eliminar usuario?"
              confirm-button-text="Eliminar"
              cancel-button-text="Cancelar"
              confirm-button-type="danger force-white-color"
              @onConfirm="deleteUser(item)"
            >
              <v-btn
                v-if="checkSpecificPermission('delete-user')"
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
              <span class="headline">Perfil de usuario (nuevo)</span>
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
                        v-model="user.name"
                        label="Nombre"
                        :rules="nameRules"
                        required
                      />
                    </v-col>
                    <v-col cols="6" md="6">
                      <v-text-field
                        v-model="user.email"
                        label="Correo electronico*"
                        type="email"
                        :rules="emailRules"
                        required
                      />
                    </v-col>
                    <v-col cols="6" md="6">
                      <v-text-field
                        v-model="user.password"
                        label="Contraseña*"
                        type="password"
                        :rules="passwordRules"
                        required
                      />
                    </v-col>
                    <v-col
                      cols="12"
                    >
                      <v-autocomplete
                        v-model="user.rol"
                        required
                        :rules="rolRules"
                        :items="roles"
                        chips
                        item-text="name"
                        item-value="name"
                        small-chips
                        clearable
                        label="Rol*"
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
                @click="saveUser()"
              >
                Guardar
              </v-btn>
              <v-btn
                v-else
                color="primary darken-1"
                text
                @click="updateUser()"
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
import { getUsers, saveUser, updateUser, deleteUser } from '@/api/user'
import { getRoles } from '@/api/role'
import { checkSpecificPermission } from '@/utils/permission' // 权限判断函数

export default {
  name: 'Users',
  // components: { Pagination },
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
  data() {
    return {
      list: [],
      total: 0,
      visible: false,
      isUpdate: false,
      dialog: false,
      valid: false,
      user: {
        name: '',
        email: '',
        admon_user: true
      },
      listLoading: true,
      roles: [],
      filterText: undefined,
      dialogLoading: false,
      emailRules: [
        v => !!v || 'Correo electronico es requerido',
        v => /.+@.+\..+/.test(v) || 'Correo electronico invalido'
      ],
      nameRules: [
        v => !!v || 'Nombre es requerido'
      ],
      passwordRules: [
        v => !!v || 'Contraseña es requerido',
        v => (v && v.length >= 5) || 'Contraseña tiene que tener al menos 5 carácteres'
      ],
      rolRules: [
        v => !!v || 'Rol es requerido'
      ],
      listQuery: {
        page: 1,
        limit: 10,
        importance: undefined,
        title: undefined,
        type: undefined,
        sort: '+id'
      },
      orders: [],
      headers: [
        { value: 'id', align: 'center', text: 'Folio' },
        { value: 'name', text: 'Nombre', sortable: true },
        { value: 'roles', align: 'center', text: 'Rol', sortable: true },
        { value: 'email', text: 'Correo', sortable: true },
        { value: 'created_at', with: '100%', sortable: true, align: 'right', text: 'Registrado' },
        { value: 'actions', text: 'Acciones', sortable: false }
      ],
      search: ''
    }
  },
  computed: {
    displayData() {
      if (!this.list || this.list.length === 0) return []
      return this.list.slice(this.listQuery.limit * this.listQuery.page - this.listQuery.limit, this.listQuery.limit * this.listQuery.page)
    }
  },
  created() {
    this.getList()
    this.getRoles()
  },
  methods: {
    async getList() {
      this.listLoading = true
      const data = await getUsers()
      this.list = data
      this.total = data.length
      this.listLoading = false
    },
    checkSpecificPermission,
    clearInputs() {
      this.user.name = undefined
      this.user.email = undefined
      this.user.rol = undefined
    },
    async updateUser() {
      if (this.$refs.form.validate()) {
        this.dialog = false
        this.dialogLoading = true
        try {
          await updateUser(this.user)
          this.getList()
          this.dialogLoading = false
        } catch (error) {
          console.log('try catch')
          console.log(error)
          this.dialogLoading = false
        }
      }
    },
    async saveUser() {
      if (this.$refs.form.validate()) {
        this.dialog = false
        this.dialogLoading = true
        try {
          await saveUser(this.user)
          this.getList()
          this.dialogLoading = false
        } catch (error) {
          console.log('try catch')
          console.log(error)
          this.dialogLoading = false
        }
      }
    },
    editUser(item) {
      this.clearInputs()
      this.isUpdate = true
      this.user.name = item.name
      this.user.id = item.id
      this.user.email = item.email
      this.user.rol = item.roles ? item.roles[0].name : null
      this.passwordRules = []
      this.dialog = true
    },
    async deleteUser(item) {
      this.dialogLoading = true
      try {
        await deleteUser(item.id)
        this.getList()
        this.dialogLoading = false
      } catch (error) {
        console.log('try catch')
        console.log(error)
        this.dialogLoading = false
      }
    },
    showModal() {
      this.clearInputs()
      this.isUpdate = false
      this.passwordRules = [
        v => !!v || 'Contraseña es requerido',
        v => (v && v.length >= 5) || 'Contraseña tiene que tener al menos 5 carácteres'
      ]
      this.dialog = true
      this.$nextTick(() => {
        this.$refs.form.resetValidation()
      })
      // setTimeout(() => this.$refs.form.resetValidation(), 200)
    },
    async getRoles() {
      const res = await getRoles()
      this.roles = res
    },
    getColor(rol) {
      switch (rol) {
        case 'admin': return 'blue'
        case 'ejecutivo': return 'green'
        default: return 'grey'
      }
    }
  }
}
</script>

<style>
.sortable-ghost{
  opacity: .8;
  color: #fff!important;
  background: #42b983!important;
}
</style>

<style scoped>
.icon-star{
  margin-right:2px;
}
.drag-handler{
  width: 20px;
  height: 20px;
  cursor: pointer;
}
.show-d{
  margin-top: 15px;
}
</style>
