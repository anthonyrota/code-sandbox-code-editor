import { Record } from 'immutable'
import History from './History'
import RangeList from './RangeList'

export default class EditorState extends Record({
  history: History(),
  ranges: RangeList(),
  text: ''
}) {}
