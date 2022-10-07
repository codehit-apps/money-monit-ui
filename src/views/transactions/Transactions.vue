<template>
  <ion-page>
    <ion-header>
      <ion-toolbar color="medium">
         <ion-buttons slot="start">
          <ion-back-button defaultHref="/home"></ion-back-button>
        </ion-buttons>
        <ion-title class="align-center">Transactions</ion-title>
        <ion-buttons slot="end">
          <ion-button router-link="/transactions/new">
            <ion-icon slot="icon-only" :icon="addCircle"/>
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>
    <ion-content class="ion-padding">
      <ion-refresher slot="fixed" @ionRefresh="doRefresh($event)">
        <ion-refresher-content></ion-refresher-content>
      </ion-refresher>
      <div class="txn-group" v-for="(value, key) in groupedTxns()" :key="key">
        <div class="txn-data">
          <div class="fw-500">{{formatDate(key)}}</div>
          <div class="fw-500">-{{toPeso(txnsTotalExpenses(value))}}</div>
        </div>
        <ion-list>
          <ion-item-sliding v-for="txn in value" :key="txn.id">
            <ion-item :router-link="`/transactions/${txn.id}/edit`" lines="none">
              <div class="txn-line">
                <div class="txn-data">
                  <div>
                    {{ txnDescription(txn) || txnType(txn) }}
                    <small class="d-block">{{ txnCategoryName(txn) }}</small>
                  </div>
                    <div class="ion-text-right d-flex-center" v-if="txn.type == 'Transfer'">
                      <div class="">
                        <ion-text class="d-block">-{{toPeso(parseFloat(txn.amount) + parseFloat(txn.fee))}}</ion-text>
                        <ion-chip class="m-0 ion-color" :color="txnBank(txn).color" outline="">{{ txnBank(txn).name }}</ion-chip>
                      </div>
                      <div class="d-flex-center flex-column content-end mx-1">
                        <ion-text class="mb-12" color="danger">-{{ toPeso(parseFloat(txn.fee)) }}</ion-text>
                        <ion-icon slot="icon-only" :icon="arrowForwardOutline"/>
                      </div>
                      <div class="">
                        <ion-text class="d-block">+{{toPeso(txn.amount)}}</ion-text>
                        <ion-chip class="m-0 ion-color" :color="txnToBank(txn).color" outline="">{{ txnToBank(txn).name }}</ion-chip>
                      </div>
                  </div>
                  <div v-else class="ion-text-right">
                    <ion-text class="mb-5">{{txn.amount_pref}}{{toPeso(txn.amount)}}</ion-text>
                    <div class="d-flex-center content-end">
                      <ion-chip class="m-0 ion-color" :color="txnBank(txn).color" outline="">{{ txnBank(txn).name }}</ion-chip>
                    </div>
                  </div>
                </div>
              </div>
            </ion-item>
            <ion-item-options side="end">
              <ion-item-option color="danger" @click="deleteTransaction(txn.id)">Delete</ion-item-option>
            </ion-item-options>
          </ion-item-sliding>
        </ion-list>
      </div>
      <ion-infinite-scroll threshold="100px" id="txns-infinite-scroll" v-on:ionInfinite="loadTransactions">
        <ion-infinite-scroll-content loading-spinner="crescent">
        </ion-infinite-scroll-content>
      </ion-infinite-scroll>
    </ion-content>
  </ion-page>
</template>

<script >
import { alertController, IonRefresher, IonRefresherContent, IonInfiniteScroll, IonInfiniteScrollContent, IonChip, IonList, IonItem, IonText, IonPage, IonItemSliding, IonItemOptions, IonItemOption, IonHeader, IonToolbar, IonTitle, IonContent, IonButtons, IonBackButton, IonButton, IonIcon } from '@ionic/vue';
import { addCircle, arrowForwardOutline } from 'ionicons/icons';
import { findWhere, isUndefined, isNull, groupBy, pluck } from 'underscore';
import { txnManager, pesoFormatter, dateFormatter } from '../../helper'

export default  {
  name: 'Banks',
  components: { IonRefresher, IonRefresherContent, IonInfiniteScroll, IonInfiniteScrollContent, IonChip, IonList, IonItem, IonText, IonPage, IonItemSliding, IonItemOptions, IonItemOption, IonHeader, IonToolbar, IonTitle, IonContent, IonButtons, IonBackButton, IonButton, IonIcon },
  setup() {
    return {
      addCircle,
      arrowForwardOutline
    }
  },
  data: function () {
    return {
    }
  },
  created: function () {
    this.$store.commit('setTransactionsNextPage', 1)
    this.$store.dispatch('fetchTransactions', [this.$route.query])
    this.$store.dispatch('fetchBankAccounts', [])
    this.$store.dispatch('fetchCategories', [])
    this.$store.dispatch('fetchTransactionTypes')
  },
  methods: {
    doRefresh: function (event) {
      const self = this
      self.$store.commit('setTransactionsNextPage', 1)
      const onSuccess = function () {
        event.target.complete()
      }
      self.$store.dispatch('fetchTransactions', [{'_recache': 0}, onSuccess])
    },
    loadTransactions: function () {
      const onSuccess = function () {
        const infiniteScroll = document.getElementById('txns-infinite-scroll')
        infiniteScroll.complete()
      }
      const appendResult = true
      this.$store.dispatch('fetchTransactions', [this.$route.query, onSuccess, appendResult])
    },
    deleteTransaction: async function (transactionId) {
      const self = this
      const alert = await alertController
        .create({
          header: 'Are you sure?',
          message: 'Please click Confirm to delete this transaction.',
          buttons: [
            {
              text: 'Cancel',
              role: 'cancel',
            },
            {
              text: 'Confirm',
              handler: () => {
                const success = function () {
                  self.$store.dispatch('fetchTransactions', [])
                }
                const error = function (err) {
                  console.log(err)
                }
                self.$store.dispatch('deleteTransaction', [transactionId, success, error])
              }
            }
          ]
        })
      return alert.present()
    },
    txnCategory: function (txn) {
      return findWhere(this.$store.state.categories, {id: txn.category_id}) || {}
    },
    isTxnDescriptionMissing: function (txn) {
      return isNull(txn.description) || isUndefined(txn.description) || txn.description.trim() == ""
    },
    txnDescription: function (txn) {
      if (this.isTxnDescriptionMissing(txn)) return this.txnCategory(txn).name
      return txn.description
    },
    txnCategoryName: function (txn) {
      if (this.isTxnDescriptionMissing(txn)) return this.txnCategory(txn).description
      return this.txnCategory(txn).name
    },
    txnType: function (txn) {
      return this.$store.state.transactionTypes[txn.type] || ''
    },
    txnBank: function (txn) {
      return findWhere(this.$store.state.bankAccounts, {id: txn.account_id}) || {}
    },
    txnToBank: function (txn) {
      return findWhere(this.$store.state.bankAccounts, {id: txn.to_account_id}) || {}
    },
    groupedTxns: function () {
      return groupBy(this.$store.state.transactions, (item) => { return this.formatDate(item.datetime) })
    },
    txnsTotalExpenses: function (txns) {
      txnManager.setTxns(txns)
      txnManager.setBankAccountId(null)
      return txnManager.getTotalExpenses()
    },
    toPeso: function (num) {
      return pesoFormatter().format(num)
    },
    formatDate: function (date) {
      return dateFormatter().format(new Date(date))
    },
  },
}
</script>

<style>
.d-block {
  display:block
}

.m-0 {
  margin:0
}

.mb-5 {
  margin-bottom:5px
}

ion-chip {
  height:24px
}

ion-chip > ion-chip {
  margin-left:0px
}

.txn-line {
  background: #fff;
  width: 100%;
}

.txn-line > .txn-data {
  padding: 15px 0;
  border-bottom: 1px dashed #e6e6e6;
  display: flex;
  justify-content:space-between
}

ion-list ion-item-sliding:last-child .txn-line > .txn-data {
  border-bottom: none;
}

.txn-group {
  margin-left: -15px;
  margin-right:-15px
}

.txn-group > .txn-data {
  background: #f4f6f8;
  padding-top: 30px;
  padding-right: 15px;
  padding-left: 15px;
  padding-bottom: 10px;
  display: flex;
  justify-content:space-between
}

.fw-500 {
  font-weight:500
}

.content-budget-lines .content-budget-line {
  display: flex;
  justify-content:space-between
}

.bank-line-balance {
  display: flex;
  justify-content: space-between;
  margin-bottom: 5px
}

.mb-12 {
  margin-bottom: 12px;
}

</style>