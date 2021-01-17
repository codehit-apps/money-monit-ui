<template>
  <ion-page>
    <ion-header>
      <ion-toolbar color="medium">
         <ion-buttons slot="start">
          <ion-back-button defaultHref="/categories"></ion-back-button>
        </ion-buttons>
        <ion-title class="align-center">Category Info</ion-title>
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
        <ion-label position="floating">Description</ion-label>
        <ion-input v-model="description"></ion-input>
      </ion-item>
      <div class="action-end ion-padding">
        <!-- <ion-text class="ion-margin-end" @click="this.$router.push({path: '/categories'})" >Cancel</ion-text> -->
        <ion-button type="submit" @click="saveCategory" color="primary">Save</ion-button>
      </div> 
    </ion-content>
  </ion-page>
</template>

<script >
import { toastController, IonText, IonInput, IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonButtons, IonBackButton, IonButton, IonItem, IonLabel } from '@ionic/vue';
import { addCircle } from 'ionicons/icons';

export default  {
  name: 'CategoryForm',
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
    name: {
      get () {
        return this.$store.state.category.name
      },
      set (value) {
        this.$store.commit('setCategoryName', value)
      }
    },
    description: {
      get () {
        return this.$store.state.category.description
      },
      set (value) {
        this.$store.commit('setCategoryDescription', value)
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
    saveCategory: function () {
      if (this.$route.params.id != null) {
        this.updateCategory()
      } else {
        this.createCategory()
      }
    },
    updateCategory: function () {
      const self = this
      const success = function (resp) {
        if (resp.errors && Object.keys(resp.errors).length) {
          self.showAlert("Category could not be updated. Please fix errors on the form.", "danger")
          self.errors = resp.errors
          console.log(resp.errors)
        } else {
          self.$router.push({path: '/categories'})
        }
      }
      const error = function (err) {
        console.log(err)
      }
      this.$store.dispatch('updateCategory', [success, error])
    },
    createCategory: function () {
      const self = this
      const success = function (resp) {
        if (resp.errors && Object.keys(resp.errors).length) {
          self.showAlert("Category could not be created. Please fix errors on the form.", "danger")
          self.errors = resp.errors
          console.log(resp.errors)
        } else {
          self.$store.dispatch('fetchCategories', [])
          self.$router.push({path: '/categories'})
        }
      }
      const error = function (err) {
        console.log(err)
      }
      this.$store.dispatch('createCategory', [success, error])
    },
    initForm: function () {
      this.$store.dispatch('fetchCategory', this.$route.params.id)
    }
  },
  watch: {
    $route() {
      this.initForm()
    }
  }
}
</script>