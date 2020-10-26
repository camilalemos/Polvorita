import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import Register from '../components/Register';

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
)(Register);
