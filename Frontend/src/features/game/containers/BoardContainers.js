import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import Board from '../components/board';

import { enacproclamation, getProclamationsInfo } from '../actions/enactproclamationAction'

function mapStateToProps(state) {
    return {
        user: state.login.user,
        status: state.enacproclamation.status,
        statusGetProclamation: state.enacproclamation.statusGetProclamation,
        errorMsg: state.enacproclamation.errorMsg,
        proclamationsInfo: state.enacproclamation.proclamationsInfo
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
