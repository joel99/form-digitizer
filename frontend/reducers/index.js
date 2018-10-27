const initState = require('./defaultState');
import * as types from '../actions/types';
// import { REQUEST_STATUS } from '../constants'; 
// No state passed -> revert to init
/* Quick redux map:
 * formInfo: null or dict
 * requestStatus: see constants
**/ 

function rootReducer(state = initState, action) {
  switch (action.type) {
    case types.UPDATE_FORM_FETCH:
      return { ...state, formFetchStatus: action.status };
    case types.LOAD_FORM_INFO:
      return { ...state }; // unimplemented
    default:
      return state;
  }
}

export default rootReducer;
