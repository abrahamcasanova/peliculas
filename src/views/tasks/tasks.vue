<template>
  <div class="app-container">

    <v-card>
      <v-card-title>
        Tareas/Actividades
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

    <drag-drop
      :key="JSON.stringify(stories)"
      :data="stories"
      :dropzones="dropGroups"
      :dropzones-title="'Tareas asignadas'"
      :original-data="stories"
      :original-title="'Tareas por realizar'"
      :in-place="true"
      :enable-save="false"
      :enable-cancel="false"
      @dropInDestinationBucket="destinationBucketDropEvent"
    >
      <template #dd-card="{ cardData }">
        <MyComponent
          :data="cardData"
        />
      </template>
    </drag-drop>
  </div>
</template>
<script>
import DragDrop from 'vue-drag-n-drop'
import MyComponent from './MyComponent.vue'
import { getAll, updateTask } from '@/api/task'

export default {
  name: 'Tasks',
  components: {
    DragDrop,
    MyComponent
  },
  data() {
    return {
      stories: [],
      dropGroups: [
        {
          name: 'Armado de Slip',
          children: []
        },
        {
          name: 'En proceso',
          children: []
        },
        {
          name: 'En proceso de emisión',
          children: []
        },
        {
          name: 'En cotización',
          children: []
        },
        {
          name: 'En revisión',
          children: []
        },
        {
          name: 'En pendiente de información',
          children: []
        },
        {
          name: 'Entregado (cliente)',
          children: []
        },
        {
          name: 'En recotización',
          children: []
        },
        {
          name: 'Rechazada',
          children: []
        },
        {
          name: 'Emitida',
          children: []
        }
      ],
      headers: [
        { value: 'id', align: 'center', text: 'Folio' },
        { value: 'userFullName', text: 'Nombre Usuario', sortable: true },
        { value: 'typeTask', align: 'center', text: 'Tipo', sortable: false },
        { value: 'insured_name', align: 'center', text: 'Asegurado', sortable: false },
        { value: 'insurance_id', align: 'center', text: 'Aseguradora', sortable: false },
        { value: 'policy_number', align: 'center', text: 'Poliza', sortable: false },
        { value: 'name_contractor', align: 'center', text: 'Contratante', sortable: false },
        { value: 'price', align: 'center', text: 'Prima neta', sortable: false },
        { value: 'actual_price', align: 'center', text: 'Prima neta actual', sortable: false },
        { value: 'renov_price', align: 'center', text: 'Prima neta rev', sortable: false },
        { value: 'reservation', align: 'center', text: 'Reserva', sortable: false },
        { value: 'amount_paid', align: 'center', text: 'Monto pagado', sortable: false },
        { value: 'agent', align: 'center', text: 'Agente', sortable: false },
        { value: 'sub_agent', align: 'center', text: 'Subagente', sortable: false },
        { value: 'branch_id', align: 'center', text: 'Ramo', sortable: false },
        { value: 'sub_branch_id', align: 'center', text: 'Subramo', sortable: false },
        { value: 'type_endoso', align: 'center', text: 'Tipo endoso', sortable: false },
        { value: 'recibe', align: 'center', text: 'Recibo', sortable: false },
        { value: 'is_subsequent', align: 'center', text: 'Subsecuente', sortable: false },
        { value: 'is_paid', align: 'center', text: 'Pagado', sortable: false },
        { value: 'number_endorsement', align: 'center', text: 'No. endoso', sortable: false },
        { value: 'method_of_payment', align: 'center', text: 'Forma de pago', sortable: false },
        { value: 'type_of_currency', align: 'center', text: 'Moneda', sortable: false },
        { value: 'suffering', align: 'center', text: 'Padecimiento', sortable: false },
        
        { value: 'number_endorsement', align: 'center', text: 'No. endoso', sortable: false },
        { value: 'number_endorsement', align: 'center', text: 'No. endoso', sortable: false },
        { value: 'number_endorsement', align: 'center', text: 'No. endoso', sortable: false },
        { value: 'number_endorsement', align: 'center', text: 'No. endoso', sortable: false },
        { value: 'number_endorsement', align: 'center', text: 'No. endoso', sortable: false },
        { value: 'number_endorsement', align: 'center', text: 'No. endoso', sortable: false },
        { value: 'number_endorsement', align: 'center', text: 'No. endoso', sortable: false },
        { value: 'number_endorsement', align: 'center', text: 'No. endoso', sortable: false },
        { value: 'number_endorsement', align: 'center', text: 'No. endoso', sortable: false },

        { value: 'created_at', with: '100%', sortable: true, align: 'center', text: 'Registrado' },
        { value: 'actions', text: 'Acciones', sortable: false }
      ]
    }
  },
  created() {
    this.getTaks()
  },
  methods: {
    async getTaks() {
      const tasks = await getAll()
      // this.stories = tasks
      tasks.forEach(element => {
        const index = this.dropGroups.findIndex(elementFind => elementFind.name === element.status)
        element.traffic_light = 'grey'
        if (Object.prototype.hasOwnProperty.call(element, 'limit_date_paid') && element.limit_date_paid != null) {
          const restDays = this.moment(element.limit_date_paid).diff(this.moment(), 'days')
          element.traffic_light = 'red'
          if (restDays > 28) {
            element.traffic_light = 'green'
          } else if (restDays <= 28 && restDays >= 15) {
            element.traffic_light = 'yellow'
          }
          element.restDays = restDays
        }
        this.dropGroups[index].children.push(element)
      })

      this.dropGroups.forEach(element => {
        // element.name = element.name + ' ' + element.children.length
      })
    },
    destinationBucketDropEvent(column, event) {
      if (event.addedIndex !== null) {
        if (event.payload && column !== event.payload.status) {
          event.payload.status = column
          updateTask(event.payload, event.payload.id)
          // console.log(column, event, 'actualizar por cambio de status')
        }
      }
    },
    async updateTask(data, id) {
      try {
        await updateTask(data, id)
        // console.log('update')
      } catch (error) {
        console.log('try catch')
        console.log(error)
      }
    }
  }
}
</script>
<style>
  .dd-drop-container{
    width: auto !important;
    min-width: 350px;
    max-width: 350px;
  }
</style>
