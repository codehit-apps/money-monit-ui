<template>
  <ion-page>
    <ion-header>
      <ion-toolbar color="primary">
         <ion-buttons slot="start">
          <ion-back-button></ion-back-button>
        </ion-buttons>
        <ion-title class="align-center">Banks</ion-title>
        <ion-buttons slot="end">
          <ion-button router-link="/banks/new">
            <ion-icon slot="icon-only" :icon="addCircle"/>
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>
    <ion-content :fullscreen="true">
      <ion-list>
        <ion-item-sliding v-for="bankAccount in this.$store.state.bankAccounts" :key="bankAccount.id">
          <ion-item :router-link="`/banks/${bankAccount.id}/edit`">
            <ion-label>
              <h2>
                <ion-text :color="bankAccount.color">{{ bankAccount.name }}</ion-text>
              </h2>
              <h3>{{ bankAccount.description }}</h3>
            </ion-label>
          </ion-item>
          <ion-item-options side="end">
            <ion-item-option color="danger" @click="deleteBankAccount(bankAccount.id)">Delete</ion-item-option>
          </ion-item-options>
        </ion-item-sliding>
      </ion-list>
    </ion-content>
  </ion-page>
</template>

<script >
import { IonItemOption, IonText, IonPage, IonItemSliding, IonItemOptions, IonHeader, IonToolbar, IonTitle, IonContent, IonButtons, IonBackButton, IonButton, IonIcon, IonList, IonItem, IonLabel } from '@ionic/vue';
import { addCircle } from 'ionicons/icons';

export default  {
  name: 'Banks',
  components: { IonItemOption, IonText, IonPage, IonItemSliding, IonItemOptions, IonHeader, IonToolbar, IonTitle, IonContent, IonButtons, IonBackButton, IonButton, IonIcon, IonList, IonItem, IonLabel },
  setup() {
    return {
      addCircle,
    }
  },
  created: function () {
    this.$store.dispatch('fetchBankAccounts')
  },
  methods: {
    deleteBankAccount: function (bankAccountId) {
      const self = this
      const success = function () {
        self.$store.dispatch('fetchBankAccounts')
      }
      const error = function (err) {
        console.log(err)
      }
      this.$store.dispatch('deleteBankAccount', [bankAccountId, success, error])
    },
  }
}
</script>