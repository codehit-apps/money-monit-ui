<template>
  <ion-page>
    <ion-header>
      <ion-toolbar color="warning">
         <ion-buttons slot="start">
          <ion-back-button :defaultHref="userRedirect()"></ion-back-button>
        </ion-buttons>
        <ion-title class="align-center">User Info</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content :fullscreen="true">
      <ion-item>
        <ion-label position="floating">First name</ion-label>
        <ion-input v-model="first_name"></ion-input>
      </ion-item>
      <div v-if="!!errors['first_name']" class="ion-margin-bottom ion-margin-start">
        <ion-text color="danger" v-for="error in errors['first_name']" :key="error">{{ error }}</ion-text>
      </div>
      <ion-item>
        <ion-label position="floating">Last name</ion-label>
        <ion-input v-model="last_name"></ion-input>
      </ion-item>
      <div v-if="!!errors['last_name']" class="ion-margin-bottom ion-margin-start">
        <ion-text color="danger" v-for="error in errors['last_name']" :key="error">{{ error }}</ion-text>
      </div>
      <ion-item>
        <ion-label position="floating">Email</ion-label>
        <ion-input type="email" v-model="email"></ion-input>
      </ion-item>
      <div v-if="!!errors['email']" class="ion-margin-bottom ion-margin-start">
        <ion-text color="danger" v-for="error in errors['email']" :key="error">{{ error }}</ion-text>
      </div>
      <ion-item>
        <ion-label position="floating">Password</ion-label>
        <ion-input type="password" v-model="password"></ion-input>
      </ion-item>
      <div v-if="!!errors['password']" class="ion-margin-bottom ion-margin-start">
        <ion-text color="danger" v-for="error in errors['password']" :key="error">{{ error }}</ion-text>
      </div>
      <div class="action-end ion-padding">
        <!-- <ion-text class="ion-margin-end" @click="this.$router.push({path: '/users'})" >Cancel</ion-text> -->
        <ion-button type="submit" @click="saveUser" color="primary">Save</ion-button>
      </div> 
    </ion-content>
  </ion-page>
</template>

<script >
import { toastController, IonText, IonInput, IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonButtons, IonBackButton, IonButton, IonItem, IonLabel } from '@ionic/vue';
import { addCircle } from 'ionicons/icons';

export default  {
  name: 'BankForm',
  components: { IonText, IonInput, IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonButtons, IonBackButton, IonButton, IonItem, IonLabel },
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
    first_name: {
      get () {
        return this.$store.state.user.first_name
      },
      set (value) {
        this.$store.commit('setUserFirstName', value)
      }
    },
    last_name: {
      get () {
        return this.$store.state.user.last_name
      },
      set (value) {
        this.$store.commit('setUserLastName', value)
      }
    },
    email: {
      get () {
        return this.$store.state.user.email
      },
      set (value) {
        this.$store.commit('setUserEmail', value)
      }
    },
    password: {
      get () {
        return this.$store.state.user.password
      },
      set (value) {
        this.$store.commit('setUserPassword', value)
      }
    },
  },
  methods: {
    userRedirect: function () {
      return this.$store.state.currentUser.admin ? '/users' : '/account'
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
    saveUser: function () {
      this.$store.commit('setUserRefId')
      if (this.$route.params.id != null) {
        this.updateUser()
      } else {
        this.createUser()
      }
    },
    updateUser: function () {
      const self = this
      const success = function (resp) {
        if (resp.errors && Object.keys(resp.errors).length) {
          self.showAlert("User could not be updated. Please fix errors on the form.", "danger")
          self.errors = resp.errors
          console.log(resp.errors)
        } else {
          self.$router.push({path: self.userRedirect()})
        }
      }
      const error = function (err) {
        console.log(err)
      }
      this.$store.dispatch('updateUser', [success, error])
    },
    createUser: function () {
      const self = this
      const success = function (resp) {
        if (resp.errors && Object.keys(resp.errors).length) {
          self.showAlert("User could not be created. Please fix errors on the form.", "danger")
          self.errors = resp.errors
          console.log(resp.errors)
        } else {
          self.$store.dispatch('fetchUsers', [])
          self.$router.push({path: self.userRedirect()})
        }
      }
      const error = function (err) {
        console.log(err)
      }
      this.$store.dispatch('createUser', [success, error])
    },
    initForm: function () {
      this.$store.dispatch('fetchUser', this.$route.params.id)
    }
  },
  watch: {
    $route() {
      this.initForm()
    }
  }
}
</script>