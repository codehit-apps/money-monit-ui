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

      <div class="action-end ion-padding">
        <ion-text class="ion-margin-end" @click="this.$router.push({path: '/budgets'})" >Cancel</ion-text>
        <ion-button type="submit" @click="saveBudget" color="primary">Save</ion-button>
      </div> 
    </ion-content>
  </ion-page>
</template>

<script >
import { toastController, IonToggle, IonDatetime, IonText, IonInput, IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonButtons, IonBackButton, IonButton, IonItem, IonLabel } from '@ionic/vue';
import { addCircle } from 'ionicons/icons';

export default  {
  name: 'Budgets',
  components: { IonToggle, IonDatetime, IonText, IonInput, IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonButtons, IonBackButton, IonButton, IonItem, IonLabel },
  setup() {
    return {
      addCircle,
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
    async showAlert(message, color) {
      const alert = await toastController
        .create({
          message: message,
          color: color,
          duration: 5000,
        })
      return alert.present()
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
          self.$store.dispatch('fetchBudgets')
          self.$router.push({path: '/budgets'})
        }
      }
      const error = function (err) {
        console.log(err)
      }
      this.$store.dispatch('createBudget', [success, error])
    },
    initForm: function () {
      this.$store.dispatch('fetchBudget', this.$route.params.id)
    }
  },
  watch: {
    $route() {
      this.initForm()
    }
  }
}
</script>