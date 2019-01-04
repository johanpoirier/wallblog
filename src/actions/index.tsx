import * as constants from '../constants'
import {Dispatch} from 'redux';
import {ApiItem} from '../types';

export const requestItems = () => ({
  type: constants.REQUEST_ITEMS,
});

export const receivedItems = (items: ApiItem[]) => {
  const transformedItems = items.map(item => ({
    description: item.description,
    extension: item.file.split('.').pop(),
    filename: item.file.split('.').shift(),
    ratio: item.ratio
  }));
  return {
    payload: transformedItems,
    type: constants.RECEIVE_ITEMS
  }
};

export function fetchItems() {
  return (dispatch: Dispatch) => {
    dispatch(requestItems());
    return fetch(`/api/item`)
      .then(async response => {
        const items = await response.json();
        dispatch(receivedItems(items));
      })
      .catch(console.error);
  };
}
