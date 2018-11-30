import * as React from 'react';
import * as ReactDOM from 'react-dom';
import {Provider} from 'react-redux';
import {createStore, applyMiddleware} from 'redux';
import thunk from 'redux-thunk';
import {logger} from 'redux-logger';
import Grid from './containers/Grid';
import './index.css';
import {items} from './reducers';
import registerServiceWorker from './registerServiceWorker';
import {StoreState, ItemsAction} from './types';

const store = createStore<StoreState, ItemsAction, any, any>(items, {
  items: []
}, applyMiddleware(thunk, logger));

ReactDOM.render(
  <Provider store={store}>
    <Grid/>
  </Provider>,
  document.getElementById('root') as HTMLElement
);
registerServiceWorker();
