<template>
  <ion-page>
    <ion-content :fullscreen="true">
      <ion-list class="ion-margin-end">
        <ion-item>
          <ion-icon :icon="personCircle" class="ion-margin-end"/>
          <ion-label>
            <h2>{{ this.$store.state.currentUser.name }}</h2>
            <h3>{{ this.$store.state.currentUser.email }}</h3>
          </ion-label>
        </ion-item>
        <ion-item>
          <ion-icon :icon="helpCircle" class="ion-margin-end"/>
          <ion-label>
            <h2>Help & Support</h2>
          </ion-label>
        </ion-item>
        <ion-item lines="none">
          <ion-icon :icon="logOut" class="ion-margin-end"/>
          <ion-label @click="signOut">
            <h2>Log out</h2>
          </ion-label>
        </ion-item>
      </ion-list>

    </ion-content>
  </ion-page>
</template>

<script >
import { IonIcon, IonPage, IonContent, IonLabel, IonList, IonItem } from '@ionic/vue';
import { logOut, helpCircle, personCircle } from 'ionicons/icons';
import { logout } from '../helper'

export default  {
  name: 'Account',
  components: { IonIcon, IonContent, IonPage, IonLabel, IonList, IonItem },
  setup() {
    return {
      logOut,
      helpCircle,
      personCircle
    }
  },
  created: function () {
    this.$store.dispatch('fetchCurrentUser')
  },
  methods: {
    signOut: function () {
      logout()
      window.location.reload()
    }
  }
}
</script>