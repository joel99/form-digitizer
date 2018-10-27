import React from 'react';
import { Provider } from 'react-redux';
import Home from './Home';
import FormView from './FormView';
import MissingPage from './MissingPage';

import DevTools from './DevTools';
import Helmet from 'react-helmet';
import history  from '../actions/history';

import { Router, Route, Switch } from 'react-router-dom';

// import { Container, Segment } from 'semantic-ui-react';
import { COLORS } from '../constants';

// TODO: add style, theming
export default function Root({ store }) {  
	const routes = (<div>
		<Switch>
			<Route exact path="/" component={Home} />
			<Route path="/forms/:id" component={FormView} />
			<Route path="/error" component={MissingPage} />
			<Route component={MissingPage} />
		</Switch>
	</div>);
  return (
    <Provider store={store}>
      <div style={styles.root}>
				<Helmet bodyAttributes={styles.helmet} />
				<Router history={history}>
					{ routes }
				</Router>
				<DevTools/>
      </div>
    </Provider>
  );
};

const styles = {
	helmet: {
		style: `background-color: ${COLORS.background}`
	},
	root: {
		color: COLORS.primary,
	}
};