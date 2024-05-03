<script setup>
import { MoreHorizontal } from 'lucide-vue-next'
</script>

<template>
  <div class="dropdown dropdown-bottom dropdown-end">
    <div tabindex="0" role="button" class=" m-1"><MoreHorizontal /></div>
    <ul tabindex="0" class="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52">
      <li><a>Edit</a></li>
      <li><a>View Profile</a></li>
      <div class="divider my-0"></div>
      <li class="text-brand-red"><a>Delete</a></li>
    </ul>
  </div>
</template>
