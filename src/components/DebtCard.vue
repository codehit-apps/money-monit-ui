<template>
  <ion-card class="w-full">
    <ion-card-content>
      <div class="record-lines">
        <div class="record-line">
          <div class="label">Reference #</div>
          <div class="value">{{formatId(debt.id)}}</div>
        </div>
        <div class="record-line" v-if="isRecievable" >
          <div class="label">Debtor</div>
          <div class="value">{{userName(debt.debtor_id)}}</div>
        </div>
        <div class="record-line" v-else>
          <div class="label">Creditor</div>
          <div class="value">{{userName(debt.creditor_id)}}</div>
        </div>
        <div class="record-line">
          <div class="label">Amount</div>
          <div class="value">{{toPeso(debt.amount)}}</div>
        </div>
        <div class="record-line">
          <div class="label">Paid Amount</div>
          <div class="value">{{toPeso(debt.paid_amount)}}</div>
        </div>
        <div class="record-line">
          <div class="label">Amount Due</div>
          <div class="value">{{toPeso(amountDue(debt))}}</div>
        </div>
        <div class="record-line">
          <div class="label">{{ dateLabel }}</div>
          <div class="value">{{formatDate(debt.debited_at)}}</div>
        </div>
        <div class="record-line" v-if="debt.paid_at">
          <div class="label">Paid At</div>
          <div class="value">{{formatDate(debt.paid_at)}}</div>
        </div>
        <div class="record-line">
          <div class="label">Pending Payments</div>
          <div class="value"><ion-badge v-if="pendingPaymentCount > 0" color="danger">{{ pendingPaymentCount }}</ion-badge></div>
        </div>
        <div class="record-line">
          <div class="label">Notes</div>
          <div class="value">{{debt.notes}}</div>
        </div>
      </div>
    </ion-card-content>
  </ion-card>
</template>

<script>
import { findWhere, each } from 'underscore';
import { pesoFormatter, dateFormatter, pad } from '../helper'
import { IonCard, IonCardContent, IonBadge } from '@ionic/vue';

export default {
  name: 'DebtCard',
  components: {IonCard, IonCardContent, IonBadge},
  props: {
    debt: Object,
    mode: String,
  },
  created: function () {
    this.$store.dispatch('fetchUsers', [])
  },
  computed: {
    dateLabel: function () {
      return this.isRecievable ? "Debited at" : "Credited at"
    },
    isRecievable: function () {
      return this.mode == "recievable"
    },
    pendingPaymentCount: function () {
      let count = 0
      each(this.debt.debt_payments, function (item) {
        if (item.approved_at == null) count += 1
      })
      return count
    }
  },
  methods: {
    formatId: function (num) {
      return pad(num)
    },
    formatDate: function (date) {
      if (date == null || date == '') return null
      return dateFormatter().format(new Date(date))
    },
    amountDue: function (debt) {
      return debt.amount - debt.paid_amount
    },
    findUser: function (userId) {
      return findWhere(this.$store.state.users, {id: userId}) || {}
    },
    userName: function (userId) {
      const user = this.findUser(userId)
      return [user.first_name, user.last_name].join(' ')
    },
    toPeso: function (num) {
      return pesoFormatter().format(num)
    },
  }
}
</script>