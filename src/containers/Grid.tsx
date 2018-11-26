import Grid from '../components/Grid';
import { connect } from 'react-redux';
import { StoreState } from '../types';

export function mapStateToProps({ items }: StoreState) {
    return {
        items
    }
}

export default connect(mapStateToProps)(Grid);
