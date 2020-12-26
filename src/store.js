import { createStore } from 'vuex'

import { markAuthenticated, authToken, logout } from './helper'

const api = function (path) {
  return `${env("VUE_APP_API_URL")}/api${path}`
}

const env = function (name) {
  return process.env[name]
}

const apiHeaders = function(appScope) {
  const headers = new Headers()
  headers.append(env("VUE_APP_API_ID_HEADER"), env("VUE_APP_API_ID_VALUE"))
  if (appScope != null) {
    headers.append(env("VUE_APP_API_SCOPE_HEADER"), env(`VUE_APP_${appScope}_API_SCOPE_VALUE`))
  }
  headers.append('x-codehit-auth-token', authToken())
  headers.append('Content-Type', 'application/json')
  return headers
}

export default createStore({
  state: {
    categories: [],
    category: {},
    bankAccounts: [],
    bankAccount: {},
    transactions: [],
    transaction: {},
    transactionTypes: [],
    users: [],
    user: {},
  },
  mutations: {
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
      state.transaction.bank_account_id = value
    },
    setTransactioToBankAccountId (state, value) {
      state.transaction.to_bank_account_id = value
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
  },
  actions: {
    login (context, opts) {
      const [auth, onSuccess] = opts
      fetch(`${env("VUE_APP_API_URL")}/login`, {
        method: "POST",
        headers: apiHeaders('USERS'),
        body: JSON.stringify(auth)
      })
      .then(resp => resp.json())
      .then(function(resp) {
        if (resp.token != null) markAuthenticated(resp.token)
        onSuccess()
      })
    },
    fetchCategories (context) {
      fetch(api('/v1/categories'), {
        method: "GET",
        headers: apiHeaders('CATEGORIES')
      })
      .then(resp => resp.json())
      .then(function(items) {
        context.commit('setCategories', items)
      })
    },
    fetchCategory (context, categoryId) {
      if (!categoryId){
        context.commit('setCategory', {})
        return false
      }
      const { state } = context
      if (state.categories.length) {
        let item = state.categories.find((item) => { return item.id == categoryId })
        context.commit('setCategory', item)
      } else {
        fetch(api(`/v1/categories/${categoryId}`), {
          method: "GET",
          headers: apiHeaders('CATEGORIES')
        })
        .then(resp => resp.json())
        .then(function(item) {
          context.commit('setCategory', item)
        })
      }
    },
    updateCategory (context, opts) {
      const { state } = context
      const [onSuccess, onError] = opts
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
    },
    createCategory (context, opts) {
      const { state } = context
      const [onSuccess, onError] = opts
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
    },
    deleteCategory (context, opts) {
      const [categoryId, onSuccess, onError] = opts
      fetch(api(`/v1/categories/${categoryId}`), {
        method: "DELETE",
        headers: apiHeaders('CATEGORIES'),
      })
      .then(onSuccess)
      .catch(onError)
    },
    fetchBankAccounts (context) {
      fetch(api('/v1/bank_accounts'), {
        method: "GET",
        headers: apiHeaders('BANK_ACCOUNTS')
      })
      .then(resp => resp.json())
      .then(function(items) {
        context.commit('setBankAccounts', items)
      })
    },
    fetchBankAccount (context, bankAccountId) {
      if (!bankAccountId){
        context.commit('setBankAccount', {})
        return false
      }
      const { state } = context
      if (state.bankAccounts.length) {
        let item = state.bankAccounts.find((item) => { return item.id == bankAccountId })
        context.commit('setBankAccount', item)
      } else {
        fetch(api(`/v1/bank_accounts/${bankAccountId}`), {
          method: "GET",
          headers: apiHeaders('BANK_ACCOUNTS')
        })
        .then(resp => resp.json())
        .then(function(item) {
          context.commit('setBankAccount', item)
        })
      }
    },
    updateBankAccount (context, opts) {
      const { state } = context
      const [onSuccess, onError] = opts
      fetch(api(`/v1/bank_accounts/${state.bankAccount.id}`), {
        method: "PUT",
        headers: apiHeaders('BANK_ACCOUNTS'),
        body: JSON.stringify({
          bank_account: state.bankAccount
        })
      })
      .then(resp => resp.json())
      .then(onSuccess)
      .catch(onError)
    },
    createBankAccount (context, opts) {
      const { state } = context
      const [onSuccess, onError] = opts
      fetch(api(`/v1/bank_accounts`), {
        method: "POST",
        headers: apiHeaders('BANK_ACCOUNTS'),
        body: JSON.stringify({
          bank_account: state.bankAccount
        })
      })
      .then(resp => resp.json())
      .then(onSuccess)
      .catch(onError)
    },
    deleteBankAccount (context, opts) {
      const [bankAccountId, onSuccess, onError] = opts
      fetch(api(`/v1/bank_accounts/${bankAccountId}`), {
        method: "DELETE",
        headers: apiHeaders('BANK_ACCOUNTS'),
      })
      .then(onSuccess)
      .catch(onError)
    },
    fetchUsers (context) {
      fetch(api('/v1/users'), {
        method: "GET",
        headers: apiHeaders('USERS')
      })
      .then(resp => resp.json())
      .then(function(items) {
        context.commit('setUsers', items)
      })
    },
    fetchUser (context, userId) {
      if (!userId){
        context.commit('setUser', {})
        return false
      }
      const { state } = context
      if (state.users.length) {
        let item = state.users.find((item) => { return item.id == userId })
        context.commit('setUser', item)
      } else {
        fetch(api(`/v1/users/${userId}`), {
          method: "GET",
          headers: apiHeaders('USERS')
        })
        .then(resp => resp.json())
        .then(function(item) {
          context.commit('setUser', item)
        })
      }
    },
    updateUser (context, opts) {
      const { state } = context
      const [onSuccess, onError] = opts
      fetch(api(`/v1/users/${state.user.id}`), {
        method: "PUT",
        headers: apiHeaders('USERS'),
        body: JSON.stringify({
          bank_account: state.user
        })
      })
      .then(resp => resp.json())
      .then(onSuccess)
      .catch(onError)
    },
    createUser (context, opts) {
      const { state } = context
      const [onSuccess, onError] = opts
      fetch(api(`/v1/users`), {
        method: "POST",
        headers: apiHeaders('USERS'),
        body: JSON.stringify({
          bank_account: state.user
        })
      })
      .then(resp => resp.json())
      .then(onSuccess)
      .catch(onError)
    },
    deleteUser (context, opts) {
      const [userId, onSuccess, onError] = opts
      fetch(api(`/v1/users/${userId}`), {
        method: "DELETE",
        headers: apiHeaders('USERS'),
      })
      .then(onSuccess)
      .catch(onError)
    },
    fetchTransactions (context) {
      fetch(api('/v1/transactions'), {
        method: "GET",
        headers: apiHeaders('TRANSACTIONS')
      })
      .then(resp => resp.json())
      .then(function(items) {
        context.commit('setTransactions', items)
      })
    },
    fetchTransactionTypes (context) {
      fetch(api('/v1/transaction_types'), {
        method: "GET",
        headers: apiHeaders('TRANSACTIONS')
      })
      .then(resp => resp.json())
      .then(function(items) {
        context.commit('setTransactionTypes', items)
      })
    },
    fetchTransaction (context, transactionId) {
      if (!transactionId){
        context.commit('setTransaction', {})
        return false
      }
      const { state } = context
      if (state.transactions.length) {
        let item = state.transactions.find((item) => { return item.id == transactionId })
        context.commit('setTransaction', item)
      } else {
        fetch(api(`/v1/transactions/${transactionId}`), {
          method: "GET",
          headers: apiHeaders('TRANSACTIONS')
        })
        .then(resp => resp.json())
        .then(function(item) {
          context.commit('setTransaction', item)
        })
      }
    },
    updateTransaction (context, opts) {
      const { state } = context
      const [onSuccess, onError] = opts
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
    },
    createTransaction (context, opts) {
      const { state } = context
      const [onSuccess, onError] = opts
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
    },
    deleteTransaction (context, opts) {
      const [transactionId, onSuccess, onError] = opts
      fetch(api(`/v1/transactions/${transactionId}`), {
        method: "DELETE",
        headers: apiHeaders('TRANSACTIONS'),
      })
      .then(onSuccess)
      .catch(onError)
    },
  }
})