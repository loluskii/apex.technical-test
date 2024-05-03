<script setup>
import DataTable from '@/components/DataTable.vue'
import NavBar from '@/components/NavBar.vue'
import { ref } from 'vue'
import { useUtilstStore } from '@/store/utils.store'

const mode = ref('All')
const modes = ['All', 'Paid', 'Unpaid', 'Overdue']
const utilStore = useUtilstStore()
</script>

<template>
  <main class="content h-full">
    <NavBar />
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
                class="inline-block p-4 rounded-t-lg"
                :class="mode === m ? 'border-brand-success text-brand-success border-b-2' : 'border-0'"
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
          @click.prevent="utilStore.updatePayments"
          >Pay Dues</a
        >
      </div>
      <div class="card bg-white h-[100%] rounded-[16px] border-0">
        <DataTable :mode="mode" />
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
