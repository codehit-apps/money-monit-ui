<template>
  <ion-page>
    <ion-header>
      <ion-toolbar color="primary">
         <ion-buttons slot="start">
          <ion-back-button defaultHref="/home"></ion-back-button>
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
      <ion-refresher slot="fixed" @ionRefresh="doRefresh($event)">
        <ion-refresher-content></ion-refresher-content>
      </ion-refresher>
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
import { alertController, IonRefresher, IonRefresherContent, IonItemOption, IonText, IonPage, IonItemSliding, IonItemOptions, IonHeader, IonToolbar, IonTitle, IonContent, IonButtons, IonBackButton, IonButton, IonIcon, IonList, IonItem, IonLabel } from '@ionic/vue';
import { addCircle } from 'ionicons/icons';

export default  {
  name: 'Banks',
  components: { IonRefresher, IonRefresherContent, IonItemOption, IonText, IonPage, IonItemSliding, IonItemOptions, IonHeader, IonToolbar, IonTitle, IonContent, IonButtons, IonBackButton, IonButton, IonIcon, IonList, IonItem, IonLabel },
  setup() {
    return {
      addCircle,
    }
  },
  created: function () {
    this.$store.dispatch('fetchBankAccounts', [])
  },
  methods: {
    doRefresh: function (event) {
      const self = this
      const onSuccess = function () {
        event.target.complete()
      }
      self.$store.dispatch('fetchBankAccounts', [onSuccess, {'_recache': 0}])
    },
    deleteBankAccount: async function (bankAccountId) {
      const self = this
      const alert = await alertController
        .create({
          header: 'Are you sure?',
          message: 'Please click Confirm to delete this bank account.',
          buttons: [
            {
              text: 'Cancel',
              role: 'cancel',
            },
            {
              text: 'Confirm',
              handler: () => {
                const success = function () {
                  self.$store.dispatch('fetchBankAccounts', [])
                }
                const error = function (err) {
                  console.log(err)
                }
                self.$store.dispatch('deleteBankAccount', [bankAccountId, success, error])
              }
            }
          ]
        })
      return alert.present()
    },
  }
}
</script>