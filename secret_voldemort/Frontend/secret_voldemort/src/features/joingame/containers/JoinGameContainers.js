import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import Joingame from '../components/Joingame';

import { joingame } from '../actions/joingameAction'

function mapStateToProps(state) {
    return {
        status: state.joingame.status
    };
}


const mapDispatchToProps = (dispatch) => {
    return bindActionCreators({
        joingame
    }, dispatch);
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Joingame);
