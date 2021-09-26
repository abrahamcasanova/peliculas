<template>
  <v-main class="ma-10">
    <v-card>
      <v-card-title>
        Seguimiento
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
        :items="quotes"
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
          <v-chip
            :color="getColor(item.status)"
            dark
          >
            {{ item.status }}
          </v-chip>
        </template>

        <template #[`item.statusDay`]="{ item }">
          <v-chip
            v-if="item.statusDay"
            :color="item.color"
            dark
          >
            {{ item.statusDay }}
          </v-chip>
        </template>

        <template #[`item.dateTransc`]="{ item }">
          <label> {{ item.dateTransc }} </label>
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
                  class="mx-2"
                  fab
                  dark
                  v-bind="attrs"
                  x-small
                  color="primary"
                  v-on="on"
                  @click="showModalStatus(item.id)"
                >
                  <v-icon dark>
                    mdi-dots-horizontal-circle-outline
                  </v-icon>
                </v-btn>
              </template>
              <span>Cambiar estatus</span>
            </v-tooltip>

            <v-tooltip top>
              <template #activator="{ on, attrs }">
                <v-btn
                  v-if="checkSpecificPermission('edit-user')"
                  class="mx-2"
                  fab
                  dark
                  v-bind="attrs"
                  x-small
                  color="green"
                  v-on="on"
                  @click="editQuote(item)"
                >
                  <v-icon dark>
                    mdi-pencil
                  </v-icon>
                </v-btn>
              </template>
              <span>Editar cotización</span>
            </v-tooltip>

          </div>
        </template>
      </v-data-table>
    </v-card>

    <v-row justify="center">
      <dialogQuoteVue ref="dialogEdit" :dialog="dialog" :quote.sync="quote" :is-new-quote="isNewQuote" @close="closeDialog" @update="updateQuote" />
    </v-row>

    <v-row justify="center">
      <dialogQuoteStatusVue ref="dialogEdit" :dialog-change-status="dialogChangeStatus" :quote.sync="quote" :is-new-quote="isNewQuote" @close="closeDialog" @update="updateQuote" />
    </v-row>

  </v-main>
</template>

<script>
import dialogQuoteVue from '@/views/quotes/dialogQuote.vue'
import { getQuotes, updateQuote } from '@/api/quote'
import { checkSpecificPermission } from '@/utils/permission'
import dialogQuoteStatusVue from '@/views/quotes/dialogStatusQuote.vue'

export default {
  name: 'LogsTime',
  components: { dialogQuoteVue, dialogQuoteStatusVue },
  data() {
    return {
      quotes: [],
      quote: {
        bitacora: {
          user_id: null

        }
      },
      dialogChangeStatus: false,
      isNewQuote: false,
      search: '',
      dialog: false,
      listLoading: true,
      headers: [
        { value: 'id', align: 'center', text: 'Folio' },
        { value: 'girlfriend_name', text: 'Nombre (novia)', sortable: true },
        { value: 'boyfriend_name', align: 'center', text: 'Nombre (novio)', sortable: true },
        { value: 'wedding_date', text: 'Fecha boda', sortable: true },
        { value: 'status', text: 'Estatus', sortable: true },
        { value: 'schedule', text: 'Horario', sortable: true },
        { value: 'dateTransc', align: 'center', text: 'Dias Transcurridos', sortable: true },
        { value: 'statusDay', text: 'Estatus de respuesta', sortable: true },
        { value: 'comments', text: 'Comentarios', sortable: true },
        { value: 'created_at', with: '100%', sortable: true, align: 'right', text: 'Registrado' },
        { value: 'actions', text: 'Acciones', sortable: false }
      ]
    }
  },
  computed: {
  },
  created() {
    this.getQuotes()
  },
  methods: {
    async getQuotes() {
      const quoteList = await getQuotes()
      this.$nextTick(() => {
        quoteList.forEach(element => {
          element.dateTransc = null
          if (element.logs && element.logs.length > 0) {
            const event2 = new Date(element.logs[0].created_at)
            const countDays = this.moment().diff(event2, 'days', true)
            // const countDays = this.moment(element.logs[0].created_at).diff(this.moment(), 'days')
            // console.log(this.moment(element.logs[0].created_at).fromNow(), secondsElapsed)
            element.dateTransc = this.moment(element.logs[0].created_at).fromNow()
            const response = this.getColorStatus(element.status, countDays)
            element.color = response.color
            element.statusDay = response.text
          }
        })
        this.quotes = quoteList
        // console.log(this.quotes)
        this.listLoading = false
      })
    },
    showModalStatus(id) {
      this.quote = {
        bitacora: {
          user_id: null

        }
      }
      this.quote.id = id
      this.dialogChangeStatus = true
    },
    getColor(type) {
      switch (type) {
        case 'Contacto': return 'primary'
        case 'Cotización': return 'blue'
        case 'Reservado': return 'green'
        case 'Cancelado': return 'red'
        default: return 'grey'
      }
    },
    checkSpecificPermission,
    editQuote(item) {
      this.dialog = true
      this.isNewQuote = false
      this.quote.bitacora = {}
      const _this = this
      Object.keys(item).forEach(function(key) {
        _this.quote[key] = item[key]
      })
    },
    getColorStatus(type, day) {
      switch (type) {
        case 'Contacto':
        case 'Reservado':
        case 'Cancelado':
          if (day >= 2) {
            return { 'color': 'red', 'text': 'En destiempo' }
          } else {
            return { 'color': 'blue', 'text': 'A tiempo' }
          }
        case 'Cotización':
          if (day >= 3) {
            return { 'color': 'red', 'text': 'En destiempo' }
          } else {
            return { 'color': 'blue', 'text': 'A tiempo' }
          }
        default: return { 'color': 'blue', 'text': 'A tiempo' }
      }
    },
    closeDialog() {
      this.dialog = false
      this.dialogChangeStatus = false
    },
    async updateQuote(quote) {
      if (this.$refs.dialogEdit.$refs.form.validate()) {
        this.quote = quote
        this.dialog2 = false
        this.dialogLoading = true
        try {
          await updateQuote(this.quote)
          this.getQuotes()
          this.dialogLoading = false
          this.dialog = false
          this.dialogChangeStatus = false
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
