import { defineStore } from 'pinia'
import { makePayments, getPayments } from '@/helpers'
import { useToast } from 'vue-toast-notification'
import 'vue-toast-notification/dist/theme-sugar.css'

export const useUtilstStore = defineStore({
  id: 'utils',
  state: () => ({
    selectedTransactionIds: [],
    transactionsList: [],
    isLoading: false,
    currentPage: 1,
    totalPages: 0,
    perPage: 1,
    mode: 'all'
  }),
  actions: {
    async updatePayments() {
      let payload = {
        payments: this.selectedTransactionIds
      }
      const $toast = useToast()
      try {
        const res = await makePayments(payload)
        if (res.message && res.message === 'success') {
          this.selectedTransactionIds = []
          $toast.default('Transactions updated!', {})
          this.getData()
        } else {
          throw Error(res.message)
        }
      } catch (error) {
        $toast.error(error)
      }
    },
    async getData(page = 1, limit = 6, mode = 'all') {
      this.isLoading = true
      const res = await getPayments(page, limit, mode.toLowerCase())
      this.isLoading = false
      this.transactionsList = res.data
      this.totalPages = res.last_page // Update total items
      this.perPage = 6
    }
  },
  persist: {
    storage: localStorage
  }
})
