<template>
  <div style="padding-bottom: 30px">
    SPEC Order
    <el-select
      v-model="specOrder"
      @change="specOrderChange"
      class="m-2"
      placeholder="Select"
      size="small"
    >
      <el-option
        v-for="item in orderOptions"
        :key="item.value"
        :label="item.label"
        :value="item.value"
      />
    </el-select>
    <el-button type="primary" @click="addOrder" plain style="margin-top: 1px; margin-left: 3px"
      >add order</el-button
    >
  </div>
  <div class="range-box">
    <span v-for="(item, index) in refYrangeStr" :key="item"
      >{{ item }}
      <el-input-number
        v-model="yRangeRef[item]"
        class="mx-4"
        :min="index === 0 ? 0 : yRangeRef[refYrangeStr[index - 1]]"
        :max="400"
        controls-position="right"
        @change="handleChange(item)"
    /></span>
    <el-button type="primary" @click="emitDraw" plain style="margin-top: 18px"
      >Draw chart</el-button
    >
    <el-button type="primary" @click="emitConfirm('confirm')" plain style="margin-top: 18px"
      >Confirm</el-button
    >
  </div>
  <div style="width: 560px; height: 50px; padding-left: 180px">
    <el-slider
      v-model="xRangeArray"
      @change="xMapChange"
      :format-tooltip="formatXTip"
      range
      :max="xMapLength"
      show-input
    />
  </div>
  <div id="main" style="height: 500px; width: 700px; padding-top: 20px; margin: 0 auto"></div>
</template>

<script setup lang="ts">
import data from './config/mockData'
import * as echarts from 'echarts'
import { setMarkArea, optionsGenerated, xIndexToxAxis } from './config'
import { ref, onMounted, reactive, defineEmits } from 'vue'

let myChart
const refYrangeStr = ['LHL', 'LSL', 'LCL', 'UCL', 'USL', 'UHL']

const emit = defineEmits({
  confirm: (data) => data
})
const emitConfirm = (data) => emit('confirm', data)

const orderOptions = ref([
  {
    value: 0,
    label: 1
  },
  {
    value: 1,
    label: 2
  }
])
const specOrder = ref(0)
let yRangeRef = reactive({
  LHL: 30,
  LSL: 80,
  LCL: 120,
  UCL: 280,
  USL: 320,
  UHL: 380
})

const handleChange = (value) => {
  console.log(value)
  emitDraw()
}
const mockSpecData = [
  {
    order: 0,
    data: { ...yRangeRef },
    x: [0, 50]
  },
  {
    order: 1,
    data: { ...yRangeRef },
    x: [60, 80]
  }
]
const specData = []
let xRange = ref([])

const specOrderChange = (order) => {
  console.log(order)
  let range = specData[order]['data']
  refYrangeStr.forEach((i) => {
    yRangeRef[i] = range[i]
  })
  xRange.value = specData[order]['x']
}
const addOrder = () => {
  specData.push({
    order: 2,
    data: { ...yRangeRef },
    x: []
  })
  orderOptions.value.push({
    value: 2,
    label: 3
  })
  specOrder.value = 2
  specOrderChange(2)
}
let xMapLength = ref(100)
const xStartIndex = ref(0)
const xRangeArray = ref([0, 0])
const formatXTip = (indexVal) => {
  let index = xStartIndex.value + indexVal
  let value = data[index][0]
  console.log('=======')
  console.log(value)
  return value
}
mockSpecData.forEach((i, index) => {
  if (index === 0) {
    specOrder.value = i.order
    xRangeArray.value = i.x
    // let xRange = xIndexToxAxis(xStart, xEnd, data)
    // markArea = setMarkArea(xRange, { ...yRangeRef })
  }
  specData.push(i)
})
const xMapChange = (x) => {
  console.log(x)
  let dataZoom = myChart.getOption().dataZoom[0]
  const { startValue } = dataZoom

  let xStart = startValue + x[0]
  let xEnd = startValue + x[1]
  let xRange = xIndexToxAxis(xStart, xEnd, data)

  xRangeOrderSet(xRange)
  let markArea = setMarkArea(xRange, { ...yRangeRef })
  draw(markArea)
  // let start = myChart.getStart
}
const changeSingeRange = () => {
  specData[specOrder.value]['data'] = { ...yRangeRef }
}

let markArea = setMarkArea(specData[specOrder.value]['x'], { ...yRangeRef })
onMounted(() => {
  draw(markArea)
})
const emitDraw = () => {
  changeSingeRange()
  console.log(markArea)
  let index = specOrder.value
  let newRangeData = setMarkArea(specData[index]['x'], { ...yRangeRef })
  markArea.splice(index * 5, 5, ...newRangeData)
  draw(markArea)
}

const xRangeOrderSet = (xRange: string[]) => {
  let index = specOrder.value
  specData[index]['x'] = xRange
}
const draw = (markArea) => {
  if (!myChart) {
    myChart = echarts.init(document.getElementById('main'))
    let option = optionsGenerated(data, markArea)
    myChart.setOption(option)
    onFinished()
  } else {
    console.log('==============================')
    myChart.setOption({
      series: {
        data: data.map(function (item) {
          return item[1]
        }),
        markArea: {
          data: markArea
        }
      }
    })
  }
  console.log(data.length)

  let option = optionsGenerated(data, markArea)
  myChart.setOption(option)
}
const onFinished = () => [
  myChart.on('finished', function () {
    console.log(myChart.getOption().dataZoom)
    let dataZoom = myChart.getOption().dataZoom[0]
    const { startValue, endValue } = dataZoom
    xMapLength.value = endValue - startValue
    xStartIndex.value = startValue
    // xRangeArray.value = [xRangeArray+]
  })
]
</script>

<style scoped lang="less">
.range-box {
  display: flex;
  width: 1000px;
  input {
    width: 100px;
  }
}
</style>
