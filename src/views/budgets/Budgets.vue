<template>
  <ion-page>
    <ion-header>
      <ion-toolbar color="success">
         <ion-buttons slot="start">
          <ion-back-button defaultHref="/home"></ion-back-button>
        </ion-buttons>
        <ion-title class="align-center">Budgets</ion-title>
        <ion-buttons slot="end">
          <ion-button router-link="/budgets/new">
            <ion-icon slot="icon-only" :icon="addCircle"/>
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>
    <ion-content :fullscreen="true">
      <ion-refresher slot="fixed" @ionRefresh="doRefresh($event)">
        <ion-refresher-content></ion-refresher-content>
      </ion-refresher>
      <ion-list>
        <ion-item-sliding v-for="budget in this.$store.state.budgets" :key="budget.id">
          <ion-item :router-link="`/budgets/${budget.id}/edit`">
            <ion-label>
              <div class="header-label">
                <div class="budget-date">
                  {{ formatDate(budget.from_date) }} - {{ formatDate(budget.to_date) }}
                </div>
                <ion-badge v-if="budget.active" color="success">active</ion-badge>
              </div>
              <h1>{{ budget.name }}</h1>
              <div class="budget-lines">
                <div class="budget-line" v-for="line in sortedLines(budget.budget_lines)" :key="line.id">
                  <span>{{ budgetCategoryName(line.category_id) }}</span>
                  <span>{{ toPeso(line.amount) }}</span>
                </div>
              </div>
            </ion-label>
          </ion-item>
          <ion-item-options side="end">
            <ion-item-option color="danger" @click="deleteBudget(budget.id)">Delete</ion-item-option>
          </ion-item-options>
        </ion-item-sliding>
      </ion-list>
    </ion-content>
  </ion-page>
</template>

<script >
import { alertController, IonRefresher, IonRefresherContent, IonBadge, IonItemOption, IonPage, IonItemSliding, IonItemOptions, IonHeader, IonToolbar, IonTitle, IonContent, IonButtons, IonBackButton, IonButton, IonIcon, IonList, IonItem, IonLabel } from '@ionic/vue';
import { addCircle } from 'ionicons/icons';
import { findWhere, sortBy } from 'underscore';
import { pesoFormatter, dateFormatter } from '../../helper'

export default  {
  name: 'Budget',
  components: { IonRefresher, IonRefresherContent, IonBadge, IonItemOption, IonPage, IonItemSliding, IonItemOptions, IonHeader, IonToolbar, IonTitle, IonContent, IonButtons, IonBackButton, IonButton, IonIcon, IonList, IonItem, IonLabel },
  setup() {
    return {
      addCircle,
    }
  },
  created: function () {
    this.$store.dispatch('fetchCategories', [])
    this.$store.dispatch('fetchBudgets', [])
  },
  methods: {
    sortedLines: function (lines) {
      const self = this
      return sortBy(lines, function (line) { return self.budgetCategoryName(line.category_id) })
    },
    toPeso: function (num) {
      return pesoFormatter().format(num)
    },
    formatDate: function (date) {
      if (date == null || date == '') return null
      return dateFormatter().format(new Date(date))
    },
    deleteBudget: async function (userId) {
      const self = this
      const alert = await alertController
        .create({
          header: 'Are you sure?',
          message: 'Please click Confirm to delete this budget.',
          buttons: [
            {
              text: 'Cancel',
              role: 'cancel',
            },
            {
              text: 'Confirm',
              handler: () => {
                const success = function () {
                  self.$store.dispatch('fetchBudgets', [])
                }
                const error = function (err) {
                  console.log(err)
                }
                self.$store.dispatch('deleteBudget', [userId, success, error])
              }
            }
          ]
        })
      return alert.present()
    },
    budgetCategory: function (category_id) {
      return findWhere(this.$store.state.categories, {id: category_id}) || {}
    },
    budgetCategoryName: function (category_id) {
      return this.budgetCategory(category_id).name
    },
    doRefresh: function (event) {
      const self = this
      const onSuccess = function () {
        event.target.complete()
      }
      self.$store.dispatch('fetchBudgets', [onSuccess, {'_recache': 0}])
    }
  },
  watch: {
    $route(to, from) {
      if (to.name == 'NewBudget') this.$store.dispatch('fetchBudget', null)
    }
  }
}
</script>

<style lang="css">
  .budget-lines .budget-line {
    display: flex;
    justify-content: space-between;
    font-size: 90%;
    padding: 2px 4px;
    border-radius: 2px;
  }
  .budget-lines .budget-line:nth-child(odd) {
    background: #eee;
  }
  .header-label {
    display: flex;
    justify-content: space-between;
  }
  .budget-date {
    color: gray;
    text-transform: uppercase;
    font-size: 70%;
    font-weight: bold;
  }
</style>