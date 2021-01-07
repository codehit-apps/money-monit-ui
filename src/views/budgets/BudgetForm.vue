<template>
  <ion-page>
    <ion-header>
      <ion-toolbar color="success">
         <ion-buttons slot="start">
          <ion-back-button></ion-back-button>
        </ion-buttons>
        <ion-title class="align-center">Budget Info</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content :fullscreen="true">
      <ion-item>
        <ion-label position="floating">Name</ion-label>
        <ion-input v-model="name"></ion-input>
      </ion-item>
      <div v-if="!!errors['name']" class="ion-margin-bottom ion-margin-start">
        <ion-text color="danger" v-for="error in errors['name']" :key="error">{{ error }}</ion-text>
      </div>

      <ion-item>
        <ion-label position="floating"> From </ion-label>
        <ion-datetime placeholder="Select" v-model="from_date"/>
      </ion-item>
      <div v-if="!!errors['from_date']" class="ion-margin-bottom ion-margin-start">
        <ion-text color="danger" v-for="error in errors['from_date']" :key="error">{{ error }}</ion-text>
      </div>

      <ion-item>
        <ion-label position="floating"> To </ion-label>
        <ion-datetime placeholder="Select" v-model="to_date"/>
      </ion-item>
      <div v-if="!!errors['to_date']" class="ion-margin-bottom ion-margin-start">
        <ion-text color="danger" v-for="error in errors['to_date']" :key="error">{{ error }}</ion-text>
      </div>

      <ion-item>
        <ion-label position="fixed"> Active? </ion-label>
        <ion-toggle color="primary" v-model="active" value='on' :checked="active"/>
      </ion-item>
      <div v-if="!!errors['active']" class="ion-margin-bottom ion-margin-start">
        <ion-text color="danger" v-for="error in errors['active']" :key="error">{{ error }}</ion-text>
      </div>

      <ion-item>
        <h2>
          <b> Budget Items</b>
        </h2>
      </ion-item>
      <ion-item v-for="line in this.$store.state.budget.budget_lines" :key="line.id" :router-link="`/budgets/${this.$store.state.budget.id}/items/${line.id}/edit`">
        <ion-label>
          <ion-text class="ion-float-left">  {{ budgetCategoryName(line.category_id) }} </ion-text>
          <ion-text class="ion-float-right"> {{ toPeso(line.amount) }} </ion-text>
        </ion-label>
      </ion-item>

      <ion-item>
        <ion-label class="ion-text-right">
          <ion-button color="secondary" @click="this.$router.push({path: `/budgets/${this.$store.state.budget.id}/items/new`})">
            <ion-icon :icon="addCircleOutline"/>
            &nbsp; Line
          </ion-button>
        </ion-label>
      </ion-item>

      <div class="action-end ion-padding">
        <ion-button type="button" v-if="this.$route.params.id != null"  class="ion-margin-end" @click="copyBudget" color="tertiary">Copy</ion-button>
        <ion-text class="ion-margin-end" @click="this.$router.push({path: '/budgets'})" >Cancel</ion-text>
        <ion-button type="submit" @click="saveBudget" color="primary">Save</ion-button>
      </div> 
    </ion-content>
  </ion-page>
</template>

<script >
import { toastController, IonIcon, IonToggle, IonDatetime, IonText, IonInput, IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonButtons, IonBackButton, IonButton, IonItem, IonLabel } from '@ionic/vue';
import { addCircle, addCircleOutline } from 'ionicons/icons';
import { findWhere } from 'underscore';
import { pesoFormatter } from '../../helper'

export default  {
  name: 'Budgets',
  components: { IonIcon, IonToggle, IonDatetime, IonText, IonInput, IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonButtons, IonBackButton, IonButton, IonItem, IonLabel },
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
    name: {
      get () {
        return this.$store.state.budget.name
      },
      set (value) {
        this.$store.commit('setBudgetName', value)
      }
    },
    from_date: {
      get () {
        return this.$store.state.budget.from_date
      },
      set (value) {
        this.$store.commit('setBudgetFromDate', value)
      }
    },
    to_date: {
      get () {
        return this.$store.state.budget.to_date
      },
      set (value) {
        this.$store.commit('setBudgetToDate', value)
      }
    },
    active: {
      get () {
        return this.$store.state.budget.active
      },
      set (value) {
        this.$store.commit('setBudgetActive', value)
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
    copyBudget: function () {
      const self = this
      const success = function (resp) {
        if (resp.errors && Object.keys(resp.errors).length) {
          self.showAlert("Budget could not be copied. Please fix errors on the form.", "danger")
          self.errors = resp.errors
        } else {
          self.$router.push({path: `/budgets/${resp.budget.id}/edit`})
        }
      }
      const error = function (err) {
        console.log(err)
      }
      this.$store.dispatch('copyBudget', [this.$route.params.id, success, error])
    },
    saveBudget: function () {
      if (this.$route.params.id != null) {
        this.updateBudget()
      } else {
        this.createBudget()
      }
    },
    updateBudget: function () {
      const self = this
      const success = function (resp) {
        if (resp.errors && Object.keys(resp.errors).length) {
          self.showAlert("Budget could not be updated. Please fix errors on the form.", "danger")
          self.errors = resp.errors
          console.log(resp.errors)
        } else {
          self.$router.push({path: '/budgets'})
        }
      }
      const error = function (err) {
        console.log(err)
      }
      this.$store.dispatch('updateBudget', [success, error])
    },
    createBudget: function () {
      const self = this
      const success = function (resp) {
        if (resp.errors && Object.keys(resp.errors).length) {
          self.showAlert("Budget could not be created. Please fix errors on the form.", "danger")
          self.errors = resp.errors
          console.log(resp.errors)
        } else {
          self.$store.dispatch('fetchBudgets', [])
          self.$router.push({path: '/budgets'})
        }
      }
      const error = function (err) {
        console.log(err)
      }
      this.$store.dispatch('createBudget', [success, error])
    },
    initForm: function () {
      this.$store.dispatch('reloadBudget', this.$route.params.id)
      this.$store.dispatch('fetchCategories')
    },
    budgetCategory: function (category_id) {
      return findWhere(this.$store.state.categories, {id: category_id}) || {}
    },
    budgetCategoryName: function (category_id) {
      return this.budgetCategory(category_id).name
    },
  },
  watch: {
    $route() {
      this.initForm()
    }
  }
}
</script>