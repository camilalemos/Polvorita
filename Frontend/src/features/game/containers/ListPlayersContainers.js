import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import PlayerList from '../components/ListPlayers';

function mapStateToProps(state) {
    return {
        user: state.login.user,
    };
}

const mapDispatchToProps = (dispatch) => {
    return bindActionCreators({

    }, dispatch);
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(PlayerList);