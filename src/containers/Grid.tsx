import Grid from '../components/Grid';
import {bindActionCreators, Dispatch} from 'redux';
import {connect} from 'react-redux';
import {StoreState, ItemsAction} from '../types';
import {fetchItems, setGridColumnCount} from '../actions';

const mapStateToProps = ({columnCount, items, loading}: StoreState) => {
  return {
    columnCount,
    items,
    loading
  }
};

const mapDispatchToProps = (dispatch: Dispatch<ItemsAction>) => bindActionCreators({
  getItems: fetchItems,
  setGridColumnCount
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(Grid);
