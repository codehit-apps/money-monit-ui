<template>
  <ion-page>
    <ion-header>
      <ion-toolbar color="success">
         <ion-buttons slot="start">
          <ion-back-button></ion-back-button>
        </ion-buttons>
        <ion-title class="align-center">Budgets</ion-title>
        <ion-buttons slot="end">
          <ion-button router-link="/budgets/new">
            <ion-icon slot="icon-only" :icon="addCircle"/>
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>
    <ion-content :fullscreen="true">
      <ion-list>
        <ion-item-sliding>
          <ion-item router-link="/budgets/1/edit">
            <ion-label>
              <h2>Budget for may</h2>
              <h3>monthly salary</h3>
            </ion-label>
          </ion-item>
          <ion-item-options side="end">
            <ion-item-option color="danger" @click="deleteBank(bank)">Delete</ion-item-option>
          </ion-item-options>
        </ion-item-sliding>

        <ion-item-sliding>
          <ion-item router-link="/budgets/2/edit">
            <ion-label>
              <h2>Budget for bigaan</h2>
              <h3>bi-monthly salary</h3>
            </ion-label>
          </ion-item>
          <ion-item-options side="end">
            <ion-item-option color="danger" @click="deleteBank(bank)">Delete</ion-item-option>
          </ion-item-options>
        </ion-item-sliding>

        <ion-item-sliding>
          <ion-item router-link="/budgets/3/edit">
            <ion-label>
              <h2>Loan budget</h2>
              <h3>farm buisenes back up</h3>
            </ion-label>
          </ion-item>
          <ion-item-options side="end">
            <ion-item-option color="danger" @click="deleteBank(bank)">Delete</ion-item-option>
          </ion-item-options>
        </ion-item-sliding>

        <ion-item-sliding>
          <ion-item router-link="/budgets/4/edit">
            <ion-label>
              <h2>christmas budget</h2>
              <h3>Subscription</h3>
            </ion-label>
          </ion-item>
          <ion-item-options side="end">
            <ion-item-option color="danger" @click="deleteBank(bank)">Delete</ion-item-option>
          </ion-item-options>
        </ion-item-sliding>
      </ion-list>
    </ion-content>
  </ion-page>
</template>

<script >
import { IonPage, IonItemSliding, IonItemOption, IonItemOptions, IonHeader, IonToolbar, IonTitle, IonContent, IonButtons, IonBackButton, IonButton, IonIcon, IonList, IonItem, IonLabel } from '@ionic/vue';
import { addCircle } from 'ionicons/icons';

export default  {
  name: 'Budgets',
  components: { IonPage, IonItemSliding, IonItemOption, IonItemOptions, IonHeader, IonToolbar, IonTitle, IonContent, IonButtons, IonBackButton, IonButton, IonIcon, IonList, IonItem, IonLabel },
  setup() {
    return {
      addCircle,
    }
  }
}
</script>