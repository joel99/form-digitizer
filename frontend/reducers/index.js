const initState = require('./defaultState');

// No state passed -> revert to init
function rootReducer(state = initState, action) {
  switch (action.type) {
    default:
      return state;
  }
}

export default rootReducer;
