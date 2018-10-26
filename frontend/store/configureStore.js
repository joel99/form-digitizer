import { createStore, compose, applyMiddleware } from 'redux';
import thunkMiddleware from 'redux-thunk'
import rootReducer from '../reducers';
import DevTools from '../containers/DevTools';

import defaultState from '../reducers/defaultState';

export function configureStore(initialState) {
    return createStore(
        rootReducer,
        Object.assign({}, initialState),
        compose(
            applyMiddleware(thunkMiddleware),
            DevTools.instrument()
        ),
    );
};
