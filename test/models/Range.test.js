import Range from '../../src/models/Range'

describe('Range', () => {
  it('is a function', () => {
    expect(typeof Range).toBe('function')
  })

  it('can be called without the new keyword', () => {
    Range()
    expect(Range().anchorOffset).toBe(0)
    expect(Range().focusOffset).toBe(0)
  })

  it('can be called with the new keyword', () => {
    new Range()
    expect(new Range().anchorOffset).toBe(0)
    expect(new Range().focusOffset).toBe(0)
  })

  describe('static isRange', () => {
    it('is a function', () => {
      expect(typeof Range.isRange).toBe('function')
    })

    it('checks if the arguments is a Range object', () => {
      expect(Range.isRange(new Range())).toBe(true)
      expect(Range.isRange(Range())).toBe(true)
      expect(Range.isRange()).toBe(false)
      expect(Range.isRange(Range)).toBe(false)
      expect(Range.isRange({})).toBe(false)
    })
  })

  describe('anchorOffset', () => {
    it('defaults to zero', () => {
      expect(Range().anchorOffset).toBe(0)
      expect(Range({ focusOffset: 50 }).anchorOffset).toBe(0)
    })

    it('can be overriden', () => {
      expect(Range({ anchorOffset: 2 }).anchorOffset).toBe(2)
      expect(Range({ anchorOffset: 4, focusOffset: 8 }).anchorOffset).toBe(4)
    })

    it('throws when it is not a number', () => {
      expect(() => Range({ anchorOffset: false })).toThrow(
        '[Range] constructor: the anchorOffset must be a number'
      )
    })

    it('throws when it is NaN', () => {
      expect(() => Range({ anchorOffset: NaN })).toThrow(
        '[Range] constructor: the anchorOffset cannot be NaN'
      )
    })
  })

  describe('focusOffset', () => {
    it('defaults to zero', () => {
      expect(Range().focusOffset).toBe(0)
      expect(Range({ anchorOffset: 50 }).focusOffset).toBe(0)
    })

    it('can be overriden', () => {
      expect(Range({ focusOffset: 2 }).focusOffset).toBe(2)
      expect(Range({ focusOffset: 4, anchorOffset: 8 }).focusOffset).toBe(4)
    })

    it('throws when it is not a number', () => {
      expect(() => Range({ focusOffset: false })).toThrow(
        '[Range] constructor: the focusOffset must be a number'
      )
    })

    it('throws when it is NaN', () => {
      expect(() => Range({ focusOffset: NaN })).toThrow(
        '[Range] constructor: the focusOffset cannot be NaN'
      )
    })
  })

  describe('isCollapsed', () => {
    it("tests whether a range's anchorOffset equals its focusOffset", () => {
      expect(Range().isCollapsed).toBe(true)
      expect(Range({ anchorOffset: 1, focusOffset: 1 }).isCollapsed).toBe(true)
      expect(Range({ anchorOffset: 2 }).isCollapsed).toBe(false)
      expect(Range({ anchorOffset: 1, focusOffset: 4 }).isCollapsed).toBe(false)
    })
  })

  describe('isExpanded', () => {
    it("tests whether a range's anchorOffset does not equal its focusOffset", () => {
      expect(Range().isExpanded).toBe(false)
      expect(Range({ anchorOffset: 1, focusOffset: 1 }).isExpanded).toBe(false)
      expect(Range({ anchorOffset: 2 }).isExpanded).toBe(true)
      expect(Range({ anchorOffset: 1, focusOffset: 4 }).isExpanded).toBe(true)
    })
  })

  describe('isBackwards', () => {
    it("tests whether a range's anchorOffset is greater than its focusOffset", () => {
      expect(Range({ anchorOffset: 1 }).isBackwards).toBe(true)
      expect(Range({ anchorOffset: 20, focusOffset: 2 }).isBackwards).toBe(true)
      expect(Range({ anchorOffset: 2, focusOffset: 4 }).isBackwards).toBe(false)
      expect(Range({ focusOffset: 1 }).isBackwards).toBe(false)
      expect(Range().isBackwards).toBe(false)
      expect(Range({ anchorOffset: 6, focusOffset: 6 }).isBackwards).toBe(false)
    })
  })

  describe('isForwards', () => {
    it("tests whether a range's anchorOffset is less than or equal to its focusOffset", () => {
      expect(Range({ anchorOffset: 1 }).isForwards).toBe(false)
      expect(Range({ anchorOffset: 20, focusOffset: 2 }).isForwards).toBe(false)
      expect(Range({ anchorOffset: 2, focusOffset: 4 }).isForwards).toBe(true)
      expect(Range({ focusOffset: 1 }).isForwards).toBe(true)
      expect(Range().isForwards).toBe(true)
      expect(Range({ anchorOffset: 6, focusOffset: 6 }).isForwards).toBe(true)
    })
  })

  describe('firstOffset', () => {
    it('returns the smallest out of the focus and anchor offsets', () => {
      expect(Range().firstOffset).toBe(0)
      expect(Range({ anchorOffset: 1 }).firstOffset).toBe(0)
      expect(Range({ focusOffset: 18, anchorOffset: 12 }).firstOffset).toBe(12)
      expect(Range({ anchorOffset: 16, focusOffset: 4 }).firstOffset).toBe(4)
    })
  })

  describe('lastOffset', () => {
    it('returns the largest out of the focus and and anchor offsets', () => {
      expect(Range().lastOffset).toBe(0)
      expect(Range({ anchorOffset: 1 }).lastOffset).toBe(1)
      expect(Range({ focusOffset: 18, anchorOffset: 12 }).lastOffset).toBe(18)
      expect(Range({ anchorOffset: 16, focusOffset: 4 }).lastOffset).toBe(16)
    })
  })

  describe('flip', () => {
    it('swaps the anchor and focus offsets', () => {
      expect(Range().flip()).toEqual(Range({ anchorOffset: 0, focusOffset: 0 }))
      expect(Range({ anchorOffset: 2, focusOffset: 6 }).flip()).toEqual(
        Range({ anchorOffset: 6, focusOffset: 2 })
      )
      expect(Range({ anchorOffset: 50, focusOffset: 0 }).flip()).toEqual(
        Range({ anchorOffset: 0, focusOffset: 50 })
      )
    })
  })

  describe('setBackwards', () => {
    it('sets the range to be backwards if the anchor and focus offsets are different', () => {
      expect(Range().setBackwards().isBackwards).toBe(false)
      expect(
        Range({ anchorOffset: 6, focusOffset: 6 }).setBackwards().isBackwards
      ).toBe(false)
      expect(
        Range({ anchorOffset: 20, focusOffset: 3 }).setBackwards().isBackwards
      ).toBe(true)
      expect(
        Range({ anchorOffset: 2, focusOffset: 16 }).setBackwards().isBackwards
      ).toBe(true)
    })
  })

  describe('setForwards', () => {
    it('sets the range to be forwards', () => {
      expect(Range().setForwards().isForwards).toBe(true)
      expect(
        Range({ anchorOffset: 6, focusOffset: 6 }).setForwards().isForwards
      ).toBe(true)
      expect(
        Range({ anchorOffset: 20, focusOffset: 3 }).setForwards().isForwards
      ).toBe(true)
      expect(
        Range({ anchorOffset: 2, focusOffset: 16 }).setForwards().isForwards
      ).toBe(true)
    })
  })

  describe('setAnchorOffset', () => {
    it('sets the anchor offset to the one given', () => {
      expect(Range().setAnchorOffset(2).anchorOffset).toBe(2)
      expect(Range({ anchorOffset: 6 }).setAnchorOffset(0).anchorOffset).toBe(0)
      expect(Range({ anchorOffset: 23 }).setAnchorOffset(47).anchorOffset).toBe(
        47
      )
    })
  })

  describe('setFocusOffset', () => {
    it('sets the focus offset to the one given', () => {
      expect(Range().setFocusOffset(2).focusOffset).toBe(2)
      expect(Range({ focusOffset: 6 }).setFocusOffset(0).focusOffset).toBe(0)
      expect(Range({ focusOffset: 23 }).setFocusOffset(47).focusOffset).toBe(47)
    })
  })

  describe('moveAnchorOffset', () => {
    it('moves the anchor offset by the amount given', () => {
      expect(Range().moveAnchorOffset(2).anchorOffset).toBe(2)
      expect(Range({ anchorOffset: 6 }).moveAnchorOffset(-2).anchorOffset).toBe(
        4
      )
      expect(
        Range({ anchorOffset: 14 }).moveAnchorOffset(23).anchorOffset
      ).toBe(37)
    })
  })

  describe('moveFocusOffset', () => {
    it('moves the focus offset by the amount given', () => {
      expect(Range().moveFocusOffset(2).focusOffset).toBe(2)
      expect(Range({ focusOffset: 6 }).moveFocusOffset(-2).focusOffset).toBe(4)
      expect(Range({ focusOffset: 14 }).moveFocusOffset(23).focusOffset).toBe(
        37
      )
    })
  })

  describe('collapseAnchor', () => {
    it('sets the focus offset to the anchor offset', () => {
      expect(Range().collapseAnchor()).toEqual(Range())
      expect(
        Range({ anchorOffset: 5, focusOffset: 5 }).collapseAnchor()
      ).toEqual(Range({ anchorOffset: 5, focusOffset: 5 }))
      expect(
        Range({ anchorOffset: 5, focusOffset: 12 }).collapseAnchor()
      ).toEqual(Range({ anchorOffset: 5, focusOffset: 5 }))
      expect(
        Range({ anchorOffset: 16, focusOffset: 2 }).collapseAnchor()
      ).toEqual(Range({ anchorOffset: 16, focusOffset: 16 }))
    })
  })

  describe('collapseFocus', () => {
    it('sets the focus offset to the focus offset', () => {
      expect(Range().collapseFocus()).toEqual(Range())
      expect(
        Range({ anchorOffset: 5, focusOffset: 5 }).collapseFocus()
      ).toEqual(Range({ anchorOffset: 5, focusOffset: 5 }))
      expect(
        Range({ anchorOffset: 5, focusOffset: 12 }).collapseFocus()
      ).toEqual(Range({ anchorOffset: 12, focusOffset: 12 }))
      expect(
        Range({ anchorOffset: 16, focusOffset: 2 }).collapseFocus()
      ).toEqual(Range({ anchorOffset: 2, focusOffset: 2 }))
    })
  })

  describe('collapseBackwards', () => {
    it('sets both offsets to the first offset', () => {
      expect(Range().collapseBackwards()).toEqual(Range())
      expect(
        Range({ anchorOffset: 4, focusOffset: 4 }).collapseBackwards()
      ).toEqual(Range({ anchorOffset: 4, focusOffset: 4 }))
      expect(
        Range({ anchorOffset: 2, focusOffset: 14 }).collapseBackwards()
      ).toEqual(Range({ anchorOffset: 2, focusOffset: 2 }))
      expect(
        Range({ anchorOffset: 17, focusOffset: 6 }).collapseBackwards()
      ).toEqual(Range({ anchorOffset: 6, focusOffset: 6 }))
    })
  })

  describe('collapseForwards', () => {
    it('sets both offsets to the last offset', () => {
      expect(Range().collapseForwards()).toEqual(Range())
      expect(
        Range({ anchorOffset: 4, focusOffset: 4 }).collapseForwards()
      ).toEqual(Range({ anchorOffset: 4, focusOffset: 4 }))
      expect(
        Range({ anchorOffset: 2, focusOffset: 14 }).collapseForwards()
      ).toEqual(Range({ anchorOffset: 14, focusOffset: 14 }))
      expect(
        Range({ anchorOffset: 17, focusOffset: 6 }).collapseForwards()
      ).toEqual(Range({ anchorOffset: 17, focusOffset: 17 }))
    })
  })

  describe('contains', () => {
    const assertContains = (doesContain, offsets) =>
      offsets.forEach(offset =>
        [[0, 1, 2, 3], [1, 0, 2, 3], [0, 1, 3, 2], [1, 0, 3, 2]].forEach(
          indices => {
            expect(
              Range({
                anchorOffset: offset[indices[0]],
                focusOffset: offset[indices[1]]
              }).contains(
                Range({
                  anchorOffset: offset[indices[2]],
                  focusOffset: offset[indices[3]]
                })
              )
            ).toBe(doesContain)
          }
        )
      )

    it('returns true if the ranges are the same', () => {
      assertContains(true, [
        [0, 0, 0, 0],
        [2, 2, 2, 2],
        [4, 7, 4, 7],
        [3, 9, 3, 9]
      ])
    })

    it('returns true if the range contains the other range', () => {
      assertContains(true, [
        [3, 7, 3, 7],
        [4, 9, 4, 8],
        [4, 9, 5, 9],
        [18, 26, 20, 24],
        [4, 7, 5, 5]
      ])
    })

    it('returns false if the range does not contain the other range', () => {
      assertContains(false, [
        [3, 3, 2, 2],
        [6, 6, 7, 7],
        [3, 4, 1, 2],
        [4, 7, 8, 9],
        [4, 7, 3, 5],
        [4, 7, 3, 4],
        [4, 7, 6, 8],
        [4, 7, 7, 8],
        [4, 8, 4, 9],
        [5, 9, 4, 9],
        [20, 24, 18, 26],
        [5, 5, 4, 7]
      ])
    })
  })
})
