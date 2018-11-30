import Grid from '../components/Grid';
import {bindActionCreators, Dispatch} from 'redux';
import {connect} from 'react-redux';
import {StoreState, ItemsAction} from '../types';
import {fetchItems} from '../actions';

const mapStateToProps = ({items, loading}: StoreState) => {
  return {
    items,
    loading
  }
};

const mapDispatchToProps = (dispatch: Dispatch<ItemsAction>) => bindActionCreators({
  getItems: fetchItems,
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(Grid);
