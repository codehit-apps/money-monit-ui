import {pluck, where, reduce} from 'underscore'

const EXPENSE = 'Withdraw'
const TRANSFER = 'Transfer'
const DEPOSIT = 'Deposit'

class TxnManager {
  constructor (txns, account_id) {
    this.txns = txns
    this.account_id = account_id
  }

  setTxns (val) {
    this.txns = val
  }

  setBankAccountId (val) {
    this.account_id = val
  }

  getTotalExpenses () {
    return this._feesTotal() + this._expensesTotal()
  }

  getAccountBalance () {
    return this._depositsTotal() - this.getTotalExpenses() - this._transfersOutTotal()
  }

  // Private Functions

  _expenses () {
    let _txns = where(this.txns, {type: EXPENSE})
    if (this.account_id != null) _txns = where(_txns, {account_id: this.account_id})
    return _txns
  }

  _expensesTotal () {
    return this._sum(pluck(this._expenses(), 'amount'))
  }

  _transfersOutTotal () {
    return this._sum(pluck(this._transfersOut(), 'amount'))
  }

  _transfers () {
    let _txns = where(this.txns, {type: TRANSFER})
    if (this.account_id != null) _txns = where(_txns, {account_id: this.account_id})
    return _txns
  }

  _transfersIn () {
    let _txns = where(this.txns, {type: TRANSFER})
    if (this.account_id != null) _txns = where(_txns, {to_account_id: this.account_id})
    return _txns
  }

  _transfersOut () {
    let _txns = where(this.txns, {type: TRANSFER})
    if (this.account_id != null) _txns = where(_txns, {account_id: this.account_id})
    return _txns
  }

  _deposits () {
    let _txns = where(this.txns, {type: DEPOSIT})
    if (this.account_id != null) _txns = where(_txns, {account_id: this.account_id})
    return _txns
  }

  _depositsTotal () {
    return this._sum(pluck(this._deposits(), 'amount')) + this._sum(pluck(this._transfersIn(), 'amount'))
  }

  _feesTotal () {
    return this._sum(pluck(this._transfers(), 'fee'))
  }

  _sum (arr) {
    return parseFloat(reduce(arr, (mem, num) => { return parseFloat(mem) + parseFloat(num) })) || 0
  }
}
export default TxnManager