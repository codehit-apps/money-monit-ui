<template>
  <ion-page>
    <ion-header>
      <ion-toolbar color="danger">
         <ion-buttons slot="start">
          <ion-back-button defaultHref="/home"></ion-back-button>
        </ion-buttons>
        <ion-title class="align-center">Debts</ion-title>
        <ion-buttons slot="end">
          <ion-button router-link="/debts/new">
            <ion-icon slot="icon-only" :icon="addCircle"/>
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>
    <ion-content :fullscreen="true">
      <ion-refresher slot="fixed" @ionRefresh="doRefresh($event)">
        <ion-refresher-content></ion-refresher-content>
      </ion-refresher>
      <ion-list v-if="recievables.length">
        <ion-list-header lines="inset">
          <div class="record-lines w-full ion-padding-end">
            <div class="record-line">
              <h6>Recievables</h6>
              <h6>{{toPeso(recievablesTotal)}}</h6>
            </div>
          </div>
        </ion-list-header>
        <ion-item-sliding v-for="debt in recievables" :key="debt.id">
          <ion-item lines="none" :router-link="`/debts/${debt.id}/edit`">
            <DebtCard :debt="debt" mode="recievable"/>
          </ion-item>
          <ion-item-options side="end">
            <ion-item-option color="danger" @click="deleteDebt(debt.id)">Delete</ion-item-option>
          </ion-item-options>
        </ion-item-sliding>
      </ion-list>
      <ion-list v-if="payables.length">
        <ion-list-header lines="inset" class="ion-margin-top">
          <div class="record-lines w-full ion-padding-end">
            <div class="record-line">
              <h6>Payables</h6>
              <h6>{{toPeso(payablesTotal)}}</h6>
            </div>
          </div>
        </ion-list-header>
        <ion-item-sliding v-for="debt in payables" :key="debt.id">
          <ion-item lines="none" :router-link="`/debts/${debt.id}/edit`">
            <DebtCard :debt="debt" mode="payable"/>
          </ion-item>
          <ion-item-options side="end">
            <ion-item-option color="danger" @click="deleteDebt(debt.id)">Delete</ion-item-option>
          </ion-item-options>
        </ion-item-sliding>
      </ion-list>

      <ion-list v-if="paid.length">
        <ion-list-header lines="inset" class="ion-margin-top">
          <div class="record-lines w-full ion-padding-end">
            <div class="record-line">
              <h6>Paid</h6>
              <span></span>
            </div>
          </div>
        </ion-list-header>
        <ion-item-sliding v-for="debt in paid" :key="debt.id">
          <ion-item lines="none" :router-link="`/debts/${debt.id}/edit`">
            <DebtCard :debt="debt" mode="payable"/>
          </ion-item>
          <ion-item-options side="end">
            <ion-item-option color="danger" @click="deleteDebt(debt.id)">Delete</ion-item-option>
          </ion-item-options>
        </ion-item-sliding>
      </ion-list>

    </ion-content>
  </ion-page>
</template>

<script >
import { alertController, IonListHeader, IonRefresher, IonRefresherContent, IonItemOption, IonPage, IonItemSliding, IonItemOptions, IonHeader, IonToolbar, IonTitle, IonContent, IonButtons, IonBackButton, IonButton, IonIcon, IonList, IonItem } from '@ionic/vue';
import { addCircle } from 'ionicons/icons';
import DebtCard from '@/components/DebtCard'
import { where, each } from 'underscore';
import { pesoFormatter } from '../../helper'

export default  {
  name: 'debts-item',
  components: { DebtCard, IonListHeader, IonRefresher, IonRefresherContent, IonItemOption, IonPage, IonItemSliding, IonItemOptions, IonHeader, IonToolbar, IonTitle, IonContent, IonButtons, IonBackButton, IonButton, IonIcon, IonList, IonItem },
  setup() {
    return {
      addCircle,
    }
  },
  created: function () {
    this.$store.dispatch('fetchCurrentUser')
    this.$store.dispatch('fetchDebts', [])
  },
  computed: {
    paid: {
      get () {
        return where(this.$store.state.debts, {paid: true})
      }
    },
    payables: {
      get () {
        return where(this.$store.state.debts, {paid: false, debtor_id: this.$store.state.currentUser.id})
      }
    },
    recievables: {
      get () {
        return where(this.$store.state.debts, {paid: false, creditor_id: this.$store.state.currentUser.id})
      }
    },
    recievablesTotal: {
      get () {
        let amount = 0
        each(this.recievables, function (item) {
          amount += item.amount - item.paid_amount
        })
        return amount
      }
    },
    payablesTotal: {
      get () {
        let amount = 0
        each(this.payables, function (item) {
          amount += item.amount - item.paid_amount
        })
        return amount
      }
    }
  },
  methods: {
    toPeso: function (num) {
      return pesoFormatter().format(num)
    },
    doRefresh: function (event) {
      const self = this
      const onSuccess = function () {
        event.target.complete()
      }
      self.$store.dispatch('fetchDebts', [onSuccess, {'_recache': 0}])
    },
    deleteDebt: async function (debtId) {
      const self = this
      const alert = await alertController
        .create({
          header: 'Are you sure?',
          message: 'Please click Confirm to delete this debt.',
          buttons: [
            {
              text: 'Cancel',
              role: 'cancel',
            },
            {
              text: 'Confirm',
              handler: () => {
                const success = function () {
                  self.$store.dispatch('fetchDebts', [])
                }
                const error = function (err) {
                  console.log(err)
                }
                self.$store.dispatch('deleteDebt', [debtId, success, error])
              }
            }
          ]
        })
      return alert.present()
    },
  }
}
</script>