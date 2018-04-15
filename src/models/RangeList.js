import { Record, List } from 'immutable'
import Range from './Range'
import hoistStatics from '../utils/hoistStatics'

class RangeList extends Record({
  focusedRangeIndex: 0,
  ranges: List.of(Range())
}) {
  static isRangeList(candidate) {
    return !!candidate && candidate.$$model$typeof === '@@__RANGE_LIST__@@'
  }

  $$model$typeof = '@@__RANGE_LIST__@@'

  get rangeCount() {
    return this.ranges.size
  }

  get focusedRange() {
    return this.ranges.get(this.focusedRangeIndex)
  }

  getRange(index) {
    if (index < 0 || index >= this.ranges.size) {
      throw new Error(
        '[RangeList] getRange: the index is either less than zero or greater than the amount of ranges'
      )
    }
    return this.ranges.get(index)
  }

  setFocusedRangeIndex(index) {
    if (index < 0 || index >= this.ranges.size) {
      throw new Error(
        '[RangeList] setFocusedRangeIndex: the index is either less than zero or greater than the amount of ranges'
      )
    }
    return this.set('focusedRangeIndex', index)
  }

  setRanges(ranges) {
    return this.merge({
      ranges,
      focusedRangeIndex: Math.min(this.focusedRangeIndex, ranges.size - 1)
    }).simplify()
  }

  addRange(range) {
    return this.merge({
      ranges: this.ranges.push(range),
      focusedRangeIndex: this.focusedRangeIndex + 1
    }).simplify()
  }

  removeRangeAtIndex(index) {
    if (index < 0 || index >= this.ranges.size) {
      throw new Error(
        '[RangeList] removeRangeAtIndex: The given index is either less than zero or greater than the amount of ranges'
      )
    }
    return this.merge({
      ranges: this.ranges.remove(index),
      focusedRangeIndex:
        index === this.focusedRangeIndex
          ? 0
          : index < this.focusedRangeIndex
            ? this.focusedRangeIndex - 1
            : this.focusedRangeIndex
    }).simplify()
  }

  removeRange(range) {
    const index = this.ranges.findIndex(other => other === range)
    if (index === -1) {
      throw new Error(
        '[RangeList] removeRange: The given range is not one of the current ranges'
      )
    }
    return this.removeRangeAtIndex(index)
  }

  simplify() {
    const focusOffsets = this.ranges
      .map(range => range.focusOffset)
      .sort((a, b) => a - b)
    const ranges = this.ranges.sort((a, b) => a.anchorOffset - b.anchorOffset)

    let i = 0
    let j = 0
    let active = 0

    const n = ranges.size
    const groups = []
    const cur = []

    while (true) {
      if (i < n && ranges[i].anchorOffset < focusOffsets[j]) {
        cur.push(ranges[i++])
        ++active
      } else if (j < n) {
        ++j
        if (--active === 0) {
          groups.push(cur)
          cur.length = 0
        }
      } else {
        break
      }
    }

    const newRanges = List(groups)

    if (newRanges.size !== ranges.size) {
      const focusedRangeIndex = groups.findIndex(range =>
        range.contains(this.focusedRange)
      )
      if (focusedRangeIndex === -1) {
        throw new Error(
          '[RangeList] simplify: The new focusedRangeIndex is (-1) meaning that no simplified range contains it, which should never happen'
        )
      }
      return this.merge({ ranges: newRanges, focusedRangeIndex })
    }

    return this.setRanges(newRanges)
  }
}

export default hoistStatics(RangeList, (args = {}) => {
  if ('ranges' in args && args.ranges.size === 0) {
    throw new Error(
      '[RangeList] constructor: The ranges must have a size greater than zero'
    )
  }

  if (
    'focusedRangeIndex' in args &&
    (('ranges' in args &&
      (args.focusedRangeIndex >= args.ranges.size ||
        args.focusedRangeIndex < 0)) ||
      (!('ranges' in args) && args.focusedRangeIndex !== 0))
  ) {
    throw new Error(
      `[RangeList] constructor: The focusedRangeIndex (${
        args.focusedRangeIndex
      }) is either greater than the size of the ranges ${
        'ranges' in args ? `(${args.ranges.size}) ` : ''
      }or less than zero`
    )
  }

  return new RangeList(args)
})
