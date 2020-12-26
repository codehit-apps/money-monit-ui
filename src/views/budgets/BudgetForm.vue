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
        <ion-input></ion-input>
      </ion-item>
      <ion-item>
        <ion-label position="floating">Description</ion-label>
        <ion-input></ion-input>
      </ion-item>
      <div class="action-end ion-padding">
        <ion-text class="ion-margin-end" @click="this.$router.push({path: '/budgets'})" >Cancel</ion-text>
        <ion-button type="submit" color="primary">Save</ion-button>
      </div> 
    </ion-content>
  </ion-page>
</template>

<script >
import { IonInput, IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonButtons, IonBackButton, IonButton, IonItem, IonLabel } from '@ionic/vue';
import { addCircle } from 'ionicons/icons';

export default  {
  name: 'BudgetForm',
  components: { IonInput, IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonButtons, IonBackButton, IonButton, IonItem, IonLabel },
  setup() {
    return {
      addCircle,
    }
  }
}
</script>