import {StoreState, ItemsAction} from '../types';
import {REQUEST_ITEMS, RECEIVE_ITEMS} from '../constants';

export function items(state: StoreState, action: ItemsAction): StoreState {
    switch (action.type) {
        case REQUEST_ITEMS:
            return {...state, loading: true};
        case RECEIVE_ITEMS:
            return {...state, items: action.payload, loading: false};
    }
    return state;
}
