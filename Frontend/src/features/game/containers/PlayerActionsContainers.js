import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import PlayersActions from '../components/PlayersActions';

import { selectDirector, vote } from '../actions/playersActions';

function mapStateToProps(state) {
    return {
        user: state.login.user,
        status: state.playerActionsReducer.status
    };
}


const mapDispatchToProps = (dispatch) => {
    return bindActionCreators({
        selectDirector,
        vote
    }, dispatch);
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(PlayersActions);
