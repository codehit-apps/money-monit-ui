<template>
  <ion-page>
    <ion-tabs>
      <ion-router-outlet></ion-router-outlet>
      <ion-tab-bar slot="bottom">
        <ion-tab-button tab="tab1" href="/home" @click="this.$router.push({path: '/home'})">
          <ion-icon :icon="home" v-if="this.$router.currentRoute.value.name == 'homePageRoute'"/>
          <ion-icon :icon="homeOutline" v-else/>
          <ion-label>Home</ion-label>
        </ion-tab-button>
          
        <ion-tab-button tab="tab2" href="/transactions/new">
          <ion-icon :icon="addCircle" v-if="this.$router.currentRoute.value.name == 'newTransactionPageRoute'"/>
          <ion-icon :icon="addCircleOutline" v-else/>
          <ion-label>Expense</ion-label>
        </ion-tab-button>
        
        <ion-tab-button tab="tab3" href="/account">
          <ion-icon :icon="personCircle" v-if="this.$router.currentRoute.value.name == 'accountPageRoute'"/>
          <ion-icon :icon="personCircleOutline" v-else/>
          <ion-label>Account</ion-label>
        </ion-tab-button>
      </ion-tab-bar>
    </ion-tabs>
    <ion-spinner id="loading-icon" v-if="this.$store.state.isLoading" name="crescent"></ion-spinner>
  </ion-page>
</template>

<script >
import { IonTabBar, IonTabButton, IonRouterOutlet, IonTabs, IonSpinner, IonLabel, IonIcon, IonPage } from '@ionic/vue';
import { home, homeOutline, addCircleOutline, addCircle, personCircle, personCircleOutline } from 'ionicons/icons';

export default {
  name: 'Tabs',
  components: { IonSpinner, IonLabel, IonTabs, IonTabBar, IonTabButton, IonIcon, IonPage, IonRouterOutlet },
  setup() {
    return {
      home,
      homeOutline,
      addCircle,
      addCircleOutline,
      personCircle,
      personCircleOutline
    }
  },
  created: function () {
  }
}
</script>