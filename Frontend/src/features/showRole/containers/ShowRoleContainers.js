import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import ShowRole from '../components/ShowRole';

function mapStateToProps(state) {
    return {

    };
}


const mapDispatchToProps = (dispatch) => {
    return bindActionCreators({

    }, dispatch);
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(ShowRole);
