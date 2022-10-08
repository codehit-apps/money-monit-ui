<template>
  <ion-page>
    <ion-header>
      <ion-toolbar color="danger">
         <ion-buttons slot="start">
          <ion-back-button defaultHref="/debts"></ion-back-button>
        </ion-buttons>
        <ion-title class="align-center">Debt Info</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content :fullscreen="true">
      <ion-item>
        <ion-label position="floating"> Debtor </ion-label>
        <ion-select placeholder="Select" v-model="debtor_id" interface="action-sheet">
          <ion-select-option v-for="user in this.$store.state.users" :key="user.id"  :value="user.id">{{ this.userName(user) }}</ion-select-option>
        </ion-select>
      </ion-item>
      <div v-if="!!errors['debtor_id']" class="ion-margin-bottom ion-margin-start">
        <ion-text color="danger" v-for="error in errors['debtor_id']" :key="error">{{ error }}</ion-text>
      </div>

      <ion-item>
        <ion-label position="floating"> Creditor </ion-label>
        <ion-select placeholder="Select" v-model="creditor_id" interface="action-sheet">
          <ion-select-option v-for="user in this.$store.state.users" :key="user.id"  :value="user.id">{{ this.userName(user) }}</ion-select-option>
        </ion-select>
      </ion-item>
      <div v-if="!!errors['creditor_id']" class="ion-margin-bottom ion-margin-start">
        <ion-text color="danger" v-for="error in errors['creditor_id']" :key="error">{{ error }}</ion-text>
      </div>

      <ion-item>
        <ion-label position="floating"> Amount </ion-label>
        <ion-input type="number" v-model="amount" step="0.01" min="0.01">
        </ion-input>
      </ion-item>
      <div v-if="!!errors['amount']" class="ion-margin-bottom ion-margin-start">
        <ion-text color="danger" v-for="error in errors['amount']" :key="error">{{ error }}</ion-text>
      </div>

      <ion-item>
        <ion-label position="floating"> Date </ion-label>
        <ion-datetime placeholder="Select" v-model="debited_at"/>
      </ion-item>
      <div v-if="!!errors['debited_at']" class="ion-margin-bottom ion-margin-start">
        <ion-text color="danger" v-for="error in errors['debited_at']" :key="error">{{ error }}</ion-text>
      </div>

      <ion-item>
        <ion-label position="floating"> Notes </ion-label>
        <ion-input v-model="notes">
        </ion-input>
      </ion-item>
      <div v-if="!!errors['notes']" class="ion-margin-bottom ion-margin-start">
        <ion-text color="danger" v-for="error in errors['notes']" :key="error">{{ error }}</ion-text>
      </div>

      <!-- <ion-item v-if="debtPersisted" lines="none">
      </ion-item> -->
      <div class="record-lines ion-margin-start ion-margin-end ion-margin-top" v-if="debtPersisted">
        <div class="record-line">
          <h4 class="ion-no-margin"><b> Payments</b></h4>
          <h4 class="ion-no-margin">{{toPeso(recievablesTotal)}}</h4>
        </div>
      </div>
      <ion-list>
        <ion-item-sliding v-for="line in sortedPayments" :key="line.id">
          <ion-item lines="none" :router-link="`/debt_payments/${this.$store.state.debt.id}/${line.id}/edit`">
            <ion-card class="w-full" :color="line.approved_at == null ? 'danger' : 'success'">
              <ion-card-content>
                <div class="record-lines">
                  <div class="record-line">
                    <div class="label">
                      Amount
                    </div>
                    <div class="value">
                      {{ toPeso(line.amount) }}
                    </div>
                  </div>
                  <div class="record-line">
                    <div class="label">
                      Paid At
                    </div>
                    <div class="value">
                      {{ formatDate(line.paid_at) }}
                    </div>
                  </div>
                  <div class="record-line" v-if="formatDate(line.approved_at)">
                    <div class="label">
                      Approved At
                    </div>
                    <div class="value">
                      {{ formatDate(line.approved_at) }}
                    </div>
                  </div>
                  <div class="record-line">
                    <div class="label">
                      Notes
                    </div>
                    <div class="value">
                      {{ line.notes }}
                    </div>
                  </div>
                </div>
              </ion-card-content>
            </ion-card>
          </ion-item>
          <ion-item-options side="end">
            <ion-item-option color="danger" @click="deletePaymentLine(line)">Delete</ion-item-option>
          </ion-item-options>
        </ion-item-sliding>
      </ion-list>

      <ion-item v-if="debtPersisted">
        <ion-label class="ion-text-right">
          <ion-button color="secondary" @click="this.$router.push({path: `/debt_payments/${this.$store.state.debt.id}/new`})">
            <ion-icon :icon="addCircleOutline"/>
            &nbsp; Line
          </ion-button>
        </ion-label>
      </ion-item>

      <div class="action-end ion-padding">
        <ion-button type="submit" @click="saveDebt" color="primary">Save</ion-button>
      </div> 
    </ion-content>
  </ion-page>
</template>

<script >
import { alertController, toastController, IonItemOption, IonItemOptions, IonItemSliding, IonList, IonIcon, IonCard, IonCardContent, IonDatetime, IonText, IonSelect, IonSelectOption, IonInput, IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonButtons, IonBackButton, IonButton, IonItem, IonLabel } from '@ionic/vue';
import { addCircle, addCircleOutline } from 'ionicons/icons';
import { pesoFormatter, dateFormatter } from '../../helper'
import { sortBy, each } from 'underscore';

export default  {
  name: 'BankForm',
  components: { IonItemOption, IonItemOptions, IonItemSliding, IonList, IonIcon, IonCard, IonCardContent, IonDatetime, IonText, IonSelect, IonSelectOption, IonInput, IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonButtons, IonBackButton, IonButton, IonItem, IonLabel },
  setup() {
    return {
      addCircle,
      addCircleOutline,
    }
  },
  created: function () {
    this.initForm()
  },
  data: function () {
    return {
      errors: {}
    }
  },
  computed: {
    recievablesTotal: {
      get () {
        let amount = 0
        const line = this.$store.state.debt
        if (line == null) return amount
        each(line.debt_payments, function (item) {
          if (item.approved_at != null) amount += item.amount
        })
        return amount
      }
    },
    sortedPayments: function () {
      const self = this
      return sortBy(self.$store.state.debt.debt_payments, function (line) { return line.paid_at })
    },
    debtPersisted: function () {
      return this.$route.params.id != null
    },
    notes: {
      get () {
        return this.$store.state.debt.notes
      },
      set (value) {
        this.$store.commit('setDebtNotes', value)
      }
    },
    debited_at: {
      get () {
        return this.$store.state.debt.debited_at
      },
      set (value) {
        this.$store.commit('setDebtDebitedAt', value)
      }
    },
    debtor_id: {
      get () {
        return this.$store.state.debt.debtor_id
      },
      set (value) {
        this.$store.commit('setDebtDebtorId', value)
      }
    },
    creditor_id: {
      get () {
        return this.$store.state.debt.creditor_id
      },
      set (value) {
        this.$store.commit('setDebtCreditorId', value)
      }
    },
    amount: {
      get () {
        return this.$store.state.debt.amount
      },
      set (value) {
        this.$store.commit('setDebtAmount', value)
      }
    },
  },
  methods: {
    toPeso: function (num) {
      return pesoFormatter().format(num)
    },
    formatDate: function (date) {
      if (date == null) return
      return dateFormatter().format(new Date(date))
    },
    async showAlert(message, color) {
      const alert = await toastController
        .create({
          message: message,
          color: color,
          duration: 5000,
        })
      return alert.present()
    },
    saveDebt: function () {
      if (this.$route.params.id != null) {
        this.updateDebt()
      } else {
        this.createDebt()
      }
    },
    userName: function (user) {
      return user.first_name + ' ' + user.last_name
    },
    updateDebt: function () {
      const self = this
      const success = function (resp) {
        if (resp.errors && Object.keys(resp.errors).length) {
          self.showAlert("Debt could not be updated. Please fix errors on the form.", "danger")
          self.errors = resp.errors
          console.log(resp.errors)
        } else {
          self.$router.push({path: '/debts'})
        }
      }
      const error = function (err) {
        console.log(err)
      }
      this.$store.dispatch('updateDebt', [success, error])
    },
    createDebt: function () {
      const self = this
      const success = function (resp) {
        if (resp.errors && Object.keys(resp.errors).length) {
          self.showAlert("Debt could not be created. Please fix errors on the form.", "danger")
          self.errors = resp.errors
          console.log(resp.errors)
        } else {
          self.$store.dispatch('fetchDebts', [])
          self.$router.push({path: '/debts'})
        }
      }
      const error = function (err) {
        console.log(err)
      }
      this.$store.dispatch('createDebt', [success, error])
    },
    deletePaymentLine: async function (line) {
      const self = this
      const alert = await alertController
        .create({
          header: 'Are you sure?',
          message: 'Please click Confirm to delete this item.',
          buttons: [
            {
              text: 'Cancel',
              role: 'cancel',
            },
            {
              text: 'Confirm',
              handler: () => {
                const success = function () {
                  self.$store.dispatch('reloadDebt', self.$route.params.id)
                }
                const error = function (err) {
                  console.log(err)
                }
                self.$store.dispatch('deletePaymentLine', [line.debt_id, line.id, success, error])
              }
            }
          ]
        })
      return alert.present()
    },
    initForm: function () {
      this.$store.dispatch('fetchUsers', [])
      this.$store.dispatch('fetchDebt', this.$route.params.id)
    }
  },
  watch: {
    $route(to, from) {
      if (to.name == 'EditDebt' || to.name == 'NewDebt') this.initForm()
    }
  }
}
</script>
