import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import Joingame from '../components/Joingame';

import { joingame, reconnectGame } from '../actions/joingameAction';
import { logout } from '../../../features/login/actions/LoginAction';

function mapStateToProps(state) {
    return {
        status: state.joingame.status,
        user: state.login.user,
        errorMsg: state.joingame.errorMsg,
        reconnectGames: state.joingame.reconnectGames
    };
}


const mapDispatchToProps = (dispatch) => {
    return bindActionCreators({
        joingame,
        logout,
        reconnectGame
    }, dispatch);
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Joingame);
