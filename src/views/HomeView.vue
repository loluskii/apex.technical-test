<script setup>
import { getPayments, makePayments } from '@/helpers'
import DataTable from '@/components/Payments/DataTable.vue'
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table'

const invoices = [
  {
    invoice: 'ChiekoChute Annabel Rohan',
    email: 'ChiekoChute@gmail.com',
    paymentStatus: 'Last Login: 12 Feb, 2024',
    totalAmount: 'Paid on: 12 Feb, 2024',
    paymentMethod: 'Credit Card'
  },
  {
    invoice: 'ChiekoChute Annabel Rohan',
    email: 'ChiekoChute@gmail.com',
    paymentStatus: 'Last Login: 12 Feb, 2024',
    totalAmount: 'Paid on: 12 Feb, 2024',
    paymentMethod: 'Credit Card'
  }
]
</script>

<template>
  <main class="content bg-[#f1f1f1] h-screen">
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
    <div class="main-content">
      <div class="flex justify-between items-center mb-5">
        <div class="tab-list">
          <ul
            class="flex flex-wrap text-sm font-medium text-center text-gray-500 border-b border-gray-200 dark:border-gray-700"
          >
            <li class="me-2">
              <a
                href="#"
                aria-current="page"
                class="inline-block p-4 bg-gray-100 rounded-t-lg dark:bg-gray-800 dark:text-blue-500 border-b-2 border-brand-primary text-brand-primary"
                >All</a
              >
            </li>
            <li class="me-2">
              <a href="#" class="inline-block p-4 rounded-t-lg">Paid</a>
            </li>
            <li class="me-2">
              <a href="#" class="inline-block p-4 rounded-t-lg">Unpaind</a>
            </li>
            <li class="me-2">
              <a href="#" class="inline-block p-4 rounded-t-lg">Overdue</a>
            </li>
          </ul>
        </div>
        <a
          href="#"
          class="bg-gray-900 text-white w-[254px] h-[56px] flex justify-center items-center rounded-md px-[20px] py-[8px] text-center text-sm font-bold"
          aria-current="page"
          >Pay Dues</a
        >
      </div>
      <div class="card bg-white h-[100%] rounded-[16px]">
        <DataTable />
      </div>
    </div>
  </main>
</template>

<style>
.main-content {
  padding: 40px 53px 0 53px;
}

.card {
  padding-top: 24px;
}

.dot {
  height: 6px;
  width: 6px;
}
</style>
