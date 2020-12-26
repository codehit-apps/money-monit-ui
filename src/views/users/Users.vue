<template>
  <ion-page>
    <ion-header>
      <ion-toolbar color="warning">
         <ion-buttons slot="start">
          <ion-back-button></ion-back-button>
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
      <ion-list>
        <ion-item-sliding v-for="user in this.$store.state.users" :key="user.id">
          <ion-item :router-link="`/users/${user.id}/edit`">
            <ion-label>
              <h2>{{ userName(user) }}</h2>
              <h3>{{ user.email }}</h3>
            </ion-label>
          </ion-item>
          <ion-item-options side="end">
            <ion-item-option color="danger" @click="deleteuser(user.id)">Delete</ion-item-option>
          </ion-item-options>
        </ion-item-sliding>
      </ion-list>
    </ion-content>
  </ion-page>
</template>

<script >
import { IonItemOption, IonPage, IonItemSliding, IonItemOptions, IonHeader, IonToolbar, IonTitle, IonContent, IonButtons, IonBackButton, IonButton, IonIcon, IonList, IonItem, IonLabel } from '@ionic/vue';
import { addCircle } from 'ionicons/icons';

export default  {
  name: 'Banks',
  components: { IonItemOption, IonPage, IonItemSliding, IonItemOptions, IonHeader, IonToolbar, IonTitle, IonContent, IonButtons, IonBackButton, IonButton, IonIcon, IonList, IonItem, IonLabel },
  setup() {
    return {
      addCircle,
    }
  },
  created: function () {
    this.$store.dispatch('fetchUsers')
  },
  methods: {
    deleteUser: function (userId) {
      const self = this
      const success = function () {
        self.$store.dispatch('fetchUsers')
      }
      const error = function (err) {
        console.log(err)
      }
      this.$store.dispatch('deleteUser', [userId, success, error])
    },
    userName: function (user) {
      return [user.first_name, user.last_name].join(' ')
    }
  }
}
</script>