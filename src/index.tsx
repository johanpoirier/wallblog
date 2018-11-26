import * as React from 'react';
import * as ReactDOM from 'react-dom';
import {Provider} from 'react-redux';
import {createStore} from 'redux';
import {EnthusiasmAction} from './actions';
import Grid from './containers/Grid';
import './index.css';
import {enthusiasm} from './reducers';
import registerServiceWorker from './registerServiceWorker';
import {StoreState} from './types';

const store = createStore<StoreState, EnthusiasmAction, any, any>(enthusiasm, {
    items: [
        {
            description: 'plop',
            extension: 'jpg',
            filename: 'abstract-1168134_1920'
        },
        {
            description: 'Filou',
            extension: 'jpg',
            filename: 'boats-1183373_1920'
        }
    ]
});

ReactDOM.render(
    <Provider store={store}>
        <Grid/>
    </Provider>,
    document.getElementById('root') as HTMLElement
);
registerServiceWorker();
