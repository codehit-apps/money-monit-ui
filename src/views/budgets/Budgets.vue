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
        <ion-item-sliding v-for="budget in this.$store.state.budgets" :key="budget.id">
          <ion-item :router-link="`/budgets/${budget.id}/edit`">
            <ion-label>
              <h2>{{ budget.name }}</h2>
            </ion-label>
          </ion-item>
          <ion-item-options side="end">
            <ion-item-option color="danger" @click="deleteBudget(budget.id)">Delete</ion-item-option>
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
  name: 'Budget',
  components: { IonItemOption, IonPage, IonItemSliding, IonItemOptions, IonHeader, IonToolbar, IonTitle, IonContent, IonButtons, IonBackButton, IonButton, IonIcon, IonList, IonItem, IonLabel },
  setup() {
    return {
      addCircle,
    }
  },
  created: function () {
    this.$store.dispatch('fetchBudgets')
  },
  methods: {
    deleteBudget: function (userId) {
      const self = this
      const success = function () {
        self.$store.dispatch('fetchBudgets')
      }
      const error = function (err) {
        console.log(err)
      }
      this.$store.dispatch('deleteBudget', [userId, success, error])
    }
  }
}
</script>