<template>
  <ion-page>
    <ion-content :fullscreen="true" id="auth">
      <ion-grid>
        <a href="/" class="back-to-home">
          <small>back to home</small>
        </a>
        <ion-row class="ion-align-items-center ion-justify-content-center">
          <ion-col class="ion-margin-vertical" size-md="6" size-lg="4">
            <ion-text class="ion-text-center">
              <h1>
                </h1>
            </ion-text>
            <ion-card class="ion-margin-bottom">
              <ion-card-header>
                <ion-card-title class="ion-text-center"> My Account</ion-card-title>
              </ion-card-header>
              <ion-card-content>
                <div class="ion-margin-bottom ion-text-center" v-if="error != null">
                  <ion-text color="danger">{{ error }}</ion-text>
                </div>
                <ion-item>
                  <ion-label position="floating"> Email</ion-label>
                  <ion-input v-model="auth.email"/>
                </ion-item>
                <ion-item>
                  <ion-label position="floating"> Password</ion-label>
                  <ion-input v-model="auth.password" type="password"/>
                </ion-item>
                <div class="ion-margin-top">
                  <ion-button type="submit" @click="login" expand="block"> Sign In</ion-button>
                </div>
              </ion-card-content>
            </ion-card>
            <ion-text class="ion-text-center" color="dark">
              <p>
                Built with all the mights of 
                <a href="https://codehit.net"> CodeHit team</a>
                .
              </p>
            </ion-text>
          </ion-col>
        </ion-row>
      </ion-grid>
    </ion-content>
  </ion-page>
</template>

<script>
import {IonPage, IonContent, IonGrid, IonRow, IonCol, IonText, IonCard, IonCardContent, IonCardTitle, IonCardHeader, IonButton, IonItem, IonLabel, IonInput} from '@ionic/vue';
import { isAuthenticated } from '../../helper'

export default {
  components: {IonPage, IonContent, IonGrid, IonRow, IonCol, IonText, IonCard, IonCardContent, IonCardTitle, IonCardHeader, IonButton, IonItem, IonLabel, IonInput},
  name: 'login-item',
  data: function () {
    return {
      auth: {
        email: '',
        password: ''
      },
      error: null
    }
  },
  methods: {
    login: function () {
      const self = this
      const success = function () {
        if (isAuthenticated()) {
          self.$router.push({path: '/home'})
        } else {
          self.error = "Email or password is incorrect."
        }
      }
      this.$store.dispatch('login', [this.auth, success])
    }
  }
}
</script>

<style>
#auth::part(background) {
  background-image: linear-gradient( 135deg, #72EDF2 10%, #5151E5 100%);
}
#auth a {
  text-decoration: none;
  color: inherit;
}
.back-to-home {
  margin-left: 20px;
}
</style>
