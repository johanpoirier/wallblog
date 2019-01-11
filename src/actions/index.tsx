import * as constants from '../constants'
import {Dispatch} from 'redux';
import {ApiItem} from '../types';

export const requestItems = () => ({
  type: constants.REQUEST_ITEMS,
});

export const receivedItems = (items: ApiItem[]) => {
  const transformedItems = items.map(item => {
    const itemFileParts = item.file.split('.');
    return {
      date: item.date,
      description: item.description,
      extension: itemFileParts.pop(),
      filename: itemFileParts.shift(),
      ratio: item.ratio
    }
  });
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

export function setGridColumnCount(count: number) {
  const root = document.getElementById('root');
  if (root) {
    const firstItemColumnCount = count > 1 ? 2 : 1;
    root.style.setProperty('--grid-column-count', count.toString(10));
    root.style.setProperty('--first-item-column-count', firstItemColumnCount.toString(10));
  }
  return {type: constants.SET_GRID_COLUMN_COUNT};
}
