<script setup>
import DataTable from '@/components/DataTable.vue'
import { makePayments } from '@/helpers'
import { ref } from 'vue'
import emitter from '@/helpers/emitter.js'

const mode = ref('All')
const modes = ['All', 'Paid', 'Unpaid', 'Overdue']
const paymentIds = ref([])

const addPayment = (data) => (paymentIds.value = data)

const getPayments = async (data) => {
  let payload = {
    payments: paymentIds.value
  }
  try {
    const res = await makePayments(payload)
    if (res.message && res.message === 'success') {
      
    }
  } catch (error) {}
}
</script>

<template>
  <main class="content h-full">
    <nav class="bg-white">
      <div class="relative flex items-center justify-between h-24 px-12">
        <a href="#" class="text-[24px] rounded-md px-3 py-2 font-[700]">Table Heading</a>
        <div type="button" class="flex gap-x-4 items-center">
          <img
            class="h-12 w-12 rounded-full"
            src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
            alt=""
          />
          <div class="flex flex-col">
            <span class="text-brand-text text-[16px] font-[700]">Tynisha Obey</span>
            <span class="text-[12px] font-[400] text-brand-muted">Makostore</span>
          </div>
        </div>
      </div>
    </nav>
    <div class="main-content mb-5 h-[calc(100vh - 96px)]">
      <div class="flex justify-between items-center mb-5">
        <div class="tab-list">
          <ul
            class="flex flex-wrap text-sm font-medium text-center text-gray-500 border-b border-gray-200 dark:border-gray-700"
          >
            <li class="me-2">
              <a
                href="#"
                aria-current="page"
                v-for="m in modes"
                class="inline-block p-4 rounded-t-lg border-b-2"
                :class="mode === m ? 'border-brand-success text-brand-success' : ''"
                @click.prevent="mode = m"
                >{{ m }}</a
              >
            </li>
          </ul>
        </div>
        <a
          href="#"
          class="bg-brand-success text-white w-[254px] h-[56px] flex justify-center items-center rounded-md px-[20px] py-[8px] text-center font-bold"
          aria-current="page"
          @click.prevent="getPayments"
          >Pay Dues</a
        >
      </div>
      <div class="card bg-white h-[100%] rounded-[16px] border-0">
        <DataTable :mode="mode" @submit-payment="addPayment" />
      </div>
    </div>
  </main>
</template>

<style>
body {
  background-color: #fafafa;
}
.main-content {
  padding: 40px 53px 0 53px;
}

.dot {
  height: 6px;
  width: 6px;
}
</style>
