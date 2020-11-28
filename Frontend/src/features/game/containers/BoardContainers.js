import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import Board from '../components/board';

import {  getProclamationsInfo, discardproclamation } from '../actions/enactproclamationAction'

function mapStateToProps(state) {
    return {
        user: state.login.user,
        statusGetProclamation: state.enactProclamation.statusGetProclamation,
        proclamationsInfo: state.enactProclamation.proclamationsInfo,
        statusDiscardProclamation: state.enactProclamation.statusDiscardProclamation,
    };
}

const mapDispatchToProps = (dispatch) => {
    return bindActionCreators({
        getProclamationsInfo,
        discardproclamation,
    }, dispatch);
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Board);
