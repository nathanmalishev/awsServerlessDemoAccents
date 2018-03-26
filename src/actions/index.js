

export const addTalk = (key, name) => ({
  type: 'ADD_TALK',
  key,
  name,
})

export const initTalks = talks => ({
  type: 'INIT_TALKS',
  data: talks,
})

export const startLoading = actionType => ({
  type: actionType,
})

export const endLoading = actionType => ({
  type: actionType,
})
