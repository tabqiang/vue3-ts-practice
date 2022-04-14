<template>
  <div id="app">
    <div class="menu-container">
      <SideBar class="menu" />
    </div>

    <router-view />
  </div>
</template>

<script lang="ts" setup>
import SideBar from './views/SideBar/SideBar.vue'
</script>

<style lang="less" scoped>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  display: flex;
}
.menu-container {
  width: 300px;
}
</style>
