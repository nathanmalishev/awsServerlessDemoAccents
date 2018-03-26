import { combineReducers } from 'redux'

const talks = (state = [], action) => {
  switch (action.type) {
    case 'ADD_TALK':
      return [
        {
          key: action.key,
          name: action.name,
        },
        ...state,
      ]
    case 'INIT_TALKS':
      return action.data
    default:
      return state
  }
}

const createLoaderReducer = (loaderName = '') => (state = false, action) => {
  switch (action.type) {
    case `${loaderName}_GET_DATA`:
      return true
    case `${loaderName}_RECIEVE_DATA`:
      return false
    case `${loaderName}_RECIEVE_ERROR`:
      return false
    default:
      return state
  }
}

export default combineReducers({
  talks,
  listTalksLoading: createLoaderReducer('listTalks'),
  getTalkLoading: createLoaderReducer('getTalks'),
})
