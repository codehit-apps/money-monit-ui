<template>
  <ion-page>
    <ion-header>
      <ion-toolbar color="warning">
         <ion-buttons slot="start">
          <ion-back-button defaultHref="/home"></ion-back-button>
        </ion-buttons>
        <ion-title class="align-center">Users</ion-title>
        <ion-buttons slot="end">
          <ion-button router-link="/users/new">
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
        <ion-item-sliding v-for="user in this.$store.state.users" :key="user.id">
          <ion-item :router-link="`/users/${user.id}/edit`">
            <ion-label>
              <h2>{{ userName(user) }}</h2>
              <h3>{{ user.email }}</h3>
            </ion-label>
          </ion-item>
          <ion-item-options side="end">
            <ion-item-option color="danger" @click="deleteUser(user.id)">Delete</ion-item-option>
          </ion-item-options>
        </ion-item-sliding>
      </ion-list>
    </ion-content>
  </ion-page>
</template>

<script >
import { alertController, IonRefresher, IonRefresherContent, IonItemOption, IonPage, IonItemSliding, IonItemOptions, IonHeader, IonToolbar, IonTitle, IonContent, IonButtons, IonBackButton, IonButton, IonIcon, IonList, IonItem, IonLabel } from '@ionic/vue';
import { addCircle } from 'ionicons/icons';

export default  {
  name: 'users-item',
  components: { IonRefresher, IonRefresherContent, IonItemOption, IonPage, IonItemSliding, IonItemOptions, IonHeader, IonToolbar, IonTitle, IonContent, IonButtons, IonBackButton, IonButton, IonIcon, IonList, IonItem, IonLabel },
  setup() {
    return {
      addCircle,
    }
  },
  created: function () {
    this.$store.dispatch('fetchUsers', [])
  },
  methods: {
    doRefresh: function (event) {
      const self = this
      const onSuccess = function () {
        event.target.complete()
      }
      self.$store.dispatch('fetchUsers', [onSuccess, {'_recache': 0}])
    },
    deleteUser: async function (userId) {
      const self = this
      const alert = await alertController
        .create({
          header: 'Are you sure?',
          message: 'Please click Confirm to delete this user.',
          buttons: [
            {
              text: 'Cancel',
              role: 'cancel',
            },
            {
              text: 'Confirm',
              handler: () => {
                const success = function () {
                  self.$store.dispatch('fetchUsers', [])
                }
                const error = function (err) {
                  console.log(err)
                }
                self.$store.dispatch('deleteUser', [userId, success, error])
              }
            }
          ]
        })
      return alert.present()
    },
    userName: function (user) {
      return [user.first_name, user.last_name].join(' ')
    }
  }
}
</script>