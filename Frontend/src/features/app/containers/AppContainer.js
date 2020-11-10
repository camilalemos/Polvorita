import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import App from '../components/App';

import { getUserData } from '../../login/actions/LoginAction';

function mapStateToProps(state) {
    return {
        statusLogin: state.login.statusLogin,
        is_logged: state.login.is_logged
    };
}

const mapDispatchToProps = (dispatch) => {
    return bindActionCreators({
        getUserData
    }, dispatch);
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(App);
