<template>
  <div>
    <h1>FDC Spec Setting charts</h1>
    <SpecSettings @confirm="confirm" />
  </div>
</template>

<script setup lang="ts">
import SpecSettings from '@/components/Echarts/FDC/SpecSettings.vue'
const confirm = (data) => {
  alert(data)
}
</script>

<style scoped></style>
