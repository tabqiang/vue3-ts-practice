import Rect from 'zrender/src/graphic/shape/Rect'
import Path from 'zrender/src/graphic/Path'
import { Dictionary } from 'zrender/src/core/types'
import Group from 'zrender/src/graphic/Group'
import * as matrix from 'zrender/src/core/matrix'
import Transformable from 'zrender/src/core/Transformable'
import * as vector from 'zrender/src/core/vector'

import { isArrayLike } from 'zrender/src/core/util'

const _customShapeMap: Dictionary<{ new (): Path }> = {}

export function registerShape(name: string, ShapeClass: { new (): Path }) {
  _customShapeMap[name] = ShapeClass
}

export function getTransform(target, ancestor?) {
  const mat = matrix.identity([])

  while (target && target !== ancestor) {
    matrix.mul(mat, target.getLocalTransform(), mat)
    target = target.parent
  }

  return mat
}

export function transformDirection(
  direction: 'left' | 'right' | 'top' | 'bottom',
  transform,
  invert?
) {
  // Pick a base, ensure that transform result will not be (0, 0).
  const hBase =
    transform[4] === 0 || transform[5] === 0 || transform[0] === 0
      ? 1
      : Math.abs((2 * transform[4]) / transform[0])
  const vBase =
    transform[4] === 0 || transform[5] === 0 || transform[2] === 0
      ? 1
      : Math.abs((2 * transform[4]) / transform[2])

  let vertex: vector.VectorArray = [
    direction === 'left' ? -hBase : direction === 'right' ? hBase : 0,
    direction === 'top' ? -vBase : direction === 'bottom' ? vBase : 0
  ]

  vertex = applyTransform(vertex, transform, invert)

  return Math.abs(vertex[0]) > Math.abs(vertex[1])
    ? vertex[0] > 0
      ? 'right'
      : 'left'
    : vertex[1] > 0
    ? 'bottom'
    : 'top'
}
export function applyTransform(target, transform, invert?) {
  if (transform && !isArrayLike(transform)) {
    transform = Transformable.getLocalTransform(transform)
  }

  if (invert) {
    transform = matrix.invert([], transform as matrix.MatrixArray)
  }
  return vector.applyTransform([], target, transform as matrix.MatrixArray)
}

registerShape('rect', Rect)

export { Rect, Group }
