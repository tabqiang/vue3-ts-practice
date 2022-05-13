<template>
  <h1>charts图表预研</h1>
  <div ref="charts" class="charts-context"></div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import * as zrender from 'zrender'

import { clone, curry } from 'zrender/src/core/util'
import * as graphic from './utils/graphic'
import Displayable from 'zrender/src/graphic/Displayable'

type Point = number[]
const mathMin = Math.min
const mathMax = Math.max
const BRUSH_PANEL_GLOBAL = true as const
const DIRECTION_MAP = {
  w: [0, 0],
  e: [0, 1],
  n: [1, 0],
  s: [1, 1]
} as const

const CURSOR_MAP = {
  w: 'ew',
  e: 'ew',
  n: 'ns',
  s: 'ns',
  ne: 'nesw',
  sw: 'nesw',
  nw: 'nwse',
  se: 'nwse'
} as const

// let charts = ref(null)
let charts = ref<HTMLElement | null>(null)
var circle = new zrender.Circle({
  draggable: true,
  shape: {
    cx: 200,
    cy: 200,
    r: 40
  },
  style: {
    fill: 'none',
    stroke: '#F00'
  }
})
let rect = new zrender.Rect({
  shape: {
    x: 10,
    y: 10,
    width: 150,
    height: 100
  },
  cursor: 'e-resize',
  style: {
    fill: 'red'
  },
  onmouseup: function (e) {
    console.log(e)
    rect.attr({
      style: {
        fill: 'yellow'
      }
    })
  }
})
console.log(rect.getBoundingRect())

// const ss = () => {
//   console.log(3333)
// }
// rect.trigger('click', ss)

let group = new zrender.Group()

// var ag = new zrender.LinearGradient(10, 10, 100, 80)
group.add(circle)
group.add(rect)
console.log('===')

function createBaseRectCover(rectRangeConverter, controller, edgeNameSequences) {
  const cover = new graphic.Group()
  console.log(cover)
  edgeNameSequences = [['w'], ['e'], ['n'], ['s'], ['s', 'e'], ['s', 'w'], ['n', 'e'], ['n', 'w']]

  cover.add(
    new graphic.Rect({
      name: 'main',
      silent: true,
      draggable: true,
      cursor: 'move',
      drift: curry(driftRect, rectRangeConverter, controller, cover, ['n', 's', 'w', 'e'])
    })
  )
  edgeNameSequences.forEach((nameSequence) => {
    cover.add(
      new graphic.Rect({
        name: nameSequence.join(''),
        style: { opacity: 1, fill: nameSequence.length > 1 ? 'red' : 'green' },
        draggable: true,
        silent: true,
        invisible: true,
        drift: curry(driftRect, rectRangeConverter, controller, cover, nameSequence)
      })
    )
  })

  return cover
}
function driftRect(rectRangeConverter, controller, cover, dirNameSequence, dx: number, dy: number) {
  console.log(dx)
  console.log(dy)
  console.log(dirNameSequence)
  console.log(cover)
  console.log(controller)
  console.log(rectRangeConverter)
  console.log('driftRect')

  const brushOption = cover.__brushOption
  const rectRange = rectRangeConverter.toRectRange(brushOption.range)
  const localDelta = toLocalDelta(controller, dx, dy)

  dirNameSequence.forEach((dirName) => {
    const ind = DIRECTION_MAP[dirName]
    rectRange[ind[0]][ind[1]] += localDelta[ind[0]]
  })

  brushOption.range = rectRangeConverter.fromRectRange(
    formatRectRange(rectRange[0][0], rectRange[1][0], rectRange[0][1], rectRange[1][1])
  )

  updateCoverAfterCreation(controller, cover, rectRange)
}
function toLocalDelta(controller, dx: number, dy: number) {
  const thisGroup = controller.group
  const localD = thisGroup.transformCoordToLocal(dx, dy)
  const localZero = thisGroup.transformCoordToLocal(0, 0)

  return [localD[0] - localZero[0], localD[1] - localZero[1]]
}
function formatRectRange(x: number, y: number, x2: number, y2: number) {
  const min = [mathMin(x, x2), mathMin(y, y2)]
  const max = [mathMax(x, x2), mathMax(y, y2)]

  return [
    [min[0], max[0]], // x range
    [min[1], max[1]] // y range
  ]
}
function updateCoverAfterCreation(controller, cover, rectRange) {
  updateCommon(controller, cover)
  updateBaseRect(controller, cover, rectRange)
}
function updateCommon(controller, cover) {
  const brushOption = cover.__brushOption
  const transformable = brushOption.transformable

  console.log('cover')

  const mainEl = cover.childAt(0) as Displayable
  console.log('===========')

  const nameSequenceArr = [
    ['w'],
    ['e'],
    ['n'],
    ['s'],
    ['s', 'e'],
    ['s', 'w'],
    ['n', 'e'],
    ['n', 'w']
  ]
  nameSequenceArr.forEach((nameSequence) => {
    const el = cover.childOfName(nameSequence.join('')) as Displayable
    const globalDir =
      nameSequence.length === 1
        ? getGlobalDirection1(controller, nameSequence[0])
        : getGlobalDirection2(controller, nameSequence)
    console.log(globalDir)
    console.log(el)
    el &&
      el.attr({
        silent: !transformable,
        invisible: !transformable,
        cursor: transformable ? CURSOR_MAP[globalDir] + '-resize' : null
      })
  })
}
function getTransform(controller) {
  return graphic.getTransform(controller.group)
}

function getGlobalDirection1(controller, localDirName) {
  const map = { w: 'left', e: 'right', n: 'top', s: 'bottom' } as const
  const inverseMap = { left: 'w', right: 'e', top: 'n', bottom: 's' } as const
  const dir = graphic.transformDirection(map[localDirName], getTransform(controller))
  return inverseMap[dir]
}
function getGlobalDirection2(controller, localDirNameSeq) {
  const globalDir = [
    getGlobalDirection1(controller, localDirNameSeq[0]),
    getGlobalDirection1(controller, localDirNameSeq[1])
  ]
  ;(globalDir[0] === 'e' || globalDir[0] === 'w') && globalDir.reverse()
  return globalDir.join('') as keyof typeof CURSOR_MAP
}

function updateBaseRect(controller, cover, localRange) {
  const lineWidth = 0
  const handleSize = 6
  const x = localRange[0][0]
  const y = localRange[1][0]
  const xa = x - lineWidth / 2
  const ya = y - lineWidth / 2
  const x2 = localRange[0][1]
  const y2 = localRange[1][1]
  const x2a = x2 - handleSize + lineWidth / 2
  const y2a = y2 - handleSize + lineWidth / 2
  const width = x2 - x
  const height = y2 - y
  const widtha = width + lineWidth
  const heighta = height + lineWidth

  updateRectShape(controller, cover, 'main', x, y, width, height)
  updateRectShape(controller, cover, 'w', xa, ya, handleSize, heighta)
  updateRectShape(controller, cover, 'e', x2a, ya, handleSize, heighta)
  updateRectShape(controller, cover, 'n', xa, ya, widtha, handleSize)
  updateRectShape(controller, cover, 's', xa, y2a, widtha, handleSize)

  updateRectShape(controller, cover, 'nw', xa, ya, handleSize, handleSize)
  updateRectShape(controller, cover, 'ne', x2a, ya, handleSize, handleSize)
  updateRectShape(controller, cover, 'sw', xa, y2a, handleSize, handleSize)
  updateRectShape(controller, cover, 'se', x2a, y2a, handleSize, handleSize)
}
function updateRectShape(controller, cover, name, x: number, y: number, w: number, h: number) {
  const el = cover.childOfName(name) as graphic.Rect
  el &&
    (el as graphic.Rect).setShape(
      pointsToRect(
        clipByPanel(controller, cover, [
          [x, y],
          [x + w, y + h]
        ])
      )
    )
}
function pointsToRect(points: Point[]): graphic.Rect['shape'] {
  const xmin = mathMin(points[0][0], points[1][0])
  const ymin = mathMin(points[0][1], points[1][1])
  const xmax = mathMax(points[0][0], points[1][0])
  const ymax = mathMax(points[0][1], points[1][1])

  return {
    x: xmin,
    y: ymin,
    width: xmax - xmin,
    height: ymax - ymin
  }
}
function clipByPanel(controller, cover, data: Point[]): Point[] {
  const panel = getPanelByCover(controller, cover)

  return panel && panel !== BRUSH_PANEL_GLOBAL
    ? panel.clipPath(data, controller._transform)
    : clone(data)
}
function getPanelByCover(controller, cover) {
  const panels = controller._panels
  if (!panels) {
    return BRUSH_PANEL_GLOBAL // Global panel
  }
  const panelId = cover.__brushOption.panelId
  // User may give cover without coord sys info,
  // which is then treated as global panel.
  return panelId != null ? panels[panelId] : BRUSH_PANEL_GLOBAL
}

onMounted(() => {
  var zr = zrender.init(charts.value)
  console.log(zrender)
  console.log(zr)
  // console.log(zrender.setPlatformAPI())
  // zr.add(circle)
  zr.add(group)
  let _drag = false
  zr.on('mousedown', (e) => {
    _drag = true
  })
  zr.on('mousemove', (e) => {
    console.log(e)
    if (!_drag) return
    rect.attr({
      shape: {
        x: 10,
        y: 10,
        width: e.offsetX - 10,
        height: 100
      }
    })
  })
  zr.on('mouseup', (e) => {
    _drag = false
    console.log(e)
    rect.attr({
      shape: {
        x: 10,
        y: 10,
        width: e.offsetX - 10,
        height: 100
      }
    })
  })
})
</script>

<style scoped>
.charts-context {
  display: block;

  width: 500px;
  height: 500px;
  background-color: aqua;
}
</style>
