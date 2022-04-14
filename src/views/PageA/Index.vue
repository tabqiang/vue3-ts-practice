<template>
  <el-form :inline="true" :model="formInline" class="demo-form-inline">
    <el-form-item label="Approved by">
      <el-input v-model="formInline.user" placeholder="Approved by" />
    </el-form-item>
    <el-form-item label="Activity zone">
      <el-select v-model="formInline.region" placeholder="Activity zone">
        <el-option label="Zone one" value="shanghai" />
        <el-option label="Zone two" value="beijing" />
      </el-select>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="onSubmit">Query</el-button>
    </el-form-item>
  </el-form>
  <span>{{ num }}</span>
  <button @click="add">add</button>
</template>

<script lang="ts" setup>
import { reactive, ref } from 'vue'

const formInline = reactive({
  user: '',
  region: ''
})

let num = ref(0)
const add = () => num.value++

const onSubmit = () => {
  console.log(formInline.user)
}
</script>
