<template>
  <ion-page>
    <ion-content :fullscreen="true" id="home">
      <div class="cells-container">
        <div class="icon-cells">
          <ion-card class="mini-report">
            <ion-card-header>
              <ion-card-subtitle>Current Balance</ion-card-subtitle>
              <ion-card-title>{{ toPeso(currentBalance) }}</ion-card-title>
            </ion-card-header>
            <ion-card-content>
              <div class="balance-group">
                <div class="balance-item" v-for="bankAccount in this.$store.state.bankAccounts" :key="bankAccount.id">
                  <div class="source">
                    <ion-text :color="bankAccount.color">{{ bankAccount.name }}</ion-text>
                  </div>
                  <div class="amount">{{ toPeso(accountBalance[bankAccount.id] || 0) }}</div>
                </div>
              </div>
            </ion-card-content>
          </ion-card>
          <div class="text-center cell-wrapper">
            <ion-card class="icon-cell reports" router-link="/reports">
              <ion-icon :icon="barChartOutline"/>
            </ion-card>
            <small>Reports</small>
          </div>
          <div class="text-center cell-wrapper">
            <ion-card class="icon-cell transactions" router-link="/transactions">
              <ion-icon :icon="newspaperOutline"/>
            </ion-card>
            <small>Transactions</small>
          </div>
          <div class="text-center cell-wrapper">
            <ion-card class="icon-cell debts" router-link="/debts">
              <ion-icon :icon="cashOutline"/>
            </ion-card>
            <small>Debts</small>
          </div>
          <div class="text-center cell-wrapper">
            <ion-card class="icon-cell budgets" router-link="/budgets">
              <ion-icon :icon="walletOutline"/>
            </ion-card>
            <small>Budgets</small>
          </div>
          <div class="text-center cell-wrapper">
            <ion-card class="icon-cell banks" router-link="/banks">
              <ion-icon :icon="folderOutline"/>
            </ion-card>
            <small>Accounts</small>
          </div>
          <div class="text-center cell-wrapper">
            <ion-card class="icon-cell categories" router-link="/categories">
              <ion-icon :icon="pricetagsOutline"/>
            </ion-card>
            <small>Categories</small>
          </div>
          <div class="text-center cell-wrapper" v-if="this.$store.state.currentUser.admin">
            <ion-card class="icon-cell users" router-link="/users">
              <ion-icon :icon="peopleOutline"/>
            </ion-card>
            <small>Users</small>
          </div>
        </div>
      </div>
    </ion-content>
  </ion-page>
</template>

<script >
import { IonText, IonIcon, IonPage, IonContent, IonCard, IonCardHeader, IonCardSubtitle, IonCardTitle, IonCardContent } from '@ionic/vue';
import { newspaperOutline, cardOutline, barChartOutline, folderOutline, cashOutline, briefcase, walletOutline, pricetagsOutline, peopleOutline } from 'ionicons/icons';
import { txnManager, pesoFormatter, api, apiHeaders } from '../helper'

export default  {
  name: 'home-item',
  components: {IonText, IonIcon, IonContent, IonPage, IonCard, IonCardHeader, IonCardSubtitle, IonCardTitle, IonCardContent },
  setup() {
    return {
      newspaperOutline,
      cardOutline,
      barChartOutline,
      cashOutline,
      briefcase,
      walletOutline,
      pricetagsOutline,
      peopleOutline,
      folderOutline
    }
  },
  data: function () {
    return {
      accountBalance: {},
      currentBalance: 0,
    }
  },
  created: function () {
    this.$store.dispatch('fetchCurrentUser')
    this.$store.dispatch('fetchTransactions', [])
    this.$store.dispatch('fetchBankAccounts', [])
    this.fetchBalances()
  },
  methods: {
    toPeso: function (num) {
      return pesoFormatter().format(num)
    },
    // accountBalance: function (bankAccount) {
    //   txnManager.setTxns(this.$store.state.transactions)
    //   txnManager.setBankAccountId(bankAccount.id)
    //   return txnManager.getAccountBalance()
    // },
    // currentBalance: function () {
    //   txnManager.setTxns(this.$store.state.transactions)
    //   txnManager.setBankAccountId(null)
    //   return txnManager.getAccountBalance()
    // },
    fetchBalances: function () {
      const self = this
      self.$store.commit('hideLoader', 'fetchBalances')
      fetch(api(`/v1/transactions/balances`), {
        method: 'GET',
        headers: apiHeaders('TRANSACTIONS')
      })
      .then(resp => resp.json())
      .then(function(data) {
        self.currentBalance = data.current
        self.accountBalance = data.banks
      })
      .finally(function () {
        self.$store.commit('hideLoader', 'fetchBalances')
      })
    }
  },
  watch: {
    $route(to, from) {
      if (to.path == '/home') this.fetchBalances()
    }
  }
}
</script>

<style>
#home::part(background) {
  background-image: linear-gradient( 135deg, #72EDF2 10%, #5151E5 100%);
}
.cell-wrapper small{
  color: #fefefe;
}
</style>