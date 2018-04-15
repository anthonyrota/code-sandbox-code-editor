import { List } from 'immutable'
import RangeList from '../../src/models/RangeList'
import Range from '../../src/models/Range'

describe('RangeList', () => {
  it('is a function', () => {
    expect(typeof RangeList).toBe('function')
  })

  it('can be called without the new keyword', () => {
    RangeList()
    expect('focusedRangeIndex' in RangeList()).toBe(true)
    expect('ranges' in RangeList()).toBe(true)
  })

  it('can be called with the new keyword', () => {
    new RangeList()
    expect('focusedRangeIndex' in new RangeList()).toBe(true)
    expect('ranges' in new RangeList()).toBe(true)
  })

  describe('static isRangeList', () => {
    it('is a function', () => {
      expect(RangeList.isRangeList(new RangeList())).toBe(true)
      expect(RangeList.isRangeList(RangeList())).toBe(true)
      expect(RangeList.isRangeList()).toBe(false)
      expect(RangeList.isRangeList(RangeList)).toBe(false)
      expect(RangeList.isRangeList({})).toBe(false)
    })
  })

  describe('focusedRangeIndex', () => {
    it('defaults to zero', () => {
      expect(RangeList().focusedRangeIndex).toBe(0)
    })

    it('can be overriden', () => {
      expect(
        RangeList({
          ranges: List.of(Range(), Range(), Range()),
          focusedRangeIndex: 1
        }).focusedRangeIndex
      ).toBe(1)
    })

    it('throws when is out of bounds', () => {
      expect(() => RangeList({ focusedRangeIndex: 3 })).toThrow(
        '[RangeList] constructor: The focusedRangeIndex (3) is either greater than the size of the ranges or less than zero'
      )
      expect(() => RangeList({ focusedRangeIndex: -1 })).toThrow(
        '[RangeList] constructor: The focusedRangeIndex (-1) is either greater than the size of the ranges or less than zero'
      )
      expect(() =>
        RangeList({ focusedRangeIndex: 3, ranges: List.of(Range()) })
      ).toThrow(
        '[RangeList] constructor: The focusedRangeIndex (3) is either greater than the size of the ranges (1) or less than zero'
      )
      expect(() =>
        RangeList({ focusedRangeIndex: -1, ranges: List.of(Range(), Range()) })
      ).toThrow(
        '[RangeList] constructor: The focusedRangeIndex (-1) is either greater than the size of the ranges (2) or less than zero'
      )
      RangeList({ focusedRangeIndex: 0 })
      RangeList({ focusedRangeIndex: 0, ranges: List.of(Range()) })
      RangeList({
        focusedRangeIndex: 2,
        ranges: List.of(Range(), Range(), Range(), Range())
      })
    })
  })

  describe('ranges', () => {
    it('defaults to a list with one range in it', () => {
      expect(RangeList().ranges).toEqual(List.of(Range()))
    })

    it('can be overriden', () => {
      const ranges = List.of(Range(), Range(), Range())
      expect(RangeList({ ranges }).ranges).toBe(ranges)
    })
  })

  describe('rangeCount', () => {
    it('returns the size of the ranges', () => {
      expect(RangeList().rangeCount).toBe(1)
      expect(RangeList({ ranges: List.of(Range(), Range()) }).rangeCount).toBe(
        2
      )
      expect(
        RangeList({ ranges: List.of(Range(), Range(), Range()) }).rangeCount
      ).toBe(3)
    })
  })

  describe('focusedRange', () => {
    it('returns the currently focused range', () => {
      let r = RangeList()
      expect(r.focusedRange).toEqual(r.getRange(0))
      r = RangeList({ ranges: List.of(Range(), Range(), Range()) })
      expect(r.focusedRange).toEqual(r.getRange(0))
      r = RangeList({
        ranges: List.of(Range(), Range(), Range(), Range()),
        focusedRangeIndex: 2
      })
      expect(r.focusedRange).toEqual(r.getRange(2))
      r = RangeList({
        ranges: List.of(Range(), Range(), Range(), Range()),
        focusedRangeIndex: 3
      })
      expect(r.focusedRange).toEqual(r.getRange(3))
    })
  })

  describe('getRange', () => {
    const r1 = Range()
    const r2 = Range()
    const r3 = Range()
    const r4 = Range()
    const ranges1 = List.of(r1)
    const ranges2 = List.of(r1, r2, r3, r4)
    const rangeList1 = RangeList({ ranges: ranges1 })
    const rangeList2 = RangeList({ ranges: ranges2 })

    it('returns the range at the given index', () => {
      expect(RangeList().getRange(0)).toEqual(Range())
      expect(rangeList1.getRange(0)).toBe(r1)
      expect(rangeList2.getRange(0)).toBe(r1)
      expect(rangeList2.getRange(1)).toBe(r2)
      expect(rangeList2.getRange(2)).toBe(r3)
      expect(rangeList2.getRange(3)).toBe(r4)
    })

    it('throws when an invalid index is given', () => {
      expect(() => rangeList1.getRange(-1)).toThrow(
        '[RangeList] getRange: the index is either less than zero or greater than the amount of ranges'
      )
      expect(() => rangeList1.getRange(1)).toThrow(
        '[RangeList] getRange: the index is either less than zero or greater than the amount of ranges'
      )
      expect(() => rangeList1.getRange(8)).toThrow(
        '[RangeList] getRange: the index is either less than zero or greater than the amount of ranges'
      )
      expect(() => rangeList2.getRange(-5)).toThrow(
        '[RangeList] getRange: the index is either less than zero or greater than the amount of ranges'
      )
      expect(() => rangeList2.getRange(-1)).toThrow(
        '[RangeList] getRange: the index is either less than zero or greater than the amount of ranges'
      )
      expect(() => rangeList2.getRange(4)).toThrow(
        '[RangeList] getRange: the index is either less than zero or greater than the amount of ranges'
      )
      expect(() => rangeList2.getRange(7)).toThrow(
        '[RangeList] getRange: the index is either less than zero or greater than the amount of ranges'
      )
    })
  })

  describe('setFocusedRangeIndex', () => {
    const rangeList1 = RangeList({ ranges: List.of(Range()) })
    const rangeList2 = RangeList({
      ranges: List.of(Range(), Range(), Range(), Range())
    })

    it('sets the focused range index to the one given', () => {
      expect(RangeList().setFocusedRangeIndex(0).focusedRangeIndex).toBe(0)
      expect(rangeList1.setFocusedRangeIndex(0).focusedRangeIndex).toBe(0)
      expect(rangeList2.setFocusedRangeIndex(0).focusedRangeIndex).toBe(0)
      expect(rangeList2.setFocusedRangeIndex(1).focusedRangeIndex).toBe(1)
      expect(rangeList2.setFocusedRangeIndex(2).focusedRangeIndex).toBe(2)
      expect(rangeList2.setFocusedRangeIndex(3).focusedRangeIndex).toBe(3)
    })

    it('throws when an invalid index is given', () => {
      expect(() => rangeList1.setFocusedRangeIndex(-1)).toThrow(
        '[RangeList] setFocusedRangeIndex: the index is either less than zero or greater than the amount of ranges'
      )
      expect(() => rangeList1.setFocusedRangeIndex(1)).toThrow(
        '[RangeList] setFocusedRangeIndex: the index is either less than zero or greater than the amount of ranges'
      )
      expect(() => rangeList1.setFocusedRangeIndex(8)).toThrow(
        '[RangeList] setFocusedRangeIndex: the index is either less than zero or greater than the amount of ranges'
      )
      expect(() => rangeList2.setFocusedRangeIndex(-5)).toThrow(
        '[RangeList] setFocusedRangeIndex: the index is either less than zero or greater than the amount of ranges'
      )
      expect(() => rangeList2.setFocusedRangeIndex(-1)).toThrow(
        '[RangeList] setFocusedRangeIndex: the index is either less than zero or greater than the amount of ranges'
      )
      expect(() => rangeList2.setFocusedRangeIndex(4)).toThrow(
        '[RangeList] setFocusedRangeIndex: the index is either less than zero or greater than the amount of ranges'
      )
      expect(() => rangeList2.setFocusedRangeIndex(7)).toThrow(
        '[RangeList] setFocusedRangeIndex: the index is either less than zero or greater than the amount of ranges'
      )
    })
  })

  // setRanges(ranges) {
  //   return this.set('ranges', ranges).simplify()
  // }

  // addRange(range) {
  //   return this.setRanges(this.ranges.push(range)).simplify()
  // }
})
