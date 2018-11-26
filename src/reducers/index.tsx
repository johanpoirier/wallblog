import { EnthusiasmAction } from '../actions';
import { StoreState } from '../types';
import { DECREMENT_ENTHUSIASM, INCREMENT_ENTHUSIASM } from '../constants';

export function enthusiasm(state: StoreState, action: EnthusiasmAction): StoreState {
    switch (action.type) {
        case INCREMENT_ENTHUSIASM:
            return { ...state };
        case DECREMENT_ENTHUSIASM:
            return { ...state };
    }
    return state;
}
