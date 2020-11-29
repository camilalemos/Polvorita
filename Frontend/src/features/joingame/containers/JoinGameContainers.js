import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import Joingame from '../components/Joingame';

import { joingame } from '../actions/joingameAction';
import { logout } from '../../../features/login/actions/LoginAction';

function mapStateToProps(state) {
    return {
        status: state.joingame.status,
        user: state.login.user,
        errorMsg: state.joingame.errorMsg
    };
}


const mapDispatchToProps = (dispatch) => {
    return bindActionCreators({
        joingame,
        logout
    }, dispatch);
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Joingame);
