<template>
  <ion-page>
    <ion-header>
      <ion-toolbar color="primary">
         <ion-buttons slot="start">
          <ion-back-button defaultHref="/banks"></ion-back-button>
        </ion-buttons>
        <ion-title class="align-center">Account Info</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content :fullscreen="true">
      <ion-item>
        <ion-label position="floating">Name</ion-label>
        <ion-input v-model="name" :color="color"></ion-input>
      </ion-item>
      <div v-if="!!errors['name']" class="ion-margin-bottom ion-margin-start">
        <ion-text color="danger" v-for="error in errors['name']" :key="error">{{ error }}</ion-text>
      </div>
      <ion-item>
        <ion-label position="floating">Description</ion-label>
        <ion-input v-model="description"></ion-input>
      </ion-item>
      <ion-item>
        <ion-label position="floating">Color</ion-label>
        <ion-select v-model="color" placeholder="Select" interface="action-sheet">
          <ion-select-option v-for="(_color, ndx) in colors" :key="ndx" :value="_color.val" :class="_color.val"> {{ _color.name }}</ion-select-option>
        </ion-select>
      </ion-item>
      <div class="action-end ion-padding">
        <!-- <ion-text class="ion-margin-end" @click="this.$router.push({path: '/banks'})" >Cancel</ion-text> -->
        <ion-button type="submit" @click="saveBankAccount" color="primary">Save</ion-button>
      </div> 
    </ion-content>
  </ion-page>
</template>

<script >
import { toastController, IonText, IonSelect, IonSelectOption, IonInput, IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonButtons, IonBackButton, IonButton, IonItem, IonLabel } from '@ionic/vue';
import { addCircle } from 'ionicons/icons';

export default  {
  name: 'bank-form-item',
  components: { IonText, IonSelect, IonSelectOption, IonInput, IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonButtons, IonBackButton, IonButton, IonItem, IonLabel },
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
      colors: [
        {val: "primary", name: "Blue"},
        {val: "secondary", name: "Light Blue"},
        {val: "tertiary", name: "Indigo"},
        {val: "success", name: "Green"},
        {val: "warning", name: "Light Orange"},
        {val: "danger", name: "Red"},
        {val: "light", name: "Light Gray"},
        {val: "medium", name: "Gray"},
        {val: "dark", name: "Black"},
      ],
      errors: {}
    }
  },
  computed: {
    name: {
      get () {
        return this.$store.state.bankAccount.name
      },
      set (value) {
        this.$store.commit('setBankAccountName', value)
      }
    },
    description: {
      get () {
        return this.$store.state.bankAccount.description
      },
      set (value) {
        this.$store.commit('setBankAccountDescription', value)
      }
    },
    color: {
      get () {
        return this.$store.state.bankAccount.color
      },
      set (value) {
        this.$store.commit('setBankAccountColor', value)
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
    saveBankAccount: function () {
      if (this.$route.params.id != null) {
        this.updateBankAccount()
      } else {
        this.createBankAccount()
      }
    },
    updateBankAccount: function () {
      const self = this
      const success = function (resp) {
        if (resp.errors && Object.keys(resp.errors).length) {
          self.showAlert("Account could not be updated. Please fix errors on the form.", "danger")
          self.errors = resp.errors
          console.log(resp.errors)
        } else {
          self.$router.push({path: '/banks'})
        }
      }
      const error = function (err) {
        console.log(err)
      }
      this.$store.dispatch('updateBankAccount', [success, error])
    },
    createBankAccount: function () {
      const self = this
      const success = function (resp) {
        if (resp.errors && Object.keys(resp.errors).length) {
          self.showAlert("Account could not be created. Please fix errors on the form.", "danger")
          self.errors = resp.errors
          console.log(resp.errors)
        } else {
          self.$store.dispatch('fetchBankAccounts', [])
          self.$router.push({path: '/banks'})
        }
      }
      const error = function (err) {
        console.log(err)
      }
      this.$store.dispatch('createBankAccount', [success, error])
    },
    initForm: function () {
      this.$store.dispatch('fetchBankAccount', this.$route.params.id)
    }
  },
  watch: {
    $route() {
      this.initForm()
    }
  }
}
</script>
