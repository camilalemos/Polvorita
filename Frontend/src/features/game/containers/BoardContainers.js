import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import Board from '../components/board';

import { enactproclamation, getProclamationsInfo, discardproclamation } from '../actions/enactproclamationAction'

function mapStateToProps(state) {
    return {
        user: state.login.user,
        status: state.enactProclamation.status,
        statusGetProclamation: state.enactProclamation.statusGetProclamation,
        proclamationsInfo: state.enactProclamation.proclamationsInfo,
        statusDiscardProclamation: state.enactProclamation.statusDiscardProclamation,
    };
}

const mapDispatchToProps = (dispatch) => {
    return bindActionCreators({
        enactproclamation,
        getProclamationsInfo,
        discardproclamation,
    }, dispatch);
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Board);
