import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import Lobby from '../components/Lobby';

import { startGame } from '../actions/joingameAction'
 
function mapStateToProps(state) {
    return {
        user: state.login.user,
        statusStart: state.joingame.statusStart
    };
}


const mapDispatchToProps = (dispatch) => {
    return bindActionCreators({
        startGame
    }, dispatch);
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Lobby);
