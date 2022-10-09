
<template>
  <ion-page>
    <ion-header>
      <ion-toolbar color="danger">
         <ion-buttons slot="start">
          <ion-back-button defaultHref="/debts"></ion-back-button>
        </ion-buttons>
        <ion-title class="align-center">Payment item info</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content :fullscreen="true">

      <ion-item>
        <ion-label position="floating"> Amount </ion-label>
        <ion-input type="number" v-model="amount" step="0.01" min="0.01">
        </ion-input>
      </ion-item>
      <div v-if="!!errors['amount']" class="ion-margin-bottom ion-margin-start">
        <ion-text color="danger" v-for="error in errors['amount']" :key="error">{{ error }}</ion-text>
      </div>

      <ion-item>
        <ion-label position="floating"> Paid At </ion-label>
        <ion-datetime placeholder="Select" v-model="paid_at"/>
      </ion-item>
      <div v-if="!!errors['paid_at']" class="ion-margin-bottom ion-margin-start">
        <ion-text color="danger" v-for="error in errors['paid_at']" :key="error">{{ error }}</ion-text>
      </div>

      <ion-item>
        <ion-label position="floating"> Notes </ion-label>
        <ion-input v-model="notes" step="0.01" min="0.01">
        </ion-input>
      </ion-item>
      <div v-if="!!errors['notes']" class="ion-margin-bottom ion-margin-start">
        <ion-text color="danger" v-for="error in errors['notes']" :key="error">{{ error }}</ion-text>
      </div>

      <div class="action-end ion-padding">
        <ion-button type="button" @click="acceptPayment" class="ion-margin-end" color="tertiary" v-if="creditor && this.$route.params.id != null">Accept</ion-button>
        <ion-button type="submit" @click="savePaymentLine" color="primary">Save</ion-button>
      </div> 
    </ion-content>
  </ion-page>
</template>

<script >
import { alertController, toastController, IonDatetime, IonText, IonInput, IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonButtons, IonBackButton, IonButton, IonItem, IonLabel } from '@ionic/vue';
import { addCircle, addCircleOutline } from 'ionicons/icons';
import { findWhere } from 'underscore';
import { pesoFormatter } from '../../helper'

export default  {
  name: 'Budgets',
  components: { IonDatetime, IonText, IonInput, IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonButtons, IonBackButton, IonButton, IonItem, IonLabel },
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
    creditor: {
      get () {
        return this.$store.state.currentUser.id == this.$store.state.debt.creditor_id
      }
    },
    paid_at: {
      get () {
        return this.$store.state.debt_payment.paid_at
      },
      set (value) {
        this.$store.commit('setPaymentLinePaidAt', value)
      }
    },
    notes: {
      get () {
        return this.$store.state.debt_payment.notes
      },
      set (value) {
        this.$store.commit('setPaymentLineNotes', value)
      }
    },
    amount: {
      get () {
        return this.$store.state.debt_payment.amount
      },
      set (value) {
        this.$store.commit('setPaymentLineAmount', value)
      }
    },
  },
  methods: {
    toPeso: function (num) {
      return pesoFormatter().format(num)
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
    async acceptPayment() {
      const self = this
      const alert = await alertController
        .create({
          header: 'Are you sure?',
          message: 'Please click Confirm to Accept this payment.',
          buttons: [
            {
              text: 'Cancel',
              role: 'cancel',
            },
            {
              text: 'Confirm',
              handler: () => {
                const line = self.$store.state.debt_payment
                const success = function () {
                  self.$store.dispatch('reloadDebt', line.debt_id)
                  self.$router.push({path: `/debts/${line.debt_id}/edit`})
                }
                const error = function (err) {
                  console.log(err)
                }
                self.$store.dispatch('acceptPayment', [line.debt_id, line.id, success, error])
              }
            }
          ]
        })
      return alert.present()
    },
    savePaymentLine: function () {
      const self = this
      const success = function (resp) {
        if (resp.errors && Object.keys(resp.errors).length) {
          self.showAlert("Payment line could not be updated. Please fix errors on the form.", "danger")
          self.errors = resp.errors
          console.log(resp.errors)
        } else {
          self.errors = {}
          self.$store.dispatch('resetPaymentLine')
          self.$router.push({path: `/debts/${self.$route.params.debt_id}/edit`})
        }
      }
      const error = function (err) {
        console.log(err)
      }
      this.$store.dispatch('savePaymentLine', [success, error])
    },
    initForm: function () {
      const debtId = this.$route.params.debt_id
      if (debtId == null) return false
      this.$store.dispatch('fetchCurrentUser')
      this.$store.dispatch('fetchDebt', debtId)
      this.$store.dispatch('fetchPaymentLine', [debtId, this.$route.params.id])
    },
  },
  watch: {
    $route(to, from) {
      if (to.name == 'NewPaymentLine' || to.name == 'EditPaymentLine') this.initForm()
    }
  }
}
</script>