import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import Register from '../components/Register';

import { registerUser } from '../actions/RegisterActions';

function mapStateToProps(state) {
    return {
        status: state.register.status
    };
}

const mapDispatchToProps = (dispatch) => {
    return bindActionCreators({
        registerUser
    }, dispatch);
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Register);
