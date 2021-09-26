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
          <span>Crear nuevo cliente</span>
        </v-tooltip>
        Clientes
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
        <template #[`item.name`]="{ item }">
          {{ item.name }} {{ item.last_name }}
        </template>
        <template #[`item.type_contact`]="{ item }">
          <v-chip
            v-if="item.type_contact != null"
            :color="getColor(item.type_contact)"
            dark
          >
            {{ item.type_contact }}
            <v-icon
              v-if="item.type_contact === 'Whatsapp'"
              class="pl-1"
              color="white darken-2"
            >
              mdi-whatsapp
            </v-icon>
            <v-icon
              v-if="item.type_contact === 'Llamada'"
              class="pl-1"
              color="white darken-2"
            >
              mdi-phone
            </v-icon>
            <v-icon
              v-if="item.type_contact === 'Correo'"
              class="pl-1"
              color="white darken-2"
            >
              mdi-email
            </v-icon>
          </v-chip>
        </template>

        <template #[`item.subscribed`]="{ item }">
          <v-chip
            v-if="item.subscribed != null"
            :color="getColor2(item.subscribed)"
            dark
          >
            <span v-if="item.subscribed === true"> SI </span>
            <span v-else> NO </span>
            <v-icon
              v-if="item.subscribed === true"
              class="pl-1"
              color="white darken-2"
            >
              mdi-check-circle-outline
            </v-icon>
            <v-icon
              v-else
              class="pl-1"
              color="white darken-2"
            >
              mdi-close-outline
            </v-icon>
          </v-chip>
        </template>

        <template #[`item.actions`]="{ item }">
          <div
            align="stretch"
            class="d-inline-flex"
            justify="space-around"
          >
            <v-tooltip top>
              <template #activator="{ on, attrs }">
                <v-btn
                  v-if="checkSpecificPermission('edit-customer')"
                  class="mx-2"
                  fab
                  dark
                  v-bind="attrs"
                  x-small
                  color="green"
                  v-on="on"
                  @click="editCustomer(item)"
                >
                  <v-icon dark>
                    mdi-pencil
                  </v-icon>
                </v-btn>
              </template>
              <span>Editar cliente</span>
            </v-tooltip>
            <el-popconfirm
              title="¿Eliminar cliente?"
              confirm-button-text="Eliminar"
              cancel-button-text="Cancelar"
              confirm-button-type="danger force-white-color"
              @confirm="deleteCustomer(item)"
            >
              <v-btn
                v-if="checkSpecificPermission('delete-customer')"
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

          </div>
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
            <span class="headline">Datos de cliente (nuevo)</span>
          </v-card-title>
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
                  <v-text-field
                    v-model="customer.name"
                    label="Nombres"
                    :rules="nameRules"
                    required
                    @change="validateInputs"
                  />
                </v-col>
                <v-col
                  cols="6"
                >
                  <v-text-field
                    v-model="customer.last_name"
                    label="Apellidos"
                    :rules="lastNameRules"
                    required
                    @change="validateInputs"
                  />
                </v-col>

                <v-col
                  cols="4"
                >
                  <v-text-field
                    v-model="customer.phone"
                    label="Telefono"
                    required
                  />
                </v-col>

                <v-col
                  cols="4"
                >
                  <v-text-field
                    v-model="customer.cellphone_girlfriend"
                    label="Celular novia"
                    required
                  />
                </v-col>

                <v-col
                  cols="4"
                >
                  <v-text-field
                    v-model="customer.cellphone_boyfriend"
                    label="Celular novio"
                    required
                  />
                </v-col>

                <v-col cols="6" md="6">
                  <v-text-field
                    v-model="customer.emails"
                    label="Correo electronico*"
                    type="email"
                    :rules="emailRules"
                    required
                    @change="validateInputs"
                  />
                </v-col>
                <v-col
                  cols="6"
                >

                  <v-combobox
                    v-model="customer.type_contact"
                    required
                    label="Medio de contacto"
                    :items="types"
                    item-text="name"
                    item-value="name"
                    hide-selected
                    persistent-hint
                    small-chips
                  />
                </v-col>
              </v-row>
            </v-form>
          </v-container>
          <v-card-text>

            <small class="red--text float-right">*Campos obligatorios</small>
          </v-card-text>
          <v-card-actions style="width: 100%;">
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
              @click="saveCustomer()"
            >
              Guardar
            </v-btn>
            <v-btn
              v-else
              color="primary darken-1"
              text
              @click="updateCustomer()"
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
import { getCustomers, saveCustomer, updateCustomer, destroyCustomer } from '@/api/customer'
import { checkSpecificPermission } from '@/utils/permission'

export default {
  name: 'Customers',
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
      status: [
        'Contacto',
        'Cotización',
        'Reservado',
        'Cancelado'
      ],
      modalSchedule: false,
      classDisplay: '',
      wedding_date: false,
      requiredRule: [
        v => !!v || 'Este campo es requerido'
      ],
      visible: false,
      isUpdate: false,
      dialog: false,
      dialog2: false,
      valid: false,
      customers: {},
      customer: {},
      listLoading: true,
      types: [
        { name: 'Llamada' },
        { name: 'Whatsapp' },
        { name: 'Correo' }
      ],
      filterText: undefined,
      dialogLoading: false,
      emailRules: [
        v => !!v || 'Correo electronico es requerido',
        v => /.+@.+\..+/.test(v) || 'Correo electronico invalido'
      ],
      nameRules: [
        v => !!v || 'Nombre es requerido'
      ],
      lastNameRules: [
        v => !!v || 'Apellido es requerido'
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
        { value: 'type_contact', align: 'center', text: 'Medio', sortable: true },
        { value: 'emails', with: '50%', text: 'Correo', sortable: true },
        { value: 'subscribed', with: '50%', text: 'Subscrito', sortable: true },
        { value: 'phone', text: 'Telefono', sortable: true },
        { value: 'cellphone_girlfriend', text: 'Celular novia', sortable: true },
        { value: 'cellphone_boyfriend', text: 'Celular novio', sortable: true },
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
  },
  methods: {
    async getList() {
      this.listLoading = true
      const data = await getCustomers()
      this.list = data
      this.total = data.length
      this.listLoading = false
    },
    validateInputs() {
      if (this.$refs.form.validate()) {
        this.newQuote = false
      } else {
        this.newQuote = true
      }
    },
    checkSpecificPermission,
    clearInputs() {
      this.customers.name = undefined
      this.customers.email = undefined
    },
    clearDialogInputs(key) {
      switch (key) {
        case 'quote':
          this.quote = {
            status: 'Contacto'
          }
          break

        case 'customer':
          this.customer = {}
          break
      }
      this.newQuote = true
      this.$forceUpdate()
    },
    async updateCustomer() {
      if (this.$refs.form.validate()) {
        this.dialog = false
        this.dialogLoading = true
        try {
          await updateCustomer(this.customer)
          this.getList()
          this.dialogLoading = false
        } catch (error) {
          console.log('try catch')
          console.log(error)
          this.dialogLoading = false
        }
      }
    },
    async saveCustomer() {
      if (this.$refs.form.validate()) {
        this.dialog = false
        this.dialogLoading = true
        try {
          await saveCustomer(this.customer)
          this.clearDialogInputs('customer')
          this.getList()
          this.dialogLoading = false
        } catch (error) {
          console.log('try catch')
          console.log(error)
          this.dialogLoading = false
        }
      }
    },
    editCustomer(item) {
      this.clearDialogInputs('customer')
      this.isUpdate = true
      this.classDisplay = 'd-none'
      const _this = this
      Object.keys(item).forEach(function(key) {
        _this.customer[key] = item[key]
      })
      this.dialog = true
    },
    async deleteCustomer(item) {
      this.dialogLoading = true
      try {
        await destroyCustomer(item.id)
        this.getList()
        this.dialogLoading = false
      } catch (error) {
        console.log('try catch')
        console.log(error)
        this.dialogLoading = false
      }
    },
    showModal() {
      this.clearDialogInputs('customer')
      this.isUpdate = false
      this.classDisplay = ''
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
    getColor(type) {
      switch (type) {
        case 'Llamada': return 'blue'
        case 'Whatsapp': return 'green'
        default: return 'grey'
      }
    },
    getColor2(type) {
      switch (type) {
        case true: return 'blue'
        default: return 'yellow'
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
.fullScreenStyle{
  z-index: 9999;
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
