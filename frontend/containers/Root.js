import PropTypes from 'prop-types';
import React from 'react';
import { Provider } from 'react-redux';
import Home from './Home.js';
import MissingPage from './MissingPage.js';

import Navigation from './Navigation';

import DevTools from './DevTools';
import Helmet from 'react-helmet';

import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

export default function Root({ store }) {  
  return (
    <Provider store={store}>
      <div>
	<Helmet bodyAttributes={styles.helmetStyle} />
	<Router>
	  <div>
	    <Navigation />
	    <Switch>
	      <Route exact path="/" component={Home} />
	      <Route path="/forms/:id" component={FormView} />
	      <Route path="/error" component={MissingPage} />
	      <Route component={MissingPage} />
	    </Switch>
	  </div>
	</Router>
	<DevTools/>
      </div>
    </Provider>
  );
};
