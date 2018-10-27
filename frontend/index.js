import React from 'react';
import { render } from 'react-dom';
import { configureStore } from './store/configureStore';
import defaultState from './reducers/defaultState';
import Root from './containers/Root';
import '../node_modules/semantic-ui-css/semantic.min.css';
const store = configureStore(defaultState);

render(
    <Root store={store} history={history} />,
    document.getElementById('root')
);
