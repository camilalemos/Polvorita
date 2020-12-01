import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { quitGame } from '../actions/quitGameAction';
import WinPopUp from '../components/winPopUp';

function mapStateToProps(state) {
    return {
        status: state.winPopUp.status,
        user: state.login.user,
    };
}

const mapDispatchToProps = (dispatch) => {
    return bindActionCreators({
        quitGame
    }, dispatch);
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(WinPopUp);