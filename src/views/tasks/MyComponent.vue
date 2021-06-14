<template>
  <el-row>
    <v-card
      class="ma-2"
    >
      <v-list-item two-line>
        <v-list-item-content class="pb-1">
          <v-list-item-title class="headline">
            <div v-if="data.date_init || data.final_date" class="subheading subtitle-2 font-weight-thin font-italic grey--text pl-4 pr-4 float-right">
              <v-tooltip top>
                <template v-slot:activator="{ on, attrs }">
                  <span
                    v-bind="attrs"
                    v-on="on"
                  >
                    {{ data.date_init }} / {{ data.final_date }}
                  </span>
                </template>
                <span>Inicio Vig/ Fin Vig</span>
              </v-tooltip>
            </div>
          </v-list-item-title>
          <v-list-item-title class="headline">
            <div class="subheading subtitle-2 font-weight-thin font-italic grey--text pl-4 pr-4 float-right">
              Fecha limite de pago: <span class="font-weight-bold"> {{ data.limit_date_paid }} </span>
            </div>
          </v-list-item-title>
          <v-list-item-title class="headline d-inline-flex pt-2">
            <v-layout align-center>
              <v-flex fill-height>
                <v-tooltip top>
                  <template v-slot:activator="{ on, attrs }">
                    <span
                      v-bind="attrs"
                      v-on="on"
                    >
                      <v-badge
                        :color="data.traffic_light"
                        overlap
                      >
                        <v-icon medium>
                          mdi-traffic-light
                        </v-icon>
                      </v-badge>
                    </span>
                  </template>
                  <span>Dias restantes {{ data.restDays }}</span>
                </v-tooltip>

              </v-flex>
            </v-layout>
            <v-layout align-center>
              <v-flex fill-height>{{ data.name_type_task }}</v-flex>
            </v-layout>
            <div v-if="data.price" class="subheading title font-weight-bold primary--text pl-4 pr-4 float-right">
              <v-tooltip top>
                <template v-slot:activator="{ on, attrs }">
                  <span
                    v-bind="attrs"
                    v-on="on"
                  >{{ data.price | currency }}</span>
                </template>
                <span>Prima Neta</span>
              </v-tooltip>
            </div>

            <div class="flex-column">

              <v-timeline v-if="data.actual_price || data.actual_price" dense>
                <v-timeline-item small fill-dot>
                  <div v-if="data.actual_price" class=" title font-weight-bold primary--text">
                    <v-tooltip top>
                      <template v-slot:activator="{ on, attrs }">
                        <span
                          v-bind="attrs"
                          v-on="on"
                        >{{ data.actual_price | currency }}</span>
                      </template>
                      <span>Prima Neta Actual</span>
                    </v-tooltip>
                  </div>
                </v-timeline-item>
                <v-timeline-item class="text-right" small fill-dot>
                  <div v-if="data.renov_price" class=" title font-weight-bold primary--text">
                    <v-tooltip top>
                      <template v-slot:activator="{ on, attrs }">
                        <span
                          v-bind="attrs"
                          v-on="on"
                        >{{ data.renov_price | currency }}</span>
                      </template>
                      <span>Prima Neta Renov</span>
                    </v-tooltip>
                  </div>
                </v-timeline-item>
              </v-timeline>

            </div>
          </v-list-item-title>
          <v-list-item-title v-if="data.policy_number" class="subtitle-1">
            Póliza: {{ data.policy_number }}
          </v-list-item-title>
          <v-list-item-title v-if="data.number_endorsement" class="subtitle-1">
            Endoso: {{ data.number_endorsement }}
          </v-list-item-title>
          <v-list-item-subtitle class="d-inline-flex">
            <p v-if="data.branches" class="mr-1 mb-0 font-weight-medium text-truncate">
              {{ data.branches.name }} | {{ data.sub_branches.name }}
            </p>
            <p class="mr-1 mb-0 font-weight-medium blue--text">
              {{ data.insurance.name }}
            </p>
          </v-list-item-subtitle>
          <v-list-item-subtitle>Creado: {{ data.created_at }} </v-list-item-subtitle>
          <v-list-item-subtitle v-if="data.last_reminder">Ultimo recordatorio:
            <span class="mr-1 mb-0 font-weight-medium blue--text">
              {{ data.last_reminder }}
            </span>
          </v-list-item-subtitle>
          <v-list-item-subtitle v-if="data.day_payment">Fecha de pago:
            <span class="mr-1 mb-0 font-weight-medium blue--text">
              {{ data.day_payment }}
            </span>
          </v-list-item-subtitle>
          <v-list-item-subtitle v-if="data.responsable">Responsable: {{ data.responsable }} </v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>
      <v-list-item three-line style="min-height:unset !important;">
        <v-list-item-subtitle class="d-inline-flex">
          <div v-if="data.recibe" class="float-right">
            Recibo: <strong>{{ data.recibe }}</strong>
          </div>
          <div v-if="data.is_subsequent" class="pl-4 pr-4 float-right">
            Subsecuente: <strong>{{ data.is_subsequent }}</strong>
          </div>
          <div v-if="data.is_paid" class="float-right">
            Pagado:
            <strong v-if="data.is_paid == 'SI'" class="blue--text">{{ data.is_paid }}</strong>
            <strong v-else class="red--text">{{ data.is_paid }}</strong>
          </div>
        </v-list-item-subtitle>
      </v-list-item>

      <v-list-item three-line style="min-height:unset !important;">
        <v-list-item-subtitle class="d-inline-flex">
          <div v-if="data.payment_applied" class="float-right">
            Aplicado:
            <strong v-if="data.payment_applied == 'SI'" class="blue--text">{{ data.payment_applied }}</strong>
            <strong v-else class="red--text">{{ data.payment_applied }}</strong>

          </div>
          <div v-if="data.sent_invoice" class="pl-4 pr-4 float-right">
            Factura enviada: <strong>{{ data.sent_invoice }}</strong>
          </div>
          <div v-if="data.method_of_payment" class="float-right">
            Forma de pago: <strong>{{ data.method_of_payment }} {{ data.type_of_currency }}</strong>
          </div>
        </v-list-item-subtitle>
      </v-list-item>

      <v-card-actions class="flex-column">
        <v-list-item class="pl-1 pr-1 grow" style="width:100%">
          <v-list-item-avatar color="white darken-3">
            <v-avatar color="grey">
              <v-icon>
                mdi-account-tie
              </v-icon>
            </v-avatar>
          </v-list-item-avatar>
          <v-list-item-content class="pb-1 pt-1">
            <p v-if="data.agent" class="ma-0 font-weight-regular"> Agente:
              <span class="font-italic font-weight-light">{{ data.agent }} </span>
            </p>
            <p v-if="data.sub_agent" class="ma-0 font-weight-regular"> Subagente:
              <span class="font-italic font-weight-light">{{ data.sub_agent }} </span>
            </p>
          </v-list-item-content>
        </v-list-item>
        <v-list-item class="pl-1 pr-1 grow" style="width:100%">
          <v-list-item-avatar color="white darken-3">
            <v-avatar color="cyan">
              <v-icon dark>
                mdi-account-circle
              </v-icon>
            </v-avatar>
          </v-list-item-avatar>
          <v-list-item-content class="pb-1 pt-1">
            <p v-if="data.name_contractor" class="ma-0 font-weight-regular"> Contratante:
              <span class="font-italic font-weight-light">{{ data.name_contractor }} </span>
            </p>
            <p v-if="data.insured_name" class="ma-0 font-weight-regular"> Asegurado:
              <span class="font-italic font-weight-light">{{ data.insured_name }} </span>
            </p>
            <p v-if="data.user.name" class="ma-0 font-weight-regular"> Usuario:
              <span class="font-italic font-weight-light">{{ data.user.name }} </span>
            </p>
          </v-list-item-content>
        </v-list-item>
        <v-expansion-panels v-if="data.comments">
          <v-expansion-panel shaped>
            <v-expansion-panel-header>
              Comentario
              <template v-slot:actions>
                <v-icon color="primary">
                  $expand
                </v-icon>
              </template>
            </v-expansion-panel-header>
            <v-expansion-panel-content>
              <p class="subtitle-2 font-italic"> {{ data.comments }} </p>
            </v-expansion-panel-content>
          </v-expansion-panel>
        </v-expansion-panels>
      </v-card-actions>
    </v-card>
  </el-row>
</template>

<style>

    .title{
        font-weight: bold;
    }

    .task-card{
        max-width: 300px;
        margin: 10px;
    }

  .time {
    font-size: 13px;
    color: #999;
  }

  .bottom {
    margin-top: 13px;
    line-height: 12px;
  }

  .button-right{
      padding: 0;
      float: left;
      width: 85%;
  }
  .button {
    padding: 0;
    float: right;
  }

  .image {
    width: 100%;
    display: block;
  }

  .clearfix:before,
  .clearfix:after {
      display: table;
      content: "";
  }

  .clearfix:after {
      clear: both
  }
</style>

<script>
export default {
  name: 'MyComponent',
  props: ['data'],
  methods: {
    markDone() {
      this.$emit('done', this.data)
    }
  }
}
</script>
