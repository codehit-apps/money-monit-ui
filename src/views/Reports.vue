<template>
  <ion-page>
    <ion-header>
      <ion-toolbar color="tertiary">
         <ion-buttons slot="start">
          <ion-back-button></ion-back-button>
        </ion-buttons>
        <ion-title class="align-center">Reports</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content :fullscreen="true">
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
                    {{ toPeso(this.expenses[line.id]) }}
                  </ion-text>
                </div>
                <span v-if="this.expenses[line.id] > line.amount">
                  <div class="content-budget-line">
                    <small>Over Budget</small>
                    <ion-text color='danger'> ({{toPeso(line.amount - this.expenses[line.id] * -1)}}) </ion-text>
                  </div>
                </span>
                <span v-else>
                  <div class="content-budget-line">
                    <small>Consumable</small>
                    {{ toPeso(line.amount - this.expenses[line.id]) }}
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
import { IonPage, IonCard, IonCardHeader, IonCardContent, IonText, IonCardTitle, IonCardSubtitle, IonHeader, IonButtons, IonBackButton, IonToolbar, IonTitle, IonContent } from '@ionic/vue';
import { pesoFormatter, dateFormatter, api, env, apiHeaders } from '../helper'
import { findWhere, each, pluck } from 'underscore';

export default  {
  name: 'Reports',
  components: {IonCard, IonCardHeader, IonCardContent, IonText, IonCardTitle, IonCardSubtitle, IonHeader, IonButtons, IonBackButton, IonToolbar, IonTitle, IonContent, IonPage },
  data: function () {
    return {
      expenses: {},
      overBudgets: {},
    }
  },
  created: function () {
    const self = this
    self.$store.dispatch('fetchCategories')
    const onFetchBudgetsSuccess = function () {
      self.fetchExpenses()
    }
    self.$store.dispatch('fetchBudgets', [onFetchBudgetsSuccess])
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
          fetch(api(`/v1/expenses?category_id=${line.category_id}&from_date=${budget.from_date}&to_date=${budget.to_date}`), {
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
    }
  },
}
</script>

<style>
  .content-budget-lines .content-budget-line {
    display: flex;
    justify-content: space-between;
  }
  .view-txns-link {
    text-decoration: none;
    color: gray;
  }
</style>