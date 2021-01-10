<template>
  <ion-page>
    <ion-header>
      <ion-toolbar color="tertiary">
         <ion-buttons slot="start">
          <ion-back-button defaultHref="/home"></ion-back-button>
        </ion-buttons>
        <ion-title class="align-center">Reports</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content :fullscreen="true">
      <ion-card class="ion-margin-bottom">
        <ion-card-header>
          <ion-card-subtitle>Total Transactions</ion-card-subtitle>
          <ion-card-title>{{toPeso(totalTransactions)}}</ion-card-title>
        </ion-card-header>
        <ion-card-content>
          <div v-if="!showFilter">
            <a href="javascript:void(0);" class="view-filters-link" @click="this.showFilter=true">view filters</a>
          </div>
          <div v-if="showFilter">
            <ion-item>
              <ion-label position="floating"> Type </ion-label>
              <ion-select placeholder="Select" v-model="filter.type" multiple>
                <ion-select-option value="">All</ion-select-option>
                <ion-select-option v-for="(key, val) in this.$store.state.transactionTypes" :key="key"  :value="val">{{ key }}</ion-select-option>
              </ion-select>
            </ion-item>

            <ion-item>
              <ion-label position="floating"> Category </ion-label>
              <ion-select placeholder="Select" v-model="filter.category_id" multiple>
                <ion-select-option value="">All</ion-select-option>
                <ion-select-option v-for="category in this.$store.state.categories" :key="category.id" :value="category.id">{{ category.name }}</ion-select-option>
              </ion-select>
            </ion-item>

            <ion-item>
              <ion-label position="floating"> Bank Account </ion-label>
              <ion-select placeholder="Select" v-model="filter.bank_account_id" multiple>
                <ion-select-option value="">All</ion-select-option>
                <ion-select-option v-for="bankAccount in this.$store.state.bankAccounts" :key="bankAccount.id" :value="bankAccount.id" :class="bankAccount.color">{{ bankAccount.name }}</ion-select-option>
              </ion-select>
            </ion-item>

            <ion-item>
              <ion-label position="floating"> From </ion-label>
              <ion-datetime placeholder="Select" v-model="filter.from_date"/>
            </ion-item>

            <ion-item>
              <ion-label position="floating"> To </ion-label>
              <ion-datetime placeholder="Select" v-model="filter.to_date"/>
            </ion-item>

            <div class="ion-padding-top content-between d-flex-center">
              <a :href="`/#/transactions?q[category_id_in]=${filter.category_id}&q[datetime_gteq]=${filter.from_date}&q[datetime_lteq]=${filter.to_date}&q[type_in]=${filter.type}&q[bank_account_id_in]=${filter.bank_account_id}`" class="view-txns-link" target="_blank">view transactions</a>
              <div class="d-flex-center">
                <a href="javascript:void(0);" class="view-filters-link ion-margin-end" @click="this.showFilter=false">close</a>
                <ion-button type="submit" class="ion-no-margin" @click="filterTransactions" color="primary">Filter</ion-button>
              </div>
            </div>
          </div>
        </ion-card-content>
      </ion-card>
      <div v-for="budget in this.$store.state.budgets" :key="budget.id">
        <ion-card v-if="budget.active">
          <ion-card-header>
            <ion-card-subtitle>
              {{ formatDate(budget.from_date) }} - {{ formatDate(budget.to_date) }}
            </ion-card-subtitle>
            <ion-card-title>
              {{ budget.name }}
            </ion-card-title>
          </ion-card-header>
          <ion-card-content>
            <div class="ion-margin-bottom" v-for="line in budget.budget_lines" :key="line.id">
              <b> {{ budgetCategoryName(line.category_id) }} </b>
              <div class="content-budget-lines">
                <div class="content-budget-line">
                  <small>Budget</small>
                  {{ toPeso(line.amount) }}
                </div>
                <div class="content-budget-line">
                  <small> Total Expenses </small>
                  <ion-text :color="this.expenses[line.id] > line.amount ? 'danger' : ''">
                    {{ toPeso(this.expenses[line.id] || 0) }}
                  </ion-text>
                </div>
                <span v-if="this.expenses[line.id] > line.amount">
                  <div class="content-budget-line">
                    <small>Over Budget</small>
                    <ion-text color='danger'> ({{toPeso((line.amount - (this.expenses[line.id] || 0)) * -1)}}) </ion-text>
                  </div>
                </span>
                <span v-else>
                  <div class="content-budget-line">
                    <small>Consumable</small>
                    {{ toPeso(line.amount - (this.expenses[line.id] || 0)) }}
                  </div>
                </span>
              </div>
            </div>
            <div class="text-right">
              <a :href="`/#/transactions?q[datetime_gteq]=${budget.from_date}&q[datetime_lteq]=${budget.to_date}&q[type_in]=Withdraw&q[category_id_in]=${_pluck(budget.budget_lines, 'category_id').join(',')}`" class="view-txns-link" target="_blank">view transactions</a>
            </div>
          </ion-card-content>
        </ion-card>
      </div>
    </ion-content>
  </ion-page>
</template>

<script >
import { IonPage, IonButton, IonDatetime, IonItem, IonSelect, IonLabel, IonSelectOption, IonCard, IonCardHeader, IonCardContent, IonText, IonCardTitle, IonCardSubtitle, IonHeader, IonButtons, IonBackButton, IonToolbar, IonTitle, IonContent } from '@ionic/vue';
import { pesoFormatter, dateFormatter, api, env, apiHeaders } from '../helper'
import { findWhere, each, pluck } from 'underscore';

export default  {
  name: 'Reports',
  components: {IonButton, IonDatetime, IonItem, IonSelect, IonLabel, IonSelectOption, IonCard, IonCardHeader, IonCardContent, IonText, IonCardTitle, IonCardSubtitle, IonHeader, IonButtons, IonBackButton, IonToolbar, IonTitle, IonContent, IonPage },
  data: function () {
    return {
      expenses: {},
      overBudgets: {},
      totalTransactions: 0,
      showFilter: false,
      filter: {
        type: 'Withdraw',
        bank_account_id: '',
        from_date: new Date(),
        to_date: new Date(),
        category_id: '',
      },
    }
  },
  created: function () {
    const self = this
    self.$store.dispatch('fetchCategories')
    const onFetchBudgetsSuccess = function () {
      self.fetchExpenses()
    }
    self.$store.dispatch('fetchBudgets', [onFetchBudgetsSuccess])
    self.initForm()
  },
  methods: {
    toPeso: function (num) {
      return pesoFormatter().format(num)
    },
    formatDate: function (date) {
      return dateFormatter().format(new Date(date))
    },
    budgetCategory: function (category_id) {
      return findWhere(this.$store.state.categories, {id: category_id}) || {}
    },
    budgetCategoryName: function (category_id) {
      return this.budgetCategory(category_id).name
    },
    fetchExpenses: function (budget) {
      const self = this
      each(self.$store.state.budgets, function (budget) {
        each(budget.budget_lines, function (line) {
          self.$store.commit('showLoader', 'lineExpenses')
          fetch(api(`/v1/expenses?q[category_id_in]=${line.category_id}&q[datetime_gteq]=${budget.from_date}&q[datetime_lteq]=${budget.to_date}`), {
            method: "GET",
            headers: apiHeaders('TRANSACTIONS')
          })
          .then(resp => resp.json())
          .then(function(data) {
            self.expenses[line.id] = data.total
          })
          .finally(function () {
            self.$store.commit('hideLoader', 'lineExpenses')
          })
        })
      })
    },
    _pluck: function (items, data) {
      return pluck(items, data)
    },
    initForm: function () {
      this.$store.dispatch('fetchTransactionTypes')
      this.$store.dispatch('fetchBankAccounts')
      this.$store.dispatch('fetchCategories')
      this.filter.from_date.setDate(1)
      this.filter.from_date = this.filter.from_date.toISOString()
      this.filter.to_date = this.filter.to_date.toISOString()
      this.filterTransactions()
    },
    filterTransactions: function () {
      const self = this
      self.$store.commit('showLoader', 'filterTransactions')
      fetch(api(`/v1/expenses?q[category_id_in]=${self.filter.category_id}&q[datetime_gteq]=${self.filter.from_date}&q[datetime_lteq]=${self.filter.to_date}&q[type_in]=${self.filter.type}&q[bank_account_id_in]=${self.filter.bank_account_id}`), {
        method: "GET",
        headers: apiHeaders('TRANSACTIONS')
      })
      .then(resp => resp.json())
      .then(function(data) {
        self.totalTransactions = data.total
      })
      .finally(function () {
        self.$store.commit('hideLoader', 'filterTransactions')
      })
    }
  },
}
</script>

<style>
  .content-budget-lines .content-budget-line {
    display: flex;
    justify-content: space-between;
  }
  .view-txns-link, .view-filters-link {
    text-decoration: none;
    color: gray;
  }
</style>