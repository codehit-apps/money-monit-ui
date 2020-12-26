<template>
  <ion-page>
    <ion-header>
      <ion-toolbar color="danger">
         <ion-buttons slot="start">
          <ion-back-button></ion-back-button>
        </ion-buttons>
        <ion-title class="align-center">Transaction Info</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content :fullscreen="true">
      <ion-item>
        <ion-label position="floating"> Type </ion-label>
        <ion-select placeholder="Select" v-model="type" interface="action-sheet">
          <ion-select-option v-for="(key, val) in this.$store.state.transactionTypes" :key="key"  :value="val">{{ key }}</ion-select-option>
        </ion-select>
      </ion-item>
      <div v-if="!!errors['type']" class="ion-margin-bottom ion-margin-start">
        <ion-text color="danger" v-for="error in errors['type']" :key="error">{{ error }}</ion-text>
      </div>

      <ion-item>
        <ion-label position="floating"> Category </ion-label>
        <ion-select placeholder="Select" v-model="category_id" interface="action-sheet">
          <ion-select-option v-for="category in this.$store.state.categories" :key="category.id" :value="category.id">{{ category.name }}</ion-select-option>
        </ion-select>
      </ion-item>
      <div v-if="!!errors['category_id']" class="ion-margin-bottom ion-margin-start">
        <ion-text color="danger" v-for="error in errors['category_id']" :key="error">{{ error }}</ion-text>
      </div>

      <div v-if="type == 'Transfer'">
        <ion-item>
          <ion-label position="floating"> Source Account </ion-label>
          <ion-select placeholder="Select" v-model="bank_account_id" interface="action-sheet">
            <ion-select-option v-for="bankAccount in this.$store.state.bankAccounts" :key="bankAccount.id" :value="bankAccount.id" :class="bankAccount.color">{{ bankAccount.name }}</ion-select-option>
          </ion-select>
        </ion-item>
        <div v-if="!!errors['bank_account_id']" class="ion-margin-bottom ion-margin-start">
          <ion-text color="danger" v-for="error in errors['bank_account_id']" :key="error">{{ error }}</ion-text>
        </div>
        <ion-item>
          <ion-label position="floating"> Target Account </ion-label>
          <ion-select placeholder="Select" v-model="to_bank_account_id" interface="action-sheet">
            <ion-select-option v-for="bankAccount in this.$store.state.bankAccounts" :key="bankAccount.id" :value="bankAccount.id" :class="bankAccount.color">{{ bankAccount.name }}</ion-select-option>
          </ion-select>
        </ion-item>
        <div v-if="!!errors['to_bank_account_id']" class="ion-margin-bottom ion-margin-start">
          <ion-text color="danger" v-for="error in errors['to_bank_account_id']" :key="error">{{ error }}</ion-text>
        </div>
      </div>
      <div v-else>
        <ion-item>
          <ion-label position="floating"> Bank Account </ion-label>
          <ion-select placeholder="Select" v-model="bank_account_id" interface="action-sheet">
            <ion-select-option v-for="bankAccount in this.$store.state.bankAccounts" :key="bankAccount.id" :value="bankAccount.id" :class="bankAccount.color">{{ bankAccount.name }}</ion-select-option>
          </ion-select>
        </ion-item>
        <div v-if="!!errors['bank_account_id']" class="ion-margin-bottom ion-margin-start">
          <ion-text color="danger" v-for="error in errors['bank_account_id']" :key="error">{{ error }}</ion-text>
        </div>
      </div>

      <ion-item>
        <ion-label position="floating"> Amount </ion-label>
        <ion-input type="number" v-model="amount" step="0.01" min="0.01">
        </ion-input>
      </ion-item>
      <div v-if="!!errors['amount']" class="ion-margin-bottom ion-margin-start">
        <ion-text color="danger" v-for="error in errors['amount']" :key="error">{{ error }}</ion-text>
      </div>

      <div v-if="type == 'Transfer'">
        <ion-item>
          <ion-label position="floating"> Fee </ion-label>
          <ion-input type="number" v-model="fee" step="0.01" min="0.01">
          </ion-input>
        </ion-item>
      </div>

      <ion-item>
        <ion-label position="floating"> Description </ion-label>
        <ion-input v-model="description"></ion-input>
      </ion-item>

      <ion-item>
        <ion-label position="floating"> DateTime </ion-label>
        <ion-datetime placeholder="Select" v-model="datetime"/>
      </ion-item>
      <div v-if="!!errors['datetime']" class="ion-margin-bottom ion-margin-start">
        <ion-text color="danger" v-for="error in errors['datetime']" :key="error">{{ error }}</ion-text>
      </div>

      <div class="action-end ion-padding">
        <ion-text class="ion-margin-end" @click="this.$router.push({path: '/transactions'})" >Cancel</ion-text>
        <ion-button type="submit"  @click="saveTransaction" color="primary">Save</ion-button>
      </div> 
    </ion-content>
  </ion-page>
</template>

<script >
import { toastController, IonText, IonSelectOption, IonSelect, IonDatetime, IonInput, IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonButtons, IonBackButton, IonButton, IonItem, IonLabel } from '@ionic/vue';
import { addCircle } from 'ionicons/icons';

export default  {
  name: 'TransactionForm',
  components: { IonText, IonSelectOption, IonSelect, IonDatetime, IonInput, IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonButtons, IonBackButton, IonButton, IonItem, IonLabel },
  setup() {
    return {
      addCircle,
    }
  },
  created: function () {
    this.initForm()
  },
  data: function () {
    return {
      errors: {}
    }
  },
  computed: {
    type: {
      get () {
        return this.$store.state.transaction.type
      },
      set (value) {
        this.$store.commit('setTransactionType', value)
      }
    },
    bank_account_id: {
      get () {
        return this.$store.state.transaction.bank_account_id
      },
      set (value) {
        this.$store.commit('setTransactionBankAccountId', value)
      }
    },
    description: {
      get () {
        return this.$store.state.transaction.description
      },
      set (value) {
        this.$store.commit('setTransactionDescription', value)
      }
    },
    amount: {
      get () {
        return this.$store.state.transaction.amount
      },
      set (value) {
        this.$store.commit('setTransactionAmount', value)
      }
    },
    fee: {
      get () {
        return this.$store.state.transaction.fee
      },
      set (value) {
        this.$store.commit('setTransactionFee', value)
      }
    },
    datetime: {
      get () {
        return this.$store.state.transaction.datetime
      },
      set (value) {
        this.$store.commit('setTransactionDatetime', value)
      }
    },
    category_id: {
      get () {
        return this.$store.state.transaction.category_id
      },
      set (value) {
        this.$store.commit('setTransactionCategoryId', value)
      }
    },
    to_bank_account_id: {
      get () {
        return this.$store.state.transaction.to_bank_account_id
      },
      set (value) {
        this.$store.commit('setTransactioToBankAccountId', value)
      }
    }
  },
  methods: {
    async showAlert(message, color) {
      const alert = await toastController
        .create({
          message: message,
          color: color,
          duration: 5000,
        })
      return alert.present()
    },
    saveTransaction: function () {
      if (this.$route.params.id != null) {
        this.updateTransaction()
      } else {
        this.createTransaction()
      }
    },
    updateTransaction: function () {
      const self = this
      const success = function (resp) {
        if (resp.errors && Object.keys(resp.errors).length) {
          self.showAlert("Transaction could not be updated. Please fix errors on the form.", "danger")
          self.errors = resp.errors
          console.log(resp.errors)
        } else {
          self.$router.push({path: '/transactions'})
        }
      }
      const error = function (err) {
        console.log(err)
      }
      this.$store.dispatch('updateTransaction', [success, error])
    },
    createTransaction: function () {
      const self = this
      const success = function (resp) {
        if (resp.errors && Object.keys(resp.errors).length) {
          self.showAlert("Transaction could not be created. Please fix errors on the form.", "danger")
          self.errors = resp.errors
          console.log(resp.errors)
        } else {
          self.$store.dispatch('fetchTransactions')
          self.$router.push({path: '/transactions'})
        }
      }
      const error = function (err) {
        console.log(err)
      }
      this.$store.dispatch('createTransaction', [success, error])
    },
    initForm: function () {
      this.$store.dispatch('fetchTransaction', this.$route.params.id)
      this.$store.dispatch('fetchTransactionTypes')
      this.$store.dispatch('fetchBankAccounts')
      this.$store.dispatch('fetchCategories')
      if (this.type == null) this.$store.commit('setTransactionType', 'Withdraw')
      if (this.datetime == null) this.$store.commit('setTransactionDatetime', (new Date().toISOString()))
    }
  },
  watch: {
    $route() {
      this.initForm()
    }
  }
}
</script>