<template>
  <ion-page>
    <ion-header>
      <ion-toolbar color="medium">
         <ion-buttons slot="start">
          <ion-back-button defaultHref="/home"></ion-back-button>
        </ion-buttons>
        <ion-title class="align-center">Categories</ion-title>
        <ion-buttons slot="end">
          <ion-button router-link="/categories/new">
            <ion-icon slot="icon-only" :icon="addCircle"/>
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>
    <ion-content :fullscreen="true">
      <ion-list>
        <ion-item-sliding v-for="category in this.$store.state.categories" :key="category.id">
          <ion-item :router-link="`/categories/${category.id}/edit`">
            <ion-label>
              <h2>{{ category.name }}</h2>
              <h3>{{ category.description }}</h3>
            </ion-label>
          </ion-item>
          <ion-item-options side="end">
            <ion-item-option color="danger" @click="deleteCategory(category.id)">Delete</ion-item-option>
          </ion-item-options>
        </ion-item-sliding>
      </ion-list>
    </ion-content>
  </ion-page>
</template>

<script >
import { alertController, IonPage, IonItemSliding, IonItemOption, IonItemOptions, IonHeader, IonToolbar, IonTitle, IonContent, IonButtons, IonBackButton, IonButton, IonIcon, IonList, IonItem, IonLabel } from '@ionic/vue';
import { addCircle } from 'ionicons/icons';

export default  {
  name: 'Categories',
  components: { IonPage, IonItemSliding, IonItemOption, IonItemOptions, IonHeader, IonToolbar, IonTitle, IonContent, IonButtons, IonBackButton, IonButton, IonIcon, IonList, IonItem, IonLabel },
  setup() {
    return {
      addCircle,
    }
  },
  created: function () {
    this.$store.dispatch('fetchCategories')
  },
  methods: {
    deleteCategory: async function (categoryId) {
      const self = this
      const alert = await alertController
        .create({
          header: 'Are you sure?',
          message: 'Please click Confirm to delete this category.',
          buttons: [
            {
              text: 'Cancel',
              role: 'cancel',
            },
            {
              text: 'Confirm',
              handler: () => {
                const success = function () {
                  self.$store.dispatch('fetchCategories')
                }
                const error = function (err) {
                  console.log(err)
                }
                self.$store.dispatch('deleteCategory', [categoryId, success, error])
              }
            }
          ]
        })
      return alert.present()
    },
  }
}
</script>