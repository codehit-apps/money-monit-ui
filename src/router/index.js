import { createRouter, createWebHashHistory } from '@ionic/vue-router';
import Tabs from '../views/Tabs.vue'
import { isAuthenticated } from '../helper'

const routes = [
  {
    path: '/',
    component: () => import('@/views/public/Landing.vue'),
    meta: {
      public: true
    }
  },
  {
    path: '/login',
    component: () => import('@/views/auth/Login.vue')
  },
  {
    path: '/',
    component: Tabs,
    children: [
      {
        path: '/home',
        name: 'homePageRoute',
        component: () => import('@/views/Home.vue')
      },
      {
        path: '/account',
        name: 'accountPageRoute',
        component: () => import('@/views/Account.vue')
      },
      {
        path: '/categories',
        component: () => import('@/views/categories/Categories.vue')
      },
      {
        path: '/categories/:id/edit',
        component: () => import('@/views/categories/CategoryForm.vue')
      },
      {
        path: '/categories/new',
        component: () => import('@/views/categories/CategoryForm.vue')
      },
      {
        path: '/reports',
        component: () => import('@/views/Reports.vue')
      },
      { 
      path: '/transactions',
        component: () => import('@/views/transactions/Transactions.vue')
      },
      {
        path: '/transactions/new',
        name: 'newTransactionPageRoute',
        component: () => import('@/views/transactions/TransactionForm.vue')
      },
      {
        path: '/transactions/:id/edit',
        component: () => import('@/views/transactions/TransactionForm.vue')
      },
      { 
      path: '/banks',
        component: () => import('@/views/banks/Banks.vue')
      },
      { 
        path: '/banks/new',
        component: () => import('@/views/banks/BankForm.vue')
      },
      { 
        path: '/banks/:id/edit',
        component: () => import('@/views/banks/BankForm.vue')
      },
      { 
        path: '/debts',
        component: () => import('@/views/debts/Debts.vue')
      },
      { 
        path: '/debts/new',
        component: () => import('@/views/debts/DebtForm.vue')
      },
      { 
        path: '/debts/:id/edit',
        component: () => import('@/views/debts/DebtForm.vue')
      },
      {
        path: '/debt_payments/:debt_id/new',
        name: 'NewPaymentLine',
        component: () => import('@/views/debts/PaymentLineForm.vue')
      },
      {
        path: '/debt_payments/:debt_id/:id/edit',
        name: 'EditPaymentLine',
        component: () => import('@/views/debts/PaymentLineForm.vue')
      },
      { 
      path: '/budgets',
        component: () => import('@/views/budgets/Budgets.vue')
      },
      {
        path: '/budgets/new',
        name: 'NewBudget',
        component: () => import('@/views/budgets/BudgetForm.vue')
      },
      {
        path: '/budgets/:id/edit',
        name: 'EditBudget',
        component: () => import('@/views/budgets/BudgetForm.vue')
      },
      {
        path: '/budget_items/:budget_id/new',
        name: 'NewBudgetLine',
        component: () => import('@/views/budgets/BudgetLineForm.vue')
      },
      {
        path: '/budget_items/:budget_id/:id/edit',
        name: 'EditBudgetLine',
        component: () => import('@/views/budgets/BudgetLineForm.vue')
      },
      { 
      path: '/users',
        component: () => import('@/views/users/Users.vue')
      },
      { 
        path: '/users/new',
        component: () => import('@/views/users/UserForm.vue')
      },
      { 
        path: '/users/:id/edit',
        component: () => import('@/views/users/UserForm.vue')
      }
    ]
  }
]

const router = createRouter({
  history: createWebHashHistory(process.env.BASE_URL),
  routes
})

router.beforeEach((to, from, next) => {
  if ((to.path !== '/login' && !to.meta.public) && !isAuthenticated()) next({ path: '/login' })
  else if (to.path == '/login' && isAuthenticated()) next({ path: '/home' })
  else next()
})

export default router
