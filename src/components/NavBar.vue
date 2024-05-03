<template>
  <nav class="bg-white">
    <div class="relative flex items-center justify-between h-24 px-12">
      <a href="#" class="text-[24px] rounded-md px-3 py-2 font-[700]">Table Heading</a>
      <div type="button" class="flex gap-x-4 items-center">
        <img class="h-12 w-12 rounded-full" src="@/assets/Avatar.png" alt="" />
        <div class="flex flex-col">
          <span class="text-brand-text text-[16px] font-[700]">Tynisha Obey</span>
          <span class="text-[12px] font-[400] text-brand-muted">Makostore</span>
        </div>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { defineComponent } from 'vue'

defineComponent({
  name: 'Navbar'
})
</script>
