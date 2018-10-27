import PropTypes from 'prop-types';
import React from 'react';
import { Provider } from 'react-redux';
import Home from './Home';
import FormView from './FormView';
import MissingPage from './MissingPage';
import Navigation from './Navigation';

import DevTools from './DevTools';
import Helmet from 'react-helmet';

import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

import { Container, Segment } from 'semantic-ui-react';

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
      <div>
				<Helmet />
				<Navigation />
				<Container>	
					<Segment>					
						<Router>
							{ routes }
						</Router>
					</Segment>
				</Container>
				<DevTools/>
      </div>
    </Provider>
  );
};
