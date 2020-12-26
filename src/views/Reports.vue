<template>
  <ion-page>
    <ion-header>
      <ion-toolbar color="tertiary">
         <ion-buttons slot="start">
          <ion-back-button></ion-back-button>
        </ion-buttons>
        <ion-title class="align-center">Reports</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content :fullscreen="true">
      <ion-header collapse="condense">
        <ion-toolbar>
          <ion-title size="large">Reports</ion-title>
        </ion-toolbar>
      </ion-header>
    </ion-content>
  </ion-page>
</template>

<script >
import { IonPage, IonHeader, IonButtons, IonBackButton, IonToolbar, IonTitle, IonContent } from '@ionic/vue';

export default  {
  name: 'Reports',
  components: {IonHeader, IonButtons, IonBackButton, IonToolbar, IonTitle, IonContent, IonPage }
}
</script>