import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import Login from '../components/Login';

import { loginUser } from '../actions/LoginAction';

function mapStateToProps(state) {
    return {
        status: state.login.status
    };
}

const mapDispatchToProps = (dispatch) => {
    return bindActionCreators({
        loginUser
    }, dispatch);
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Login);
