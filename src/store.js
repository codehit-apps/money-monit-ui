import { createStore } from 'vuex'

import { markAuthenticated, authToken, logout, api, env, apiHeaders, dupObj } from './helper'
import contains from 'underscore/modules/contains'
import values from 'underscore/modules/values'
import isEmpty from 'underscore/modules/isEmpty'
import findWhere from 'underscore/modules/findWhere'
import { formatInTimeZone } from 'date-fns-tz'

const MONEY_MONIT_USER_REFS = 1000
const DEFAULTS = {
  category: {
    name: '',
    description: ''
  },
  bankAccount: {
    name: '',
    description: '',
    color: ''
  },
  user: {
    first_name: '',
    last_name: '',
    email: '',
    password: ''
  },
  transaction: {
    type: 'Withdraw',
    account_id: '',
    description: '',
    amount: '',
    fee: 0,
    datetime: formatInTimeZone(new Date(), 'Asia/Manila', "yyyy-MM-dd HH:mm").split(' ').join('T'),
    category_id: '',
    to_account_id: ''
  },
  budget: {
    name: '',
    from_date: '',
    to_date: '',
    active: true,
    budget_lines: []
  },
  budgetLine: {
    budget_id: '',
    category_id: '',
    amount: ''
  },
  debt: {
    notes: '',
    debited_at: '',
    debtor_id: '',
    creditor_id: '',
    amount: ''
  },
  paymentLine: {
    creditor: '',
    paid_at: '',
    notes: '',
    amount: ''
  }
}

export default createStore({
  state: {
    isLoading: false,
    _loadingLog: {},
    categories: [],
    category: dupObj(DEFAULTS.category),
    bankAccounts: [],
    bankAccount: dupObj(DEFAULTS.bankAccount),
    transactions: [],
    transaction: dupObj(DEFAULTS.transaction),
    transactionTypes: [],
    users: [],
    user: dupObj(DEFAULTS.user),
    budgets: [],
    budget: dupObj(DEFAULTS.budget),
    debts: [],
    debt: dupObj(DEFAULTS.debt),
    debt_payment: {},
    currentUser: {},
    budget_line: dupObj(DEFAULTS.budgetLine),
    transactionsNextPage: 1,
  },
  mutations: {
    setTransactionsNextPage (state, value) {
      state.transactionsNextPage = value
    },
    setBudgetLine (state, value) {
      state.budget_line = value
    },
    setBudgetLineCategoryId (state, value) {
      state.budget_line.category_id = value
    },
    setBudgetLineAmount (state, value) {
      state.budget_line.amount = value
    },
    setPaymentLinePaidAt (state, value) {
      state.debt_payment.paid_at = value
    },
    setPaymentLineNotes (state, value) {
      state.debt_payment.notes = value
    },
    setPaymentLineAmount (state, value) {
      state.debt_payment.amount = value
    },
    setPaymentLine (state, value) {
      state.debt_payment = value
    },
    setCategories (state, items) {
      state.categories = items
    },
    setCategory (state, item) {
      state.category = item
    },
    setCategoryName (state, value) {
      state.category.name = value
    },
    setCategoryDescription (state, value) {
      state.category.description = value
    },
    setBankAccounts (state, items) {
      state.bankAccounts = items
    },
    setBankAccount (state, item) {
      state.bankAccount = item
    },
    setBankAccountName (state, value) {
      state.bankAccount.name = value
    },
    setBankAccountColor (state, value) {
      state.bankAccount.color = value
    },
    setBankAccountDescription (state, value) {
      state.bankAccount.description = value
    },
    setTransactions (state, items) {
      state.transactions = items
    },
    setBudgets (state, items) {
      state.budgets = items
    },
    setDebts (state, items) {
      state.debts = items
    },
    setDebt (state, item) {
      state.debt = item
    },
    setBudgetName (state, value) {
      state.budget.name = value
    },
    setBudgetFromDate (state, value) {
      state.budget.from_date = value
    },
    setBudgetToDate (state, value) {
      state.budget.to_date = value
    },
    setBudgetActive (state, value) {
      state.budget.active = value
    },
    setBudget (state, item) {
      state.budget = item
    },
    setTransactionTypes (state, items) {
      state.transactionTypes = items
    },
    setTransaction (state, item) {
      state.transaction = item
    },
    setTransactionType (state, value) {
      state.transaction.type = value
    },
    setTransactionBankAccountId (state, value) {
      state.transaction.account_id = value
    },
    setTransactioToBankAccountId (state, value) {
      state.transaction.to_account_id = value
    },
    setTransactionDescription (state, value) {
      state.transaction.description = value
    },
    setTransactionAmount (state, value) {
      state.transaction.amount = value
    },
    setTransactionFee (state, value) {
      state.transaction.fee = value
    },
    setTransactionDatetime (state, value) {
      state.transaction.datetime = value
    },
    setTransactionCategoryId (state, value) {
      state.transaction.category_id = value
    },
    setUsers (state, items) {
      state.users = items
    },
    setUser (state, item) {
      state.user = item
    },
    setCurrentUser (state, item) {
      state.currentUser = item
    },
    setUserRefId (state) {
      state.user.ref_id = MONEY_MONIT_USER_REFS
    },
    setUserFirstName (state, value) {
      state.user.first_name = value
    },
    setUserLastName (state, value) {
      state.user.last_name = value
    },
    setUserEmail (state, value) {
      state.user.email = value
    },
    setUserPassword (state, value) {
      state.user.password = value
    },
    setDebtDebtorId (state, value) {
      state.debt.debtor_id = value
    },
    setDebtCreditorId (state, value) {
      state.debt.creditor_id = value
    },
    setDebtNotes (state, value) {
      state.debt.notes = value
    },
    setDebtAmount (state, value) {
      state.debt.amount = value
    },
    setDebtDebitedAt (state, value) {
      state.debt.debited_at = value
    },
    hideLoader (state, ref) {
      state._loadingLog[ref] = false
      state.isLoading = contains(values(state._loadingLog), true)
    },
    showLoader (state, ref) {
      state._loadingLog[ref] = true
      state.isLoading = contains(values(state._loadingLog), true)
    },
  },
  actions: {
    login (context, opts) {
      const [auth, onSuccess] = opts
      fetch(`${env("VUE_APP_API_URL")}/v1/login`, {
        method: "POST",
        headers: apiHeaders('USERS'),
        body: JSON.stringify(auth)
      })
      .then(resp => resp.json())
      .then(function(resp) {
        if (resp.token != null) {
          markAuthenticated(resp.token)
          context.commit('setCurrentUser', resp.user)
        }
        onSuccess()
      })
    },
    fetchCurrentUser (context) {
      const { state } = context
      if (!isEmpty(state.currentUser)) return false
      context.commit('showLoader', 'fetchCurrentUser')
      fetch(`${env("VUE_APP_API_URL")}/v1/user`, {
        method: "GET",
        headers: apiHeaders('USERS')
      })
      .then(resp => resp.json())
      .then(function(item) {
        context.commit('setCurrentUser', item)
      }).finally(function () {
        context.commit('hideLoader', 'fetchCurrentUser')
      })
    },
    fetchCategories (context, opts) {
      const [onSuccess, query] = opts
      let params = ''
      if (query != null) {
        params = Object.keys(query).map(function(key){ 
          return encodeURIComponent(key) + '=' + encodeURIComponent(query[key])
        }).join('&')
      }
      const apiUrl = params == '' ? '/v1/categories' : `/v1/categories?${params}`
      context.commit('showLoader', 'fetchCategories')
      fetch(api(apiUrl), {
        method: "GET",
        headers: apiHeaders('CATEGORIES')
      })
      .then(resp => resp.json())
      .then(function(items) {
        context.commit('setCategories', items)
        if (onSuccess != null) onSuccess()
      }).finally(function () {
        context.commit('hideLoader', 'fetchCategories')
      })
    },
    fetchCategory (context, categoryId) {
      if (!categoryId){
        context.commit('setCategory', dupObj(DEFAULTS.category))
        return false
      }
      const { state } = context
      if (state.categories.length) {
        let item = state.categories.find((item) => { return item.id == categoryId })
        context.commit('setCategory', item)
      } else {
        context.commit('showLoader', 'fetchCategory')
        fetch(api(`/v1/categories/${categoryId}`), {
          method: "GET",
          headers: apiHeaders('CATEGORIES')
        })
        .then(resp => resp.json())
        .then(function(item) {
          context.commit('setCategory', item)
        }).finally(function () {
          context.commit('hideLoader', 'fetchCategory')
        })
      }
    },
    updateCategory (context, opts) {
      const { state } = context
      const [onSuccess, onError] = opts
      context.commit('showLoader', 'updateCategory')
      fetch(api(`/v1/categories/${state.category.id}`), {
        method: "PUT",
        headers: apiHeaders('CATEGORIES'),
        body: JSON.stringify({
          category: state.category
        })
      })
      .then(resp => resp.json())
      .then(onSuccess)
      .catch(onError)
      .finally(function () {
        context.commit('hideLoader', 'updateCategory')
      })
    },
    createCategory (context, opts) {
      const { state } = context
      const [onSuccess, onError] = opts
      context.commit('showLoader', 'createCategory')
      fetch(api(`/v1/categories`), {
        method: "POST",
        headers: apiHeaders('CATEGORIES'),
        body: JSON.stringify({
          category: state.category
        })
      })
      .then(resp => resp.json())
      .then(onSuccess)
      .catch(onError)
      .finally(function () {
        context.commit('hideLoader', 'createCategory')
      })
    },
    deleteCategory (context, opts) {
      const [categoryId, onSuccess, onError] = opts
      context.commit('showLoader', 'deleteCategory')
      fetch(api(`/v1/categories/${categoryId}`), {
        method: "DELETE",
        headers: apiHeaders('CATEGORIES'),
      })
      .then(onSuccess)
      .catch(onError)
      .finally(function () {
        context.commit('hideLoader', 'deleteCategory')
      })
    },
    fetchDebts (context, opts) {
      const [onSuccess, query] = opts
      let params = ''
      if (query != null) {
        params = Object.keys(query).map(function(key){ 
          return encodeURIComponent(key) + '=' + encodeURIComponent(query[key])
        }).join('&')
      }
      const apiUrl = params == '' ? '/v1/debts' : `/v1/debts?${params}`
      context.commit('showLoader', 'fetchDebts')
      fetch(api(apiUrl), {
        method: "GET",
        headers: apiHeaders('DEBTS')
      })
      .then(resp => resp.json())
      .then(function(items) {
        context.commit('setDebts', items)
        if(onSuccess != null) onSuccess()
      })
      .finally(function () {
        context.commit('hideLoader', 'fetchDebts')
      })
    },
    fetchDebt (context, debtId) {
      if (!debtId){
        context.commit('setDebt', dupObj(DEFAULTS.debt))
        return false
      }
      const { state } = context
      if (state.debts.length) {
        let item = state.debts.find((item) => { return item.id == debtId })
        context.commit('setDebt', item)
      } else {
        context.dispatch('reloadDebt', debtId)
      }
    },
    updateDebt (context, opts) {
      const { state } = context
      const [onSuccess, onError] = opts
      context.commit('showLoader', 'updateDebt')
      fetch(api(`/v1/debts/${state.debt.id}`), {
        method: "PUT",
        headers: apiHeaders('DEBTS'),
        body: JSON.stringify({
          debt: state.debt
        })
      })
      .then(resp => resp.json())
      .then(onSuccess)
      .catch(onError)
      .finally(function () {
        context.commit('hideLoader', 'updateDebt')
      })
    },
    createDebt (context, opts) {
      const { state } = context
      const [onSuccess, onError] = opts
      context.commit('showLoader', 'createDebt')
      fetch(api(`/v1/debts`), {
        method: "POST",
        headers: apiHeaders('DEBTS'),
        body: JSON.stringify({
          debt: state.debt
        })
      })
      .then(resp => resp.json())
      .then(onSuccess)
      .catch(onError)
      .finally(function () {
        context.commit('hideLoader', 'createDebt')
      })
    },
    deleteDebt (context, opts) {
      const [debtId, onSuccess, onError] = opts
      context.commit('showLoader', 'deleteDebt')
      fetch(api(`/v1/debts/${debtId}`), {
        method: "DELETE",
        headers: apiHeaders('DEBTS'),
      })
      .then(onSuccess)
      .catch(onError)
      .finally(function () {
        context.commit('hideLoader', 'deleteDebt')
      })
    },
    savePaymentLine (context, opts) {
      const { state } = context
      const [onSuccess, onError] = opts
      context.commit('showLoader', 'savePaymentLine')
      let path = '/v1/debt_payments'
      let method = 'POST'
      let line = this.state.debt_payment
      if (line.id != null) {
        path = `/v1/debt_payments/${line.id}`
        method = 'PUT'
      }
      line.debt_id = state.debt.id
      fetch(api(path), {
        method: method,
        headers: apiHeaders('DEBTS'),
        body: JSON.stringify({
          debt_payment: line
        })
      })
      .then(resp => resp.json())
      .then(onSuccess)
      .catch(onError)
      .finally(function () {
        context.commit('hideLoader', 'savePaymentLine')
      })
    },
    resetPaymentLine (context) {
      let line = dupObj(DEFAULTS.paymentLine)
      line.debt_id = this.state.debt.id
      context.commit('setPaymentLine', line)
    },
    fetchPaymentLine (context, opts) {
      const [debtId, paymentLineId] = opts
      const { state } = context
      context.commit('showLoader', 'fetchDebt')
      fetch(api(`/v1/debts/${debtId}`), {
        method: "GET",
        headers: apiHeaders('DEBTS')
      })
      .then(resp => resp.json())
      .then(function(item) {
        const line = item.debt_payments.find((item) => { return item.id == paymentLineId }) || dupObj(DEFAULTS.paymentLine)
        if (paymentLineId == null) {
          line.debt_id = item.id
          item.debt_payments.push(line)
        }
        context.commit('setPaymentLine', line)
        context.commit('setDebt', item)
      })
      .finally(function () {
        context.commit('hideLoader', 'fetchDebt')
      })
    },
    deleteDebtLine (context, opts) {
      const [debtId, lineId, onSuccess, onError] = opts
      context.commit('showLoader', 'deleteDebtLine')
      fetch(api(`/v1/debts/${debtId}/debt_payments/${lineId}`), {
        method: "DELETE",
        headers: apiHeaders('DEBTS'),
      })
      .then(onSuccess)
      .catch(onError)
      .finally(function () {
        context.commit('hideLoader', 'deleteDebtLine')
      })
    },
    reloadDebt (context, debtId) {
      if (debtId == null) return false
      context.commit('showLoader', 'reloadDebt')
      fetch(api(`/v1/debts/${debtId}`), {
        method: "GET",
        headers: apiHeaders('DEBTS')
      })
      .then(resp => resp.json())
      .then(function(item) {
        context.commit('setDebt', item)
      })
      .finally(function () {
        context.commit('hideLoader', 'reloadDebt')
      })
    },
    deletePaymentLine (context, opts) {
      const [debtId, lineId, onSuccess, onError] = opts
      context.commit('showLoader', 'deletePaymentLine')
      fetch(api(`/v1/debt_payments/${lineId}`), {
        method: "DELETE",
        headers: apiHeaders('DEBTS'),
      })
      .then(onSuccess)
      .catch(onError)
      .finally(function () {
        context.commit('hideLoader', 'deletePaymentLine')
      })
    },
    acceptPayment (context, opts) {
      const [debtId, lineId, onSuccess, onError] = opts
      context.commit('showLoader', 'acceptPayment')
      fetch(api(`/v1/debt_payments/${lineId}/approve`), {
        method: "POST",
        headers: apiHeaders('DEBTS'),
      })
      .then(onSuccess)
      .catch(onError)
      .finally(function () {
        context.commit('hideLoader', 'acceptPayment')
      })
    },
    fetchBankAccounts (context, opts) {
      const [onSuccess, query] = opts
      let params = ''
      if (query != null) {
        params = Object.keys(query).map(function(key){ 
          return encodeURIComponent(key) + '=' + encodeURIComponent(query[key])
        }).join('&')
      }
      const apiUrl = params == '' ? '/v1/accounts' : `/v1/accounts?${params}`
      context.commit('showLoader', 'fetchBankAccounts')
      fetch(api(apiUrl), {
        method: "GET",
        headers: apiHeaders('BANK_ACCOUNTS')
      })
      .then(resp => resp.json())
      .then(function(items) {
        context.commit('setBankAccounts', items)
        if(onSuccess != null) onSuccess()
      })
      .finally(function () {
        context.commit('hideLoader', 'fetchBankAccounts')
      })
    },
    fetchBankAccount (context, bankAccountId) {
      if (!bankAccountId){
        context.commit('setBankAccount', dupObj(DEFAULTS.bankAccount))
        return false
      }
      const { state } = context
      if (state.bankAccounts.length) {
        let item = state.bankAccounts.find((item) => { return item.id == bankAccountId })
        context.commit('setBankAccount', item)
      } else {
        context.commit('showLoader', 'fetchBankAccount')
        fetch(api(`/v1/accounts/${bankAccountId}`), {
          method: "GET",
          headers: apiHeaders('BANK_ACCOUNTS')
        })
        .then(resp => resp.json())
        .then(function(item) {
          context.commit('setBankAccount', item)
        })
        .finally(function () {
          context.commit('hideLoader', 'fetchBankAccount')
        })
      }
    },
    updateBankAccount (context, opts) {
      const { state } = context
      const [onSuccess, onError] = opts
      context.commit('showLoader', 'updateBankAccount')
      fetch(api(`/v1/accounts/${state.bankAccount.id}`), {
        method: "PUT",
        headers: apiHeaders('BANK_ACCOUNTS'),
        body: JSON.stringify({
          account: state.bankAccount
        })
      })
      .then(resp => resp.json())
      .then(onSuccess)
      .catch(onError)
      .finally(function () {
        context.commit('hideLoader', 'updateBankAccount')
      })
    },
    createBankAccount (context, opts) {
      const { state } = context
      const [onSuccess, onError] = opts
      context.commit('showLoader', 'createBankAccount')
      fetch(api(`/v1/accounts`), {
        method: "POST",
        headers: apiHeaders('BANK_ACCOUNTS'),
        body: JSON.stringify({
          account: state.bankAccount
        })
      })
      .then(resp => resp.json())
      .then(onSuccess)
      .catch(onError)
      .finally(function () {
        context.commit('hideLoader', 'createBankAccount')
      })
    },
    deleteBankAccount (context, opts) {
      const [bankAccountId, onSuccess, onError] = opts
      context.commit('showLoader', 'deleteBankAccount')
      fetch(api(`/v1/accounts/${bankAccountId}`), {
        method: "DELETE",
        headers: apiHeaders('BANK_ACCOUNTS'),
      })
      .then(onSuccess)
      .catch(onError)
      .finally(function () {
        context.commit('hideLoader', 'deleteBankAccount')
      })
    },
    fetchUsers (context, opts) {
      const [onSuccess, query] = opts
      let params = ''
      if (query != null) {
        params = Object.keys(query).map(function(key){ 
          return encodeURIComponent(key) + '=' + encodeURIComponent(query[key])
        }).join('&')
      }
      const apiUrl = params == '' ? '/v1/users' : `/v1/users?${params}`
      context.commit('showLoader', 'fetchUsers')
      fetch(api(apiUrl), {
        method: "GET",
        headers: apiHeaders('USERS')
      })
      .then(resp => resp.json())
      .then(function(items) {
        context.commit('setUsers', items)
        if (onSuccess != null) onSuccess()
      })
      .finally(function () {
        context.commit('hideLoader', 'fetchUsers')
      })
    },
    fetchUser (context, userId) {
      if (!userId){
        context.commit('setUser', dupObj(DEFAULTS.user))
        return false
      }
      const { state } = context
      if (state.users.length) {
        let item = state.users.find((item) => { return item.id == userId })
        context.commit('setUser', item)
      } else {
        context.commit('showLoader', 'fetchUser')
        fetch(api(`/v1/users/${userId}`), {
          method: "GET",
          headers: apiHeaders('USERS')
        })
        .then(resp => resp.json())
        .then(function(item) {
          context.commit('setUser', item)
        })
        .finally(function () {
          context.commit('hideLoader', 'fetchUser')
        })
      }
    },
    updateUser (context, opts) {
      const { state } = context
      const [onSuccess, onError] = opts
      context.commit('showLoader', 'updateUser')
      fetch(api(`/v1/users/${state.user.id}`), {
        method: "PUT",
        headers: apiHeaders('USERS'),
        body: JSON.stringify({
          user: state.user
        })
      })
      .then(resp => resp.json())
      .then(onSuccess)
      .catch(onError)
      .finally(function () {
        context.commit('hideLoader', 'updateUser')
      })
    },
    createUser (context, opts) {
      const { state } = context
      const [onSuccess, onError] = opts
      context.commit('showLoader', 'createUser')
      fetch(api(`/v1/users`), {
        method: "POST",
        headers: apiHeaders('USERS'),
        body: JSON.stringify({
          user: state.user
        })
      })
      .then(resp => resp.json())
      .then(onSuccess)
      .catch(onError)
      .finally(function () {
        context.commit('hideLoader', 'createUser')
      })
    },
    deleteUser (context, opts) {
      const [userId, onSuccess, onError] = opts
      context.commit('showLoader', 'deleteUser')
      fetch(api(`/v1/users/${userId}`), {
        method: "DELETE",
        headers: apiHeaders('USERS'),
      })
      .then(onSuccess)
      .catch(onError)
      .finally(function () {
        context.commit('hideLoader', 'deleteUser')
      })
    },
    fetchTransactions (context, opts) {
      const {state} = context
      const [query, onSuccess, appendResult] = opts
      let params = ''
      if (query != null) {
        query['page'] = state.transactionsNextPage
        params = new URLSearchParams(query)
        params = params.toString()
      }
      const apiUrl = params == '' ? '/v1/transactions' : `/v1/transactions?${params}`
      context.commit('showLoader', 'fetchTransactions')
      fetch(api(apiUrl), {
        method: "GET",
        headers: apiHeaders('TRANSACTIONS')
      })
      .then(resp => resp.json())
      .then(function(resp) {
        let result = resp.items
        if (appendResult != null && appendResult) {
          result = {
            ...state.transactions,
            ...result
          }
        }
        context.commit('setTransactions', result)
        context.commit('setTransactionsNextPage', resp.next_page)
        if (onSuccess != undefined) onSuccess()
      })
      .finally(function () {
        context.commit('hideLoader', 'fetchTransactions')
      })
    },
    fetchTransactionTypes (context) {
      context.commit('showLoader', 'fetchTransactionTypes')
      fetch(api('/v1/transactions/types_for_select'), {
        method: "GET",
        headers: apiHeaders('TRANSACTIONS')
      })
      .then(resp => resp.json())
      .then(function(items) {
        context.commit('setTransactionTypes', items)
      })
      .finally(function () {
        context.commit('hideLoader', 'fetchTransactionTypes')
      })
    },
    fetchTransaction (context, transactionId) {
      if (!transactionId){
        context.commit('setTransaction', dupObj(DEFAULTS.transaction))
        return false
      }
      const { state } = context
      if (state.transactions.length) {
        let item = state.transactions.find((item) => { return item.id == transactionId })
        context.commit('setTransaction', item)
      } else {
        context.commit('showLoader', 'fetchTransaction')
        fetch(api(`/v1/transactions/${transactionId}`), {
          method: "GET",
          headers: apiHeaders('TRANSACTIONS')
        })
        .then(resp => resp.json())
        .then(function(item) {
          context.commit('setTransaction', item)
        })
        .finally(function () {
          context.commit('hideLoader', 'fetchTransaction')
        })
      }
    },
    updateTransaction (context, opts) {
      const { state } = context
      const [onSuccess, onError] = opts
      context.commit('showLoader', 'updateTransaction')
      fetch(api(`/v1/transactions/${state.transaction.id}`), {
        method: "PUT",
        headers: apiHeaders('TRANSACTIONS'),
        body: JSON.stringify({
          transaction: state.transaction
        })
      })
      .then(resp => resp.json())
      .then(onSuccess)
      .catch(onError)
      .finally(function () {
        context.commit('hideLoader', 'updateTransaction')
      })
    },
    createTransaction (context, opts) {
      const { state } = context
      const [onSuccess, onError] = opts
      context.commit('showLoader', 'createTransaction')
      fetch(api(`/v1/transactions`), {
        method: "POST",
        headers: apiHeaders('TRANSACTIONS'),
        body: JSON.stringify({
          transaction: state.transaction
        })
      })
      .then(resp => resp.json())
      .then(onSuccess)
      .catch(onError)
      .finally(function () {
        context.commit('hideLoader', 'createTransaction')
      })
    },
    deleteTransaction (context, opts) {
      const [transactionId, onSuccess, onError] = opts
      context.commit('showLoader', 'deleteTransaction')
      fetch(api(`/v1/transactions/${transactionId}`), {
        method: "DELETE",
        headers: apiHeaders('TRANSACTIONS'),
      })
      .then(onSuccess)
      .catch(onError)
      .finally(function () {
        context.commit('hideLoader', 'deleteTransaction')
      })
    },
    fetchBudgets (context, opts) {
      const [onSuccess, query] = opts
      let params = ''
      if (query != null) {
        params = Object.keys(query).map(function(key){ 
          return encodeURIComponent(key) + '=' + encodeURIComponent(query[key])
        }).join('&')
      }
      const apiUrl = params == '' ? '/v1/budgets' : `/v1/budgets?${params}`
      context.commit('showLoader', 'fetchBudgets')
      fetch(api(apiUrl), {
        method: "GET",
        headers: apiHeaders('BUDGETS')
      })
      .then(resp => resp.json())
      .then(function(items) {
        context.commit('setBudgets', items)
        if (onSuccess != null) onSuccess()
      })
      .finally(function () {
        context.commit('hideLoader', 'fetchBudgets')
      })
    },
    reloadBudget (context, budgetId) {
      if (budgetId == null) return false
      context.commit('showLoader', 'reloadBudget')
      fetch(api(`/v1/budgets/${budgetId}`), {
        method: "GET",
        headers: apiHeaders('BUDGETS')
      })
      .then(resp => resp.json())
      .then(function(item) {
        context.commit('setBudget', item)
      })
      .finally(function () {
        context.commit('hideLoader', 'reloadBudget')
      })
    },
    fetchBudget (context, budgetId) {
      if (!budgetId){
        context.commit('setBudget', dupObj(DEFAULTS.budget))
        return false
      }
      const { state } = context
      if (state.budgets.length) {
        let item = state.budgets.find((item) => { return item.id == budgetId })
        context.commit('setBudget', item)
      } else {
        context.dispatch('reloadBudget', budgetId)
      }
    },
    updateBudget (context, opts) {
      const { state } = context
      const [onSuccess, onError] = opts
      context.commit('showLoader', 'updateBudget')
      fetch(api(`/v1/budgets/${state.budget.id}`), {
        method: "PUT",
        headers: apiHeaders('BUDGETS'),
        body: JSON.stringify({
          budget: state.budget
        })
      })
      .then(resp => resp.json())
      .then(onSuccess)
      .catch(onError)
      .finally(function () {
        context.commit('hideLoader', 'updateBudget')
      })
    },
    createBudget (context, opts) {
      const { state } = context
      const [onSuccess, onError] = opts
      context.commit('showLoader', 'createBudget')
      fetch(api(`/v1/budgets`), {
        method: "POST",
        headers: apiHeaders('BUDGETS'),
        body: JSON.stringify({
          budget: state.budget
        })
      })
      .then(resp => resp.json())
      .then(onSuccess)
      .catch(onError)
      .finally(function () {
        context.commit('hideLoader', 'createBudget')
      })
    },
    deleteBudget (context, opts) {
      const [budgetId, onSuccess, onError] = opts
      context.commit('showLoader', 'deleteBudget')
      fetch(api(`/v1/budgets/${budgetId}`), {
        method: "DELETE",
        headers: apiHeaders('BUDGETS'),
      })
      .then(onSuccess)
      .catch(onError)
      .finally(function () {
        context.commit('hideLoader', 'deleteBudget')
      })
    },
    deleteBudgetLine (context, opts) {
      const [budgetId, lineId, onSuccess, onError] = opts
      context.commit('showLoader', 'deleteBudgetLine')
      fetch(api(`/v1/budgets/${budgetId}/budget_lines/${lineId}`), {
        method: "DELETE",
        headers: apiHeaders('BUDGETS'),
      })
      .then(onSuccess)
      .catch(onError)
      .finally(function () {
        context.commit('hideLoader', 'deleteBudgetLine')
      })
    },
    resetBudgetLine(context) {
      let line = dupObj(DEFAULTS.budgetLine)
      line.budget_id = this.state.budget.id
      context.commit('setBudgetLine', line)
    },
    fetchBudgetLine (context, opts) {
      const [budgetId, budgetLineId] = opts
      const { state } = context
      context.commit('showLoader', 'fetchBudget')
      fetch(api(`/v1/budgets/${budgetId}`), {
        method: "GET",
        headers: apiHeaders('BUDGETS')
      })
      .then(resp => resp.json())
      .then(function(item) {
        const line = item.budget_lines.find((item) => { return item.id == budgetLineId }) || dupObj(DEFAULTS.budgetLine)
        if (budgetLineId == null) {
          line.budget_id = item.id
          item.budget_lines.push(line)
        }
        context.commit('setBudgetLine', line)
        context.commit('setBudget', item)
      })
      .finally(function () {
        context.commit('hideLoader', 'fetchBudget')
      })
    },
    saveBudgetLine (context, opts) {
      const { state } = context
      const [onSuccess, onError] = opts
      context.commit('showLoader', 'saveBudgetLine')

      let path = '/v1/budget_lines'
      let method = 'POST'
      let line = state.budget_line

      if (line.id != null) {
        path = `/v1/budget_lines/${line.id}`
        method = 'PUT'
      }
      line.budget_id = state.budget.id
      fetch(api(path), {
        method: method,
        headers: apiHeaders('BUDGETS'),
        body: JSON.stringify({
          budget_line: line
        })
      })
      .then(resp => resp.json())
      .then(onSuccess)
      .catch(onError)
      .finally(function () {
        context.commit('hideLoader', 'saveBudgetLine')
      })
    },
    copyBudget (context, opts) {
      const [budgetId, onSuccess, onError] = opts
      context.commit('showLoader', 'copyBudget')
      fetch(api(`/v1/budgets/${budgetId}/copy`), {
        method: "POST",
        headers: apiHeaders('BUDGETS'),
      })
      .then(resp => resp.json())
      .then(onSuccess)
      .catch(onError)
      .finally(function () {
        context.commit('hideLoader', 'copyBudget')
      })
    }
  }
})