<script setup lang="ts">
import {
  FlexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useVueTable,
  createColumnHelper
} from '@tanstack/vue-table'
import DropdownAction from './Dropdown.vue'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import { ref, onMounted, h } from 'vue'
import { getPayments, makePayments } from '@/helpers'

const columnHelper = createColumnHelper()
const data = ref([
  {
    id: 1,
    user_id: 7,
    amount: 4119,
    currency: 'USD',
    payment_expected_at: '2024-04-08 03:54:41',
    payment_made_at: '2024-04-25 12:01:44',
    created_at: '2024-04-08T11:54:41.000000Z',
    updated_at: '2024-04-25T12:01:44.000000Z',
    user: {
      id: 7,
      name: 'Mr. Cicero Cummings',
      email: 'gregorio.kunde@example.net',
      email_verified_at: '2024-04-25T11:54:41.000000Z',
      status: 'active',
      last_login_at: '2024-04-25 22:54:41',
      created_at: '2024-04-25T11:54:41.000000Z',
      updated_at: '2024-04-25T11:54:41.000000Z'
    }
  },
  {
    id: 34,
    user_id: 4,
    amount: 4289,
    currency: 'USD',
    payment_expected_at: '2024-08-07 11:54:41',
    payment_made_at: null,
    created_at: '2024-04-08T11:54:41.000000Z',
    updated_at: '2024-04-25T11:54:41.000000Z',
    user: {
      id: 4,
      name: 'Maurine Satterfield',
      email: 'stiedemann.karine@example.net',
      email_verified_at: '2024-04-25T11:54:41.000000Z',
      status: 'inactive',
      last_login_at: '2024-04-26 06:54:41',
      created_at: '2024-04-25T11:54:41.000000Z',
      updated_at: '2024-04-25T11:54:41.000000Z'
    }
  }
])
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
    cell: ({ row }) => {
      const userStatus = row.original.user.status
      const userLastLogin = row.original.user.last_login_at

      if (userStatus === 'active') {
        return h('div', [
          h(
            'button',
            {
              class:
                'px-4 py-2 bg-brand-success-light rounded-[8px] flex items-center text-brand-success'
            },
            [h('div', { class: 'w-[6px] h-[6px] rounded-full bg-brand-success me-2' })],
            'Active'
          ),
          h('p', { class: 'mt-2 text-brand-body' }, `Last Login: ${userLastLogin}`)
        ])
      } else {
        return h('div', [
          h(
            'button',
            {
              class:
                'px-4 py-2 bg-brand-danger-light rounded-[8px] flex items-center text-brand-danger'
            },
            [h('div', { class: 'w-[6px] h-[6px] rounded-full bg-brand-danger me-2' })],
            'Inactive'
          ),
          h('p', { class: 'mt-2 text-brand-body' }, `Last Login: ${userLastLogin}`)
        ])
      }
    }
  },
  {
    accessorKey: 'payment_status',
    header: 'Payment Status',
    cell: ({ row }) => {
      const paymentMade = row.original.payment_made_at
      const paymentDue = row.original.payment_expected_at

      if (paymentMade) {
        return h('div', [
          h(
            'button',
            {
              class:
                'px-4 py-2 bg-brand-primary-light rounded-[8px] flex items-center text-brand-primary'
            },
            [h('div', { class: 'w-[6px] h-[6px] rounded-full bg-brand-primary me-2' })],
            'Paid'
          ),
          h('p', { class: 'mt-2 text-brand-body' }, `Paid on: ${paymentMade}`)
        ])
      } else {
        return h('div', [
          h(
            'button',
            {
              class:
                'px-4 py-2 bg-brand-warning-light rounded-[8px] flex items-center text-brand-warning'
            },
            [h('div', { class: 'w-[6px] h-[6px] rounded-full bg-brand-warning me-2' })],
            'Unpaid'
          ),
          h('p', { class: 'mt-2 text-brand-body' }, `Due on: ${paymentDue}`)
        ])
      }
    }
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

      return h('div', { class: 'font-medium' }, formatted)
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
        h(DropdownAction, {
          payment
        })
      )
    }
  }
]

const table = useVueTable({
  get data() {
    return data.value
  },
  columns,
  getCoreRowModel: getCoreRowModel(),
  getPaginationRowModel: getPaginationRowModel()
})

async function getData() {
  const res = await getPayments(1, 10, 'all')
  data.value = res.data
}

onMounted(async () => {
  await getData()
})
</script>

<template>
  <div class="border rounded-md">
    <Table>
      <TableHeader>
        <TableRow v-for="headerGroup in table.getHeaderGroups()" :key="headerGroup.id">
          <TableHead v-for="header in headerGroup.headers" :key="header.id">
            <FlexRender
              v-if="!header.isPlaceholder"
              :render="header.column.columnDef.header"
              :props="header.getContext()"
            />
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <template v-if="table.getRowModel().rows?.length">
          <TableRow
            v-for="row in table.getRowModel().rows"
            :key="row.id"
            :data-state="row.getIsSelected() ? 'selected' : undefined"
          >
            <TableCell v-for="cell in row.getVisibleCells()" :key="cell.id">
              <FlexRender :render="cell.column.columnDef.cell" :props="cell.getContext()" />
            </TableCell>
          </TableRow>
        </template>
        <template v-else>
          <TableRow>
            <TableCell :colSpan="columns.length" class="h-24 text-center"> No results. </TableCell>
          </TableRow>
        </template>
      </TableBody>
    </Table>
    <div class="flex items-center justify-between p-4 space-x-2">
      <p>Show result</p>
      <Select>
        <SelectTrigger>
          <SelectValue placeholder="Select a fruit" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Fruits</SelectLabel>
            <SelectItem value="apple"> Apple </SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
      <div>
        <button :disabled="!table.getCanPreviousPage()" @click="table.previousPage()">
          Previous
        </button>
        <button
          variant="outline"
          size="sm"
          :disabled="!table.getCanNextPage()"
          @click="table.nextPage()"
        >
          Next
        </button>
      </div>
    </div>
  </div>
</template>
