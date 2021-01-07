<template>
  <ion-page>
    <ion-content :fullscreen="true">
      <section class="banner-section">
        <div class="container">
          <div class="row">
            <div class="col-sm pt-5">
              <div class="pt-5">
                <h1>moneyMonit</h1>
                <p contenteditable="false">Simple expenses & balance tracker accross bank accounts.</p>
                <ion-router-link href="/#/login" target="_self" class="btn btn-outline-secondary">My Account</ion-router-link>
              </div>
            </div>
            <div class="col-sm-6">
              <div class="pt-5">
                <a href="/assets/img/moneymonit.png" data-fancybox="moneymonit-images">
                  <div class="banner">
                    <img src="/assets/img/moneymonit.png" alt="moneyMonit" class="img-fluid">
                  </div>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
      <div class="container">
        <section>
          <h3 class="mt-5">Screenshots</h3>
          <div class="row text-center">
            <div class="col-sm-6 col-md-4 col-xl-3 mb-3">
              <div class="img-thumbnail mb-3">
                <a href="/assets/img/moneymonit/1.png" data-fancybox="moneymonit-images">
                  <div style="overflow:hidden;height:130px;" class="text-center">
                    <img src="/assets/img/moneymonit/1.png" alt="" class="img-fluid">
                  </div>
                </a>
              </div>
            </div>
            <div class="col-sm-6 col-md-4 col-xl-3 mb-3">
              <div class="img-thumbnail mb-3">
                <a href="/assets/img/moneymonit/2.png" data-fancybox="moneymonit-images">
                  <div style="overflow:hidden;height:130px;" class="text-center">
                    <img src="/assets/img/moneymonit/2.png" alt="" class="img-fluid">
                  </div>
                </a>
              </div>
            </div>
            <div class="col-sm-6 col-md-4 col-xl-3 mb-3">
              <div class="img-thumbnail mb-3">
                <a href="/assets/img/moneymonit/3.png" data-fancybox="moneymonit-images">
                  <div style="overflow:hidden;height:130px;" class="text-center">
                    <img src="/assets/img/moneymonit/3.png" alt="" class="img-fluid">
                  </div>
                </a>
              </div>
            </div>
            <div class="col-sm-6 col-md-4 col-xl-3 mb-3">
              <div class="img-thumbnail mb-3">
                <a href="/assets/img/moneymonit/4.png" data-fancybox="moneymonit-images">
                  <div style="overflow:hidden;height:130px;" class="text-center">
                    <img src="/assets/img/moneymonit/4.png" alt="" class="img-fluid">
                  </div>
                </a>
              </div>
            </div>
            <div class="col-sm-6 col-md-4 col-xl-3 mb-3">
              <div class="img-thumbnail mb-3">
                <a href="/assets/img/moneymonit/5.png" data-fancybox="moneymonit-images">
                  <div style="overflow:hidden;height:130px;" class="text-center">
                    <img src="/assets/img/moneymonit/5.png" alt="" class="img-fluid">
                  </div>
                </a>
              </div>
            </div>
            <div class="col-sm-6 col-md-4 col-xl-3 mb-3">
              <div class="img-thumbnail mb-3">
                <a href="/assets/img/moneymonit/6.png" data-fancybox="moneymonit-images">
                  <div style="overflow:hidden;height:130px;" class="text-center">
                    <img src="/assets/img/moneymonit/6.png" alt="" class="img-fluid">
                  </div>
                </a>
              </div>
            </div>
            <div class="col-sm-6 col-md-4 col-xl-3 mb-3">
              <div class="img-thumbnail mb-3">
                <a href="/assets/img/moneymonit/7.png" data-fancybox="moneymonit-images">
                  <div style="overflow:hidden;height:130px;" class="text-center">
                    <img src="/assets/img/moneymonit/7.png" alt="" class="img-fluid">
                  </div>
                </a>
              </div>
            </div>
            <div class="col-sm-6 col-md-4 col-xl-3 mb-3">
              <div class="img-thumbnail mb-3">
                <a href="/assets/img/moneymonit/8.png" data-fancybox="moneymonit-images">
                  <div style="overflow:hidden;height:130px;" class="text-center">
                    <img src="/assets/img/moneymonit/8.png" alt="" class="img-fluid">
                  </div>
                </a>
              </div>
            </div>
          </div>
        </section>
      </div>
      <Footer/>
    </ion-content>
  </ion-page>
</template>

<script>

import Footer from '@/components/Footer.vue'
import { IonPage, IonContent, IonRouterLink } from '@ionic/vue'

export default {
  name: 'moneyMonit',
  components: {Footer, IonPage, IonContent, IonRouterLink},
}
</script>

<style>
  .banner-section {
    background:#f8f9fa url('/assets/img/cityscape.png') no-repeat center bottom;
  }
  .banner {
    overflow: hidden;
    height: 350px;
    text-align: center;
    box-shadow: -2px 2px 7px -1px rgba(0,0,0,0.2);
  }
</style>