<template>
  <div class="app-container">
    <v-card>
      <v-card-title>
        <span class="headline">Nuevo Tramite</span>
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
                lg="3"
                md="6"
              >
                <v-autocomplete
                  v-model="task.type_task"
                  required
                  :items="types"
                  chips
                  item-text="name"
                  item-value="id"
                  small-chips
                  clearable
                  label="Tipo de tramite*"
                  @input="changeType"
                />
              </v-col>
            </v-row>
            <v-row>
              <v-col
                v-if="task.type_task == 4"
                cols="4"
                lg="4"
                md="4"
              >
                <v-text-field
                  v-model="task.recibe"
                  label="Recibo "
                />
              </v-col>

              <v-col
                v-if="task.type_task == 4"
                cols="4"
                lg="4"
                md="4"
              >
                <v-autocomplete
                  v-model="task.is_subsequent"
                  required
                  :items="['SI','NO']"
                  chips
                  small-chips
                  clearable
                  label="Es subsecuente"
                />
              </v-col>

              <!-- <v-col
                v-if="task.type_task == 4"
                cols="4"
                lg="4"
                md="4"
              >
                <v-autocomplete
                  v-model="task.is_paid"
                  required
                  :items="['SI','NO']"
                  chips
                  small-chips
                  clearable
                  label="Pagado"
                />
              </v-col>
              -->
            </v-row>
            <v-row>

              <v-col
                v-if="task.type_task == 5"
                cols="6"
                lg="6"
                md="6"
              >
                <v-text-field
                  v-model="task.sinister_number"
                  label="Número de siniestro"
                />
              </v-col>

              <v-col
                v-if="task.type_task == 2 || task.type_task == 3 || task.type_task == 4 || task.type_task == 5"
                cols="6"
                lg="6"
                md="6"
              >
                <v-text-field
                  v-model="task.policy_number"
                  label="Número de Póliza"
                />
              </v-col>

              <v-col
                v-if="task.type_task == 4"
                cols="6"
                lg="6"
                md="6"
              >
                <v-text-field
                  v-model="task.number_endorsement"
                  label="Endoso"
                />
              </v-col>

              <v-col
                v-if="task.type_task == 3"
                cols="6"
                lg="6"
                md="6"
              >
                <v-autocomplete
                  v-model="task.type_endoso"
                  required
                  :items="type_endoso"
                  chips
                  small-chips
                  clearable
                  label="Tipo Endoso"
                  @change="changeEndoso"
                />
              </v-col>

            </v-row>
            <v-row>

              <v-col
                v-if="task.type_task == 5 || task.type_task == 4"
                cols="6"
                lg="6"
                md="6"
              >
                <v-text-field
                  v-model="task.name_contractor"
                  label="Nombre del contratante"
                  required
                />
              </v-col>

              <v-col
                v-if="task.type_task != 4"
                cols="6"
                lg="6"
                md="6"
              >
                <v-text-field
                  v-model="task.insured_name"
                  label="Nombre del asegurado"
                  :rules="nameRules"
                  required
                />
              </v-col>
              <v-col
                cols="6"
                lg="6"
                md="6"
              >

                <v-combobox
                  v-model="task.insurance_id"
                  small-chips
                  persistent-hint
                  required
                  :rules="nameRules"
                  :items="insurances"
                  item-text="name"
                  item-value="id"
                  label="Aseguradora"
                  @change="calcLimitDate(false)"
                />

              </v-col>

              <v-col
                v-if="task.type_task == 5"
                cols="6"
                lg="6"
                md="6"
              >
                <v-text-field
                  v-model="task.folio_procedure"
                  label="Folio del trámite"
                />
              </v-col>

            </v-row>
            <v-row>
              <v-col v-if="task.type_task == 5" cols="6" md="4">
                <v-text-field
                  v-model="task.reservation"
                  label="Reserva/Monto reclamado"
                  :prefix="currency"
                  @input="realAmountSinister"
                >
                  <template #label>
                    <div>
                      Reserva/Monto reclamado: <strong style="color:teal">{{ task.reservationFormat }}</strong>
                    </div>
                  </template>
                </v-text-field>
              </v-col>

              <v-col v-if="task.type_task == 5" cols="6" md="4">
                <v-text-field
                  v-model="task.amount_paid"
                  label="Monto pagado"
                  :prefix="currency"
                  @input="realAmountSinister"
                >
                  <template #label>
                    <div>
                      Monto pagado: <strong style="color:teal">{{ task.amountPaidFormat }}</strong>
                    </div>
                  </template>
                </v-text-field>
              </v-col>

              <v-col v-if="task.type_task == 4" cols="4" md="4">
                <v-autocomplete
                  v-model="task.method_of_payment"
                  required
                  :items="methodOfPayments"
                  chips
                  small-chips
                  clearable
                  label="Forma de pago"
                />
              </v-col>

              <v-col v-if="task.type_task == 4" cols="4" md="4">
                <v-autocomplete
                  v-model="task.type_of_currency"
                  required
                  :items="typeOfCurrencies"
                  chips
                  small-chips
                  clearable
                  label="Moneda"
                />
              </v-col>

              <v-col v-if="task.type_task == 2" cols="4" md="4">
                <v-text-field
                  v-model="task.actual_price"
                  label="Prima Neta Actual"
                  :prefix="currency"
                  @input="realPrice"
                >
                  <template #label>
                    <div>
                      Prima Neta Actual: <strong style="color:teal">{{ task.actualPriceFormat }}</strong>
                    </div>
                  </template>
                </v-text-field>
              </v-col>

              <v-col v-if="task.type_task == 2" cols="4" md="4">
                <v-text-field
                  v-model="task.renov_price"
                  label="Prima Neta Renovación"
                  :prefix="currency"
                  @input="realPrice"
                >
                  <template #label>
                    <div>
                      Prima Neta Renovación: <strong style="color:teal">{{ task.renovPriceFormat }}</strong>
                    </div>
                  </template>
                </v-text-field>
              </v-col>

              <v-col v-if="task.type_task != 2 && task.type_task != 5" cols="4" md="4">
                <v-text-field
                  id="price"
                  v-model="task.price"
                  :rules="priceRules"
                  type="number"
                  label="Prima Neta"
                  :prefix="currency"
                  @input="realPrice"
                >
                  <template #label>
                    <div>
                      Prima Neta: <strong style="color:teal">{{ task.priceFormat }}</strong>
                    </div>
                  </template>
                </v-text-field>
              </v-col>

              <v-col v-if="task.type_task == 4" cols="4" md="4">
                <v-text-field
                  id="priceTotal"
                  v-model="task.priceTotal"
                  :rules="priceRules"
                  type="number"
                  label="Prima Total"
                  :prefix="currency"
                  @input="realPrice"
                >
                  <template #label>
                    <div>
                      Prima Total: <strong style="color:teal">{{ task.priceTotalFormat }}</strong>
                    </div>
                  </template>
                </v-text-field>
              </v-col>

              <v-col cols="4" md="4">
                <v-text-field
                  v-model="task.agent"
                  label="Agente"
                />
              </v-col>

              <v-col cols="4" md="4">
                <v-text-field
                  v-model="task.sub_agent"
                  label="Subagente"
                />
              </v-col>

              <v-col cols="4" md="4">
                <v-autocomplete
                  v-model="task.branch_id"
                  required
                  :items="type_insurance"
                  item-text="name"
                  item-value="id"
                  chips
                  small-chips
                  clearable
                  label="Ramo"
                  @input="changeSubBranch"
                />
              </v-col>

              <v-col cols="4" md="4">
                <v-autocomplete
                  v-model="task.sub_branch_id"
                  required
                  :items="sub_type_insurance"
                  item-text="name"
                  item-value="id"
                  chips
                  small-chips
                  clearable
                  label="SubRamo"
                />
              </v-col>

              <v-col v-if="task.type_task == 5" cols="4" md="4">
                <v-text-field
                  v-model="task.suffering"
                  label="Padecimiento/Cobertura afectada"
                />
              </v-col>

              <v-col cols="4" md="4">
                <v-text-field
                  v-model="task.responsable"
                  label="Responsable"
                />
              </v-col>
            </v-row>

            <v-row>
              <v-col
                v-if="task.type_task == 4"
                cols="12"
                sm="4"
                md="4"
              >
                <v-menu
                  ref="menu3"
                  v-model="menu3"
                  :close-on-content-click="false"
                  :return-value.sync="task.date_init"
                  transition="scale-transition"
                  offset-y
                  min-width="auto"
                >
                  <template #activator="{ on, attrs }">
                    <v-text-field
                      v-model="task.date_init"
                      label="Inicio de vigencia"
                      prepend-icon="mdi-calendar"
                      v-bind="attrs"
                      v-on="on"
                    />
                  </template>
                  <v-date-picker
                    v-model="task.date_init"
                    locale="es-mx"
                    no-title
                    scrollable
                    @change="calcLimitDate(true)"
                  >
                    <v-spacer />
                    <v-btn
                      text
                      color="primary"
                      @click="menu3 = false"
                    >
                      Cancelar
                    </v-btn>
                    <v-btn
                      text
                      color="primary"
                      @click="$refs.menu3.save(task.date_init)"
                    >
                      OK
                    </v-btn>
                  </v-date-picker>
                </v-menu>
              </v-col>
              <!--
              <v-col
                v-if="task.type_task == 4"
                cols="12"
                sm="4"
                md="4"
              >
                <v-menu
                  ref="menu4"
                  v-model="menu4"
                  :close-on-content-click="false"
                  :return-value.sync="task.final_date"
                  transition="scale-transition"
                  offset-y
                  min-width="auto"
                >
                  <template v-slot:activator="{ on, attrs }">
                    <v-text-field
                      v-model="task.final_date"
                      label="Fin de vigencia"
                      prepend-icon="mdi-calendar"
                      readonly
                      v-bind="attrs"
                      v-on="on"
                    />
                  </template>
                  <v-date-picker
                    v-model="task.final_date"
                    locale="es-mx"
                    no-title
                    scrollable
                  >
                    <v-spacer />
                    <v-btn
                      text
                      color="primary"
                      @click="menu4 = false"
                    >
                      Cancelar
                    </v-btn>
                    <v-btn
                      text
                      color="primary"
                      @click="$refs.menu4.save(task.final_date)"
                    >
                      OK
                    </v-btn>
                  </v-date-picker>
                </v-menu>
              </v-col>
              -->
              <v-col
                v-if="task.type_task == 4"
                cols="12"
                sm="4"
                md="4"
              >
                <v-menu
                  ref="menu5"
                  v-model="menu5"
                  :close-on-content-click="false"
                  :return-value.sync="task.limit_date_paid"
                  transition="scale-transition"
                  offset-y
                  min-width="auto"
                >
                  <template #activator="{ on, attrs }">
                    <v-text-field
                      v-model="task.limit_date_paid"
                      label="Fecha limite"
                      prepend-icon="mdi-calendar"
                      readonly
                      v-bind="attrs"
                      v-on="on"
                    >
                      <template #label>
                        <div>
                          Fecha limite:
                          <strong v-if="task.restDays >= 0" style="color:teal">{{ task.restDays }} dias</strong>
                          <strong v-else style="color:red">{{ task.restDays }}</strong>
                        </div>
                      </template>
                    </v-text-field>

                  </template>
                  <v-date-picker
                    v-model="task.limit_date_paid"
                    locale="es-mx"
                    no-title
                    scrollable
                  >
                    <v-spacer />
                    <v-btn
                      text
                      color="primary"
                      @click="menu5 = false"
                    >
                      Cancelar
                    </v-btn>
                    <v-btn
                      text
                      color="primary"
                      @click="$refs.menu5.save(task.limit_date_paid)"
                    >
                      OK
                    </v-btn>
                  </v-date-picker>
                </v-menu>
              </v-col>

              <v-col
                v-if="task.type_task == 4"
                cols="12"
                sm="4"
                md="4"
              >
                <v-menu
                  ref="menu6"
                  v-model="menu6"
                  :close-on-content-click="false"
                  :return-value.sync="task.last_reminder"
                  transition="scale-transition"
                  offset-y
                  min-width="auto"
                >
                  <template #activator="{ on, attrs }">
                    <v-text-field
                      v-model="task.last_reminder"
                      label="Ultimo recordatorio"
                      prepend-icon="mdi-calendar"
                      readonly
                      v-bind="attrs"
                      v-on="on"
                    />
                  </template>
                  <v-date-picker
                    v-model="task.last_reminder"
                    locale="es-mx"
                    no-title
                    scrollable
                  >
                    <v-spacer />
                    <v-btn
                      text
                      color="primary"
                      @click="menu6 = false"
                    >
                      Cancelar
                    </v-btn>
                    <v-btn
                      text
                      color="primary"
                      @click="$refs.menu6.save(task.last_reminder)"
                    >
                      OK
                    </v-btn>
                  </v-date-picker>
                </v-menu>
              </v-col>

              <v-col
                v-if="task.type_task == 4"
                cols="12"
                sm="4"
                md="4"
              >
                <v-menu
                  ref="menu7"
                  v-model="menu7"
                  :close-on-content-click="false"
                  :return-value.sync="task.day_payment"
                  transition="scale-transition"
                  offset-y
                  min-width="auto"
                >
                  <template #activator="{ on, attrs }">
                    <v-text-field
                      v-model="task.day_payment"
                      label="Fecha de pago"
                      prepend-icon="mdi-calendar"
                      readonly
                      v-bind="attrs"
                      v-on="on"
                    />

                  </template>
                  <v-date-picker
                    v-model="task.day_payment"
                    locale="es-mx"
                    no-title
                    scrollable
                  >
                    <v-spacer />
                    <v-btn
                      text
                      color="primary"
                      @click="menu7 = false"
                    >
                      Cancelar
                    </v-btn>
                    <v-btn
                      text
                      color="primary"
                      @click="$refs.menu7.save(task.day_payment)"
                    >
                      OK
                    </v-btn>
                  </v-date-picker>
                </v-menu>
              </v-col>

            </v-row>

            <v-row>
              <v-col
                v-if="task.type_task == 5"
                cols="12"
                sm="6"
                md="4"
              >
                <v-menu
                  ref="menu"
                  v-model="menu"
                  :close-on-content-click="false"
                  :return-value.sync="task.date_sinister"
                  transition="scale-transition"
                  offset-y
                  min-width="auto"
                >
                  <template #activator="{ on, attrs }">
                    <v-text-field
                      v-model="task.date_sinister"
                      label="Fecha de siniestro"
                      prepend-icon="mdi-calendar"
                      readonly
                      v-bind="attrs"
                      v-on="on"
                    />
                  </template>
                  <v-date-picker
                    v-model="task.date_sinister"
                    locale="es-mx"
                    no-title
                    scrollable
                  >
                    <v-spacer />
                    <v-btn
                      text
                      color="primary"
                      @click="menu = false"
                    >
                      Cancelar
                    </v-btn>
                    <v-btn
                      text
                      color="primary"
                      @click="$refs.menu.save(task.date_sinister)"
                    >
                      OK
                    </v-btn>
                  </v-date-picker>
                </v-menu>
              </v-col>

              <v-col
                v-if="task.type_task == 5"
                cols="12"
                sm="6"
                md="4"
              >
                <v-menu
                  ref="menu2"
                  v-model="menu2"
                  :close-on-content-click="false"
                  :return-value.sync="task.date_paid"
                  transition="scale-transition"
                  offset-y
                  min-width="auto"
                >
                  <template #activator="{ on, attrs }">
                    <v-text-field
                      v-model="task.date_paid"
                      label="Fecha de pago"
                      prepend-icon="mdi-calendar"
                      readonly
                      v-bind="attrs"
                      v-on="on"
                    />
                  </template>
                  <v-date-picker
                    v-model="task.date_paid"
                    locale="es-mx"
                    no-title
                    scrollable
                  >
                    <v-spacer />
                    <v-btn
                      text
                      color="primary"
                      @click="menu2 = false"
                    >
                      Cancelar
                    </v-btn>
                    <v-btn
                      text
                      color="primary"
                      @click="$refs.menu2.save(task.date_paid)"
                    >
                      OK
                    </v-btn>
                  </v-date-picker>
                </v-menu>
              </v-col>

              <v-col cols="4" md="4">
                <v-autocomplete
                  v-model="task.status"
                  required
                  :items="status"
                  item-text="name"
                  item-value="id"
                  chips
                  small-chips
                  clearable
                  label="Estatus*"
                />
              </v-col>

              <v-col v-if="task.type_task == 4" cols="4" md="4">
                <v-autocomplete
                  v-model="task.payment_applied"
                  required
                  :items="['SI','NO']"
                  chips
                  small-chips
                  clearable
                  label="¿Aplicado?"
                />
              </v-col>

              <v-col v-if="task.type_task == 4" cols="4" md="4">
                <v-autocomplete
                  v-model="task.sent_invoice"
                  required
                  :items="['SI','NO']"
                  chips
                  small-chips
                  clearablef
                  label="¿Factura enviada?"
                />
              </v-col>

              <v-col v-if="task.type_task == 4" cols="4" md="4">
                <v-autocomplete
                  v-model="task.cancelled"
                  required
                  :items="['SI','NO']"
                  chips
                  small-chips
                  clearable
                  label="¿Cancelada?"
                />
              </v-col>

            </v-row>

            <v-row>
              <v-col cols="12" md="12">
                <v-textarea
                  v-model="task.comments"
                  filled
                  auto-grow
                  label="Comentarios u observaciones"
                  rows="3"
                  row-height="30"
                  shaped
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
          v-if="isUpdate == false"
          outlined
          rounded
          color="primary"
          text
          @click="saveTask()"
        >
          Guardar
        </v-btn>
        <v-btn
          v-else
          color="primary"
          text
          @click="updateUser()"
        >
          Actualizar
        </v-btn>
      </v-card-actions>
      <v-snackbar
        v-model="snackbar"
        :timeout="-1"
        color="blue-grey"
        rounded="pill"
      >
        {{ message }}
        <template #action="{ attrs }">
          <v-btn
            color="blue"
            text
            v-bind="attrs"
            @click="snackbar = false"
          >
            Cerrar
          </v-btn>
        </template>
      </v-snackbar>

      <v-snackbar
        v-model="snackbarSaved"
        :timeout="20000"
        absolute
        bottom
        color="success"
        center
      >
        {{ messageSaved }}
        <template #action="{ attrs }">
          <v-btn
            color="white"
            text
            v-bind="attrs"
            @click="snackbarSaved = false"
          >
            Cerrar
          </v-btn>
        </template>
      </v-snackbar>

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

  </div>
</template>

<script>
import { getBranches } from '@/api/branch'
import { saveTask } from '@/api/task'
import { getAllInsurances } from '@/api/insurances'
import { getId } from '@/utils/auth'

export default {
  name: 'NewTasks',
  data() {
    return {
      task: {
        last_reminder: this.moment().format('YYYY-MM-DD'),
        cancelled: 'NO'
      },
      currency: '$',
      nameRules: [
        v => !!v || 'Nombre es requerido'
      ],
      messageSaved: 'Guardado correctamente',
      message: 'Para calcular la fecha limite es necesario seleccionar "Aseguradora", "Ramo" y  "Es subsecuente"',
      snackbar: false,
      snackbarSaved: false,
      priceRules: [],
      isUpdate: false,
      valid: false,
      numberRule: v => {
        if (v == null || v === '') return true
        if (!isNaN(parseFloat(v))) return true
        return 'El campo solo puede llevar numeros'
      },
      menu: false,
      menu2: false,
      menu3: false,
      menu4: false,
      menu5: false,
      menu6: false,
      menu7: false,
      dialogLoading: false,
      type_insurance: [],
      methodOfPayments: [
        'CONTADO',
        'MENSUAL',
        'TRIMESTRAL',
        'SEMESTRAL'
      ],
      typeOfCurrencies: [
        'PESOS',
        'US DOLARES'
      ],
      sub_type_insurance: [],
      insurances: [
        {
          id: 1, 'name': 'AFIRME',
          periodicity: {
            'danios': { 'payDays': 28, 'subsequentPayDays': 28 },
            // 'personas': { 'payDays': 28, 'subsequentPayDays': 28 },
            'autos': { 'payDays': 28, 'subsequentPayDays': 28 }
          }
        },
        {
          id: 2, 'name': 'GNP',
          periodicity: {
            'danios': { 'payDays': 28, 'subsequentPayDays': 28 },
            'personas': { 'payDays': 28, 'subsequentPayDays': 28 },
            'autos': { 'payDays': 13, 'subsequentPayDays': 13 }
          }
        },
        {
          id: 3, 'name': 'ATLAS',
          periodicity: {
            'danios': { 'payDays': 28, 'subsequentPayDays': 0 }
            // 'personas': { 'payDays': 28, 'subsequentPayDays': 28 },
            // 'autos': { 'payDays': 28, 'subsequentPayDays': 28 }
          }
        },
        {
          id: 4, 'name': 'CHUBB-ACE-ABA',
          periodicity: {
            'danios': { 'payDays': 28, 'subsequentPayDays': 28 },
            // 'personas': {'payDays': 28, 'subsequentPayDays': 28},
            'autos': { 'payDays': 28, 'subsequentPayDays': 28 }
          }
        },
        {
          id: 5, 'name': 'AXA',
          periodicity: {
            'danios': { 'payDays': 28, 'subsequentPayDays': 28 },
            'personas': { 'payDays': 28, 'subsequentPayDays': 28 },
            'autos': { 'payDays': 28, 'subsequentPayDays': 28 }
          }
        },
        {
          id: 6, 'name': 'BANORTE',
          periodicity: {
            'danios': { 'payDays': 28, 'subsequentPayDays': 28 },
            'personas': { 'payDays': 28, 'subsequentPayDays': 28 },
            'autos': { 'payDays': 28, 'subsequentPayDays': 28 }
          }
        },
        {
          id: 7, 'name': 'HDI',
          periodicity: {
            'danios': { 'payDays': 28, 'subsequentPayDays': 13 },
            'personas': { 'payDays': 28, 'subsequentPayDays': 28 },
            'autos': { 'payDays': 28, 'subsequentPayDays': 28 }
          }
        },
        {
          id: 8, 'name': 'GMX',
          periodicity: {
            'danios': { 'payDays': 28, 'subsequentPayDays': 0 }
            // 'personas': { 'payDays': 28, 'subsequentPayDays': 28 },
            // 'autos': { 'payDays': 28, 'subsequentPayDays': 28 }
          }
        },
        {
          id: 9, 'name': 'ZURICH GI',
          periodicity: {
            'danios': { 'payDays': 28, 'subsequentPayDays': 28 },
            // 'personas': { 'payDays': 28, 'subsequentPayDays': 28 },
            'autos': { 'payDays': 28, 'subsequentPayDays': 28 }
          }
        },
        {
          id: 10, 'name': 'MAPFRE',
          periodicity: {
            'danios': { 'payDays': 28, 'subsequentPayDays': 28 },
            'personas': { 'payDays': 28, 'subsequentPayDays': 28 },
            'autos': { 'payDays': 28, 'subsequentPayDays': 28 }
          }
        },
        {
          id: 11, 'name': 'SURA',
          periodicity: {
            'danios': { 'payDays': 28, 'subsequentPayDays': 3 },
            // 'personas': { 'payDays': 28, 'subsequentPayDays': 28 },
            'autos': { 'payDays': 28, 'subsequentPayDays': 3 }
          }
        },
        {
          id: 12, 'name': 'INBURSA',
          periodicity: {
            'danios': { 'payDays': 28, 'subsequentPayDays': 3 },
            'personas': { 'payDays': 28, 'subsequentPayDays': 3 }
            // 'autos': { 'payDays': 28, 'subsequentPayDays': 28 }
          }
        },
        {
          id: 13, 'name': 'ALLIANZ',
          periodicity: {
            'danios': { 'payDays': 28, 'subsequentPayDays': 28 },
            'personas': { 'payDays': 28, 'subsequentPayDays': 28 }
            // 'autos': { 'payDays': 28, 'subsequentPayDays': 28 }
          }
        },
        {
          id: 14, 'name': 'QUALITAS',
          periodicity: {
            // 'danios': {'payDays': 28, 'subsequentPayDays': 28},
            // 'personas': { 'payDays': 28, 'subsequentPayDays': 28 },
            'autos': { 'payDays': 13, 'subsequentPayDays': 0 }
          }
        },
        {
          id: 13, 'name': 'METLIFE',
          periodicity: {
            // 'danios': { 'payDays': 28, 'subsequentPayDays': 28 },
            'personas': { 'payDays': 28, 'subsequentPayDays': 28 }
            // 'autos': { 'payDays': 28, 'subsequentPayDays': 28 }
          }
        },
        {
          id: 13, 'name': 'PLAN SEGURO',
          periodicity: {
            // 'danios': { 'payDays': 28, 'subsequentPayDays': 28 },
            'personas': { 'payDays': 28, 'subsequentPayDays': 28 }
            // 'autos': { 'payDays': 28, 'subsequentPayDays': 28 }
          }
        },
        {
          id: 13, 'name': 'SISNOVA',
          periodicity: {
            // 'danios': { 'payDays': 28, 'subsequentPayDays': 28 },
            'personas': { 'payDays': 28, 'subsequentPayDays': 0 }
            // 'autos': { 'payDays': 28, 'subsequentPayDays': 28 }
          }
        }
      ],
      types: [
        { id: 1, name: 'Cotización' },
        /*{ id: 2, name: 'Renovación' },
        { id: 3, name: 'Endoso' },
        { id: 4, name: 'Cobranza' },
        { id: 5, name: 'Siniestros' }*/
      ],
      type_endoso: [
        'A', // prima positiva
        'B', // no pide prima
        'D' // prima negativo
      ],
      status: [
        'Armado de Slip',
        'En proceso de emisión',
        'En proceso',
        'En cotización',
        'En revisión',
        'En pendiente de información',
        'Entregado (cliente)',
        'En recotización',
        'Rechazada',
        'Emitida'
      ],
      gracePeriodicity: {
        'autos': 4,
        'personas': 6,
        'danios': 2
      }
    }
  },
  created() {
    this.getBranch()
    this.getInsurances()
  },
  methods: {
    async getBranch() {
      const branches = await getBranches()
      this.type_insurance = branches
    },
    async getInsurances() {
      this.insurances = await getAllInsurances()
    },
    calcLimitDate(showMessage = true) {
      if (Object.prototype.hasOwnProperty.call(this.task, 'branch_id') &&
        Object.prototype.hasOwnProperty.call(this.task, 'insurance_id') &&
        this.task.insurance_id != null && this.task.is_subsequent) {
        const periodicity = JSON.parse(this.task.insurance_id.periodicity_json)
        let numberDays = 0
        let numberGrace = 0
        switch (this.task.branch_id) {
          case 1:
            numberDays = this.task.is_subsequent === 'SI' ? periodicity.autos.subsequentPayDays : periodicity.autos.payDays
            numberGrace = this.gracePeriodicity.autos
            break
          case 2:
            numberDays = this.task.is_subsequent === 'SI' ? periodicity.personas.subsequentPayDays : periodicity.personas.payDays
            numberGrace = this.gracePeriodicity.personas
            break
          case 3:
            numberDays = this.task.is_subsequent === 'SI' ? periodicity.danios.subsequentPayDays : periodicity.danios.payDays
            numberGrace = this.gracePeriodicity.danios
            break
        }
        this.task.limit_date_paid = this.task.date_init ? this.moment(this.task.date_init).add(numberDays, 'days').format('YYYY-MM-DD') : null

        if (numberDays === 0) {
          const numberWeek = this.moment(this.task.date_init).add(-(numberGrace), 'days').weekday()
          this.task.limit_date_paid = this.moment(this.task.date_init).add(-numberGrace, 'days').format('YYYY-MM-DD')
          if (numberWeek === 0 || numberWeek === 6) {
            switch (numberWeek) {
              case 0:
                this.task.limit_date_paid = this.moment(this.task.date_init).add((-2) + (-numberGrace), 'days').format('YYYY-MM-DD')
                break
              default:
                this.task.limit_date_paid = this.moment(this.task.date_init).add((-1) + (-numberGrace), 'days').format('YYYY-MM-DD')
                break
            }
          }
        }

        this.task.restDays = this.moment(this.task.limit_date_paid).diff(this.moment(), 'days') + 1
      } else {
        this.snackbar = showMessage
      }
    },
    realPrice() {
      this.$nextTick(() => {
        this.task.priceFormat = this.formatAsCurrency(this.task.price, 2)
        this.task.actualPriceFormat = this.formatAsCurrency(this.task.actual_price, 2)
        this.task.renovPriceFormat = this.formatAsCurrency(this.task.renov_price, 2)
        this.task.priceTotalFormat = this.formatAsCurrency(this.task.priceTotal, 2)
        this.$forceUpdate()
      })
    },
    realAmountSinister() {
      this.$nextTick(() => {
        this.task.amountPaidFormat = this.formatAsCurrency(this.task.amount_paid, 2)
        this.task.reservationFormat = this.formatAsCurrency(this.task.reservation, 2)
        this.$forceUpdate()
      })
    },
    formatAsCurrency(value, dec) {
      dec = dec || 0
      if (!value) {
        return 0
      }
      value = Number(value)
      return '$ ' + value.toFixed(dec).replace(/(\d)(?=(\d\d\d)+(?!\d))/g, '$1,')
    },
    changeSubBranch() {
      this.task.sub_branch_id = null
      const find_branch = this.type_insurance.find(item => item.id === this.task.branch_id)
      this.sub_type_insurance = find_branch.sub_branches
    },
    changeEndoso() {
      this.$nextTick(() => {
        switch (this.task.type_endoso) {
          case 'A':
            this.priceRules = [v => (v && v >= 1) || 'La prima debe de ser Mayor que 1']
            delete this.task.price
            delete this.task.priceFormat
            break
          case 'B':
            this.priceRules = []
            break
          case 'D':
            this.priceRules = [v => (v && v <= 0) || 'La prima debe de ser Menor que 1']
            delete this.task.price
            delete this.task.priceFormat
            break
          default:
            this.priceRules = []
            break
        }
      })
    },
    changeType() {
      this.$nextTick(() => {
        delete this.task.price
        delete this.task.priceTotal
        delete this.task.actual_price
        delete this.task.renov_price
        delete this.task.priceFormat
        delete this.task.actualPriceFormat
        delete this.task.renovPriceFormat
        delete this.task.amountPaidFormat
        delete this.task.reservationFormat
        delete this.task.amount_paid
        delete this.task.reservation
        delete this.task.date_sinister
        delete this.task.date_paid

        this.task.sinister_number = null
        this.task.folio_procedure = null
        this.task.policy_number = null
        this.task.name_contractor = null
        this.$forceUpdate()
      })
    },
    async saveTask() {
      if (this.$refs.form.validate()) {
        this.dialogLoading = true
        this.task.user_id = getId()
        try {
          await saveTask(this.task)
          this.dialogLoading = false
          this.task = {}
          this.snackbarSaved = true
          this.$refs.form.reset()
          /* window.setInterval(() => {
            this.saved = false
          }, 5000) */
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
