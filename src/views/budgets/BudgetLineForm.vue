
<template>
  <ion-page>
    <ion-header>
      <ion-toolbar color="success">
         <ion-buttons slot="start">
          <ion-back-button></ion-back-button>
        </ion-buttons>
        <ion-title class="align-center">Budget item info</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content :fullscreen="true">
      <ion-item>
        <ion-label position="floating"> Category </ion-label>
        <ion-select placeholder="Select" v-model="category_id" interface="action-sheet">
          <ion-select-option v-for="category in this.$store.state.categories" :key="category.id" :value="category.id">{{ category.name }}</ion-select-option>
        </ion-select>
      </ion-item>
      <div v-if="!!errors['category_id']" class="ion-margin-bottom ion-margin-start">
        <ion-text color="danger" v-for="error in errors['category_id']" :key="error">{{ error }}</ion-text>
      </div>

      <ion-item>
        <ion-label position="floating"> Amount </ion-label>
        <ion-input type="number" v-model="amount" step="0.01" min="0.01">
        </ion-input>
      </ion-item>
      <div v-if="!!errors['amount']" class="ion-margin-bottom ion-margin-start">
        <ion-text color="danger" v-for="error in errors['amount']" :key="error">{{ error }}</ion-text>
      </div>

      <div class="action-end ion-padding">
        <ion-text class="ion-margin-end" @click="this.$router.push({path: `/budgets/${this.$route.params.budget_id}/edit`})" >Cancel</ion-text>
        <ion-button type="submit" @click="saveBudgetLine" color="primary">Save</ion-button>
      </div> 
    </ion-content>
  </ion-page>
</template>

<script >
import { toastController, IonSelect, IonSelectOption, IonText, IonInput, IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonButtons, IonBackButton, IonButton, IonItem, IonLabel } from '@ionic/vue';
import { addCircle, addCircleOutline } from 'ionicons/icons';
import { findWhere } from 'underscore';
import { pesoFormatter } from '../../helper'

export default  {
  name: 'Budgets',
  components: { IonSelect, IonSelectOption, IonText, IonInput, IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonButtons, IonBackButton, IonButton, IonItem, IonLabel },
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
    category_id: {
      get () {
        return this.$store.state.budget_line.category_id
      },
      set (value) {
        this.$store.commit('setBudgetLineCategoryId', value)
      }
    },
    amount: {
      get () {
        return this.$store.state.budget_line.amount
      },
      set (value) {
        this.$store.commit('setBudgetLineAmount', value)
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
    saveBudgetLine: function () {
      const self = this
      const success = function (resp) {
        if (resp.errors && Object.keys(resp.errors).length) {
          self.showAlert("Budget line could not be updated. Please fix errors on the form.", "danger")
          self.errors = resp.errors
          console.log(resp.errors)
        } else {
          self.$router.push({path: `/budgets/${self.$route.params.budget_id}/edit`})
        }
      }
      const error = function (err) {
        console.log(err)
      }
      this.$store.dispatch('saveBudgetLine', [success, error])
    },
    initForm: function () {
      if (this.$route.params.budget_id == null) return false
      this.$store.dispatch('fetchBudgetLine', [this.$route.params.budget_id, this.$route.params.id])
      this.$store.dispatch('fetchCategories')
    },
  },
  watch: {
    $route() {
      this.initForm()
    }
  }
}
</script>