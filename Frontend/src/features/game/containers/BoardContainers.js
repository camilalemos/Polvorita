import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import Board from '../components/board';

import { enacproclamation, getProclamationsInfo } from '../actions/enactproclamationAction'

function mapStateToProps(state) {
    return {
        user: state.login.user,
        status: state.enactProclamation.status,
        statusGetProclamation: state.enactProclamation.statusGetProclamation,
        errorMsg: state.enactProclamation.errorMsg,
        proclamationsInfo: state.enactProclamation.proclamationsInfo
    };
}

const mapDispatchToProps = (dispatch) => {
    return bindActionCreators({
        enacproclamation,
        getProclamationsInfo,
    }, dispatch);
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Board);
