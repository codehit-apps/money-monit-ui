<template>
  <ion-page>
    <ion-content :fullscreen="true">
      <section class="banner-section">
        <div class="container">
          <div class="row">
            <div class="col-sm pt-5">
              <div class="pt-5">
                <h1>moneyMonit</h1>
                <p>Easily track your current balance on all your bank accounts, wallets including cash on hand.</p>
                <router-link to="/login" class="btn btn-outline-secondary">My Account</router-link>
              </div>
            </div>
            <div class="col-sm-6">
              <div class="pt-5">
                <a href="/assets/img/moneymonit.png" data-fancybox="moneymonit-images">
                  <div class="merp-banner">
                    <img src="/assets/img/moneymonit.png" alt="actMonit" class="img-fluid">
                  </div>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
      <div class="container">
        <section>
          <h3 class="mt-5">Features</h3>
          <p>Stay updated on your current balance to better plan your financial spendings.</p>
          <div class="row">
            <div class="col-sm-6 col-md-4 col-xl-3 mb-3">
              <div class="img-thumbnail mb-3">
                <a href="/assets/img/moneymonit/1.png" data-fancybox="moneymonit-images">
                  <div style="overflow:hidden;height:130px;" class="text-center">
                    <img src="/assets/img/moneymonit/1.png" alt="" class="img-fluid">
                  </div>
                </a>
              </div>
              <a href="/assets/img/moneymonit/1.png" data-fancybox="moneymonit-images">
                <h3 class="h5 mb-1">Reports</h3>
              </a>
              <p class="text-muted">Monitor your budget expenses, get notified with over expenses.</p>
            </div>
            <div class="col-sm-6 col-md-4 col-xl-3 mb-3">
              <div class="img-thumbnail mb-3">
                <a href="/assets/img/moneymonit/2.png" data-fancybox="moneymonit-images">
                  <div style="overflow:hidden;height:130px;" class="text-center">
                    <img src="/assets/img/moneymonit/2.png" alt="" class="img-fluid">
                  </div>
                </a>
              </div>
              <a href="/assets/img/moneymonit/2.png" data-fancybox="moneymonit-images">
                <h3 class="h5 mb-1">Transactions</h3>
              </a>
              <p class="text-muted">Manage your transactions per account, category and date.</p>
            </div>
            <div class="col-sm-6 col-md-4 col-xl-3 mb-3">
              <div class="img-thumbnail mb-3">
                <a href="/assets/img/moneymonit/3.png" data-fancybox="moneymonit-images">
                  <div style="overflow:hidden;height:130px;" class="text-center">
                    <img src="/assets/img/moneymonit/3.png" alt="" class="img-fluid">
                  </div>
                </a>
              </div>
              <a href="/assets/img/moneymonit/3.png" data-fancybox="moneymonit-images">
                <h3 class="h5 mb-1">Accounts</h3>
              </a>
              <p class="text-muted">Manage your accounts and link them to your transactions.</p>
            </div>
            <div class="col-sm-6 col-md-4 col-xl-3 mb-3">
              <div class="img-thumbnail mb-3">
                <a href="/assets/img/moneymonit/4.png" data-fancybox="moneymonit-images">
                  <div style="overflow:hidden;height:130px;" class="text-center">
                    <img src="/assets/img/moneymonit/4.png" alt="" class="img-fluid">
                  </div>
                </a>
              </div>
              <a href="/assets/img/moneymonit/4.png" data-fancybox="moneymonit-images">
                <h3 class="h5 mb-1">Budgets</h3>
              </a>
              <p class="text-muted">Create your budgets, track multiple categories, set limits per category.</p>
            </div>
            <div class="col-sm-6 col-md-4 col-xl-3 mb-3">
              <div class="img-thumbnail mb-3">
                <a href="/assets/img/moneymonit/5.png" data-fancybox="moneymonit-images">
                  <div style="overflow:hidden;height:130px;" class="text-center">
                    <img src="/assets/img/moneymonit/5.png" alt="" class="img-fluid">
                  </div>
                </a>
              </div>
              <a href="/assets/img/moneymonit/5.png" data-fancybox="moneymonit-images">
                <h3 class="h5 mb-1">Categories</h3>
              </a>
              <p class="text-muted">Manage your transaction categories and use them to track your budgets.</p>
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
import { IonPage, IonContent } from '@ionic/vue'

export default {
  name: 'money-monit',
  components: {Footer, IonPage, IonContent},
}
</script>

<style>
  .banner-section {
    background:#f8f9fa url('assets/img/cityscape.png') no-repeat center bottom;
  }
  .merp-banner {
    overflow: hidden;
    height: 350px;
    text-align: center;
    box-shadow: -2px 2px 7px -1px rgba(0,0,0,0.2);
  }
</style>