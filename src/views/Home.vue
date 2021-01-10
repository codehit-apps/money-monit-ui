<template>
  <ion-page>
    <ion-content :fullscreen="true">
      <div class="cells-container">
        <div class="icon-cells">
          <ion-card class="mini-report">
            <ion-card-header>
              <ion-card-subtitle>Current Balance</ion-card-subtitle>
              <ion-card-title>{{ toPeso(currentBalance()) }}</ion-card-title>
            </ion-card-header>
            <ion-card-content>
              <div class="balance-group">
                <div class="balance-item" v-for="bankAccount in this.$store.state.bankAccounts" :key="bankAccount.id">
                  <div class="source">
                    <ion-text :color="bankAccount.color">{{ bankAccount.name }}</ion-text>
                  </div>
                  <div class="amount">{{ toPeso(accountBalance(bankAccount)) }}</div>
                </div>
              </div>
            </ion-card-content>
          </ion-card>
          <div class="text-center">
            <ion-card class="icon-cell reports" router-link="/reports">
              <ion-icon :icon="barChart"/>
            </ion-card>
            <small>Reports</small>
          </div>
          <div class="text-center">
            <ion-card class="icon-cell transactions" router-link="/transactions">
              <ion-icon :icon="cash"/>
            </ion-card>
            <small>Transactions</small>
          </div>
          <div class="text-center">
            <ion-card class="icon-cell banks" router-link="/banks">
              <ion-icon :icon="briefcaseOutline"/>
            </ion-card>
            <small>Banks</small>
          </div>
          <div class="text-center">
            <ion-card class="icon-cell budgets" router-link="/budgets">
              <ion-icon :icon="wallet"/>
            </ion-card>
            <small>Budgets</small>
          </div>
          <div class="text-center">
            <ion-card class="icon-cell categories" router-link="/categories">
              <ion-icon :icon="albumsOutline"/>
            </ion-card>
            <small>Categories</small>
          </div>
          <div class="text-center">
            <ion-card class="icon-cell users" router-link="/users" v-if="this.$store.state.currentUser.admin">
              <ion-icon :icon="peopleCircleOutline"/>
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
import { barChart, briefcaseOutline, cash, briefcase, wallet, albumsOutline, peopleCircleOutline } from 'ionicons/icons';
import { txnManager, pesoFormatter } from '../helper'

export default  {
  name: 'Home',
  components: {IonText, IonIcon, IonContent, IonPage, IonCard, IonCardHeader, IonCardSubtitle, IonCardTitle, IonCardContent },
  setup() {
    return {
      barChart,
      cash,
      briefcase,
      wallet,
      albumsOutline,
      peopleCircleOutline,
      briefcaseOutline
    }
  },
  created: function () {
    this.$store.dispatch('fetchCurrentUser')
    this.$store.dispatch('fetchTransactions', [])
    this.$store.dispatch('fetchBankAccounts')
  },
  methods: {
    toPeso: function (num) {
      return pesoFormatter().format(num)
    },
    accountBalance: function (bankAccount) {
      txnManager.setTxns(this.$store.state.transactions)
      txnManager.setBankAccountId(bankAccount.id)
      return txnManager.getAccountBalance()
    },
    currentBalance: function () {
      txnManager.setTxns(this.$store.state.transactions)
      txnManager.setBankAccountId(null)
      return txnManager.getAccountBalance()
    }
  }
}
</script>
