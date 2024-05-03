<script setup>
import {
  FlexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useVueTable
} from '@tanstack/vue-table'
import moment from 'moment'
import { MoreHorizontal, Settings2, ChevronDown, ChevronLeft, ChevronRight } from 'lucide-vue-next'
import UserAction from './UserAction.vue'
import { ref, onMounted, h, computed, watch } from 'vue'
import { getPayments } from '@/helpers'
import emitter from '@/helpers/emitter'

const data = ref([])
const currentPage = ref(1)
const totalPages = ref(0)
const perPage = ref(6)
const props = defineProps(['mode'])
const emits = defineEmits(['submit-payment'])
const transactions = ref([])

watch(
  () => props.mode,
  async (newValue, oldValue) => {
    await getData(currentPage.value, perPage.value, newValue)
  }
)

const columns = [
  {
    accessorKey: 'name',
    header: 'Name',
    cell: ({ row }) => {
      const userName = row.original.user.name
      const userEmail = row.original.user.email

      return h('div', [
        h('p', { class: 'font-semibold text-[16px]' }, userName),
        h('p', { class: 'text-brand-muted-2 font-medium' }, userEmail)
      ])
    }
  },
  {
    accessorKey: 'user_status',
    header: 'User Status',
    cell: ({ row }) => renderUserStatus(row.original.user)
  },
  {
    accessorKey: 'payment_status',
    header: 'Payment Status',
    cell: ({ row }) => renderPaymentStatus(row.original)
  },
  {
    accessorKey: 'amount',
    header: 'Amount',
    cell: ({ row }) => {
      const amount = Number.parseFloat(row.getValue('amount'))
      const formatted = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
      }).format(amount)

      return h('div', { class: 'font-medium' }, [
        h('p', { class: 'text-[16px] font-medium text-brand-text' }, formatted),
        h('p', { class: 'text-[16px] font-medium text-brand-muted-2' }, row.original.currency)
      ])
    }
  },
  {
    id: 'actions',
    enableHiding: false,
    cell: ({ row }) => {
      const payment = row.original

      return h(
        'div',
        { class: 'relative' },
        h(UserAction, {
          payment
        })
      )
    }
  }
]

const visiblePages = computed(() => {
  const maxButtons = 5
  let startPage = Math.max(currentPage.value - Math.floor(maxButtons / 2), 1)
  let endPage = Math.min(startPage + maxButtons - 1, totalPages.value)

  // Adjust the starting page number if the range exceeds the total pages
  if (endPage - startPage + 1 < maxButtons) {
    startPage = Math.max(endPage - maxButtons + 1, 1)
  }

  return Array.from({ length: endPage - startPage + 1 }, (_, index) => startPage + index)
})

const table = useVueTable({
  get data() {
    return data.value
  },
  columns,
  getCoreRowModel: getCoreRowModel(),
  getPaginationRowModel: getPaginationRowModel()
})

async function getData(page = 1, limit = 6, mode = 'all') {
  const res = await getPayments(page, limit, props.mode.toLowerCase())
  data.value = res.data
  totalPages.value = res.last_page // Update total items
}

function renderUserStatus(user) {
  const userStatus = user.status
  const userLastLogin = user.last_login_at

  const statusText = userStatus === 'active' ? 'Active' : 'Inactive'
  const statusClass =
    userStatus === 'active'
      ? 'bg-brand-success-light text-brand-success'
      : 'bg-brand-danger-light text-brand-danger'

  return h('div', [
    h(
      'button',
      {
        class: `px-4 py-2 rounded-[8px] flex items-center ${statusClass}`
      },
      [
        h('div', {
          class: `w-[6px] h-[6px] rounded-full ${
            userStatus === 'active' ? 'bg-brand-success' : 'bg-brand-danger'
          } me-2`
        }),
        statusText
      ]
    ),
    h(
      'p',
      { class: 'mt-2 text-brand-body' },
      `Last Login: ${moment(userLastLogin).format('D MMM, YYYY')}`
    )
  ])
}

function renderPaymentStatus(payment) {
  const paymentMade = payment.payment_made_at
  const paymentDue = moment(payment.payment_expected_at)
  const currentDate = moment()

  const isPaid = !!paymentMade
  const isOverdue = !isPaid && currentDate.isAfter(paymentDue)

  let statusText, statusClass, dotClass
  if (isPaid) {
    statusText = 'Paid'
    statusClass = 'bg-brand-primary-light text-brand-primary'
    dotClass = 'bg-brand-primary'
  } else if (isOverdue) {
    statusText = 'Overdue'
    statusClass = 'bg-brand-red-light text-brand-red'
    dotClass = 'bg-brand-red'
  } else {
    statusText = 'Unpaid'
    statusClass = 'bg-brand-warning-light text-brand-warning'
    dotClass = 'bg-brand-warning'
  }

  const paymentDate = isPaid ? moment(paymentMade) : paymentDue

  return h('div', [
    h(
      'button',
      {
        class: `px-4 py-2 rounded-[8px] flex items-center ${statusClass}`
      },
      [
        h('div', { class: `w-[6px] h-[6px] rounded-full ${dotClass} bg-brand-primary me-2` }),
        statusText
      ]
    ),
    h(
      'p',
      { class: 'mt-2 text-brand-body' },
      `${isOverdue ? 'Due' : 'Paid'} on: ${paymentDate.format('D MMM, YYYY')}`
    )
  ])
}

const isSelected = (id) => {
  return transactions.value.includes(id)
}

const handleSelect = (event) => {
  emits('submit-payment', transactions.value)
}

const goToPage = async (pageNumber) => {
  console.log(pageNumber)
  if (pageNumber >= 1 && pageNumber <= totalPages.value && pageNumber !== '...') {
    currentPage.value = pageNumber
    await getData(currentPage.value, perPage.value)
  }
}

const previousPage = async () => {
  if (currentPage.value > 1) {
    currentPage.value--
    await getData(currentPage.value, perPage.value)
  }
}

const nextPage = async () => {
  if (currentPage.value < totalPages) {
    currentPage.value++
    await getData(currentPage.value, perPage.value)
  }
}

onMounted(async () => {
  await getData()
})
</script>

<template>
  <div class="rounded-md">
    <div class="w-full flex justify-end py-5 px-3">
      <button class="btn text-brand-success bg-[#EEEFF2]">
        <Settings2 />
        Filters
      </button>
    </div>
    <div class="form gap-x-4 py-5 px-7 border-b flex">
      <label class="form-control basis-[25%]">
        <div class="label">
          <span class="label-text font-bold text-[16px] text-brand-text">Name</span>
        </div>
        <input type="text" placeholder="name" class="input bg-brand-input w-full max-w-xs" />
      </label>
      <label class="form-control basis-[25%]">
        <div class="label">
          <span class="label-text font-bold text-[16px] text-brand-text">Amount</span>
        </div>
        <input type="text" placeholder="amount" class="input bg-brand-input w-full max-w-xs" />
      </label>
      <label class="form-control basis-[25%]">
        <div class="label">
          <span class="label-text font-bold text-[16px] text-brand-text">User's Status</span>
        </div>
        <div class="dropdown">
          <div
            tabindex="0"
            class="input flex justify-between cursor-pointer items-center text-start bg-brand-input border-none w-full text-[#9ba3af] mb-2"
          >
            <span>user's status</span>
            <ChevronDown />
          </div>
          <ul
            tabindex="0"
            class="dropdown-content z-[1] menu p-2 shadow-lg bg-base-100 rounded-[12px] w-full"
          >
            <li class="hover:bg-[#F9FAFB]"><a>All</a></li>
            <li class="hover:bg-[#F9FAFB]">
              <a class="text-brand-success"
                ><div class="w-[6px] h-[6px] rounded-full bg-brand-success me-1"></div>
                Active</a
              >
            </li>
            <li class="hover:bg-[#F9FAFB]">
              <a class="text-brand-danger"
                ><div class="w-[6px] h-[6px] rounded-full bg-brand-danger me-1"></div>
                Inactive</a
              >
            </li>
          </ul>
        </div>
      </label>
      <label class="form-control basis-[25%]">
        <div class="label">
          <span class="label-text font-bold text-[16px] text-brand-text">Payment Status</span>
        </div>
        <div class="dropdown">
          <div
            tabindex="0"
            class="input flex justify-between cursor-pointer items-center text-start bg-brand-input border-none w-full text-[#9ba3af] mb-2"
          >
            <span>payment status</span>
            <ChevronDown />
          </div>
          <ul
            tabindex="0"
            class="dropdown-content z-[1] menu p-2 shadow-lg bg-base-100 rounded-[12px] w-full"
          >
            <li class="hover:bg-[#F9FAFB]"><a>All</a></li>
            <li class="hover:bg-[#F9FAFB]">
              <a class="text-brand-success"
                ><div class="w-[6px] h-[6px] rounded-full bg-brand-success me-1"></div>
                Paid</a
              >
            </li>
            <li class="hover:bg-[#F9FAFB]">
              <a class="text-brand-danger"
                ><div class="w-[6px] h-[6px] rounded-full bg-brand-danger me-1"></div>
                Upaid</a
              >
            </li>
            <li class="hover:bg-[#F9FAFB]">
              <a class="text-brand-red"
                ><div class="w-[6px] h-[6px] rounded-full bg-brand-red me-1"></div>
                Overdue</a
              >
            </li>
          </ul>
        </div>
      </label>
    </div>
    <table class="table border-b">
      <thead>
        <tr v-for="headerGroup in table.getHeaderGroups()" :key="headerGroup.id">
          <th>
            <input type="checkbox" name="" class="checkbox invisible" id="" />
          </th>
          <th
            v-for="(header, index) in headerGroup.headers"
            :key="header.id"
            class="text-[#718096] font-medium py-6 text-[16px]"
            :class="index === 0 ? 'w-[30%]' : ''"
          >
            <FlexRender
              v-if="!header.isPlaceholder"
              :render="header.column.columnDef.header"
              :props="header.getContext()"
            />
          </th>
        </tr>
      </thead>
      <tbody>
        <template v-if="table.getRowModel().rows?.length">
          <tr
            v-for="row in table.getRowModel().rows"
            :key="row.id"
            :data-state="row.getIsSelected() ? 'selected' : undefined"
          >
            <td>
              <input
                type="checkbox"
                v-model="transactions"
                :value="row.original.id"
                :checked="isSelected(row.original.id)"
                class="checkbox"
                @change="handleSelect"
                id=""
              />
            </td>
            <td v-for="cell in row.getVisibleCells()" :key="cell.id">
              <FlexRender :render="cell.column.columnDef.cell" :props="cell.getContext()" />
            </td>
          </tr>
        </template>
        <template v-else>
          <tr>
            <td :colSpan="columns.length" class="h-24 text-center">No results.</td>
          </tr>
        </template>
      </tbody>
    </table>
    <div class="flex items-center justify-between p-4 space-x-2">
      <div class="flex items-center gap-x-3">
        <p>Show result</p>
        <div class="dropdown">
          <div
            tabindex="0"
            class="input flex justify-between cursor-pointer items-center text-start bg-brand-input border-none w-full text-[#9ba3af]"
          >
            <span class="me-2">{{ perPage }}</span>
            <ChevronDown />
          </div>
        </div>
      </div>

      <div>
        <div class="join">
          <button class="px-2 bg-transparent border-none shadow-none" @click.prevent="previousPage">
            <ChevronLeft />
          </button>
          <button
            v-for="pageNumber in visiblePages"
            :key="pageNumber"
            class="py-3 px-4 h-10 w-10 flex items-center justify-center border-0 shadow-none rounded-[8px]"
            :class="[
              { 'btn-disabled': pageNumber === '...' },
              pageNumber === currentPage
                ? 'bg-brand-success-light text-brand-success font-bold'
                : 'bg-transparent text-[#A0AEC0]'
            ]"
            @click.prevent="goToPage(pageNumber)"
          >
            {{ pageNumber }}
          </button>
          <button class="px-2 bg-transparent border-none shadow-none" @click.prevent="nextPage">
            <ChevronRight />
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
