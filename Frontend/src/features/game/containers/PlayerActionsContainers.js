import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import PlayersActions from '../components/PlayersActions';

import { selectDirector, vote, getResults } from '../actions/playersActions';

function mapStateToProps(state) {
    return {
        user: state.login.user,
        statusVote: state.playerActionsReducer.statusVote,
        statusResults: state.playerActionsReducer.statusResults,
        results: state.playerActionsReducer.results
    };
}

const mapDispatchToProps = (dispatch) => {
    return bindActionCreators({
        selectDirector,
        vote,
        getResults
    }, dispatch);
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(PlayersActions);
