import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import Board from '../components/board';

import { enactproclamation, getProclamationsInfo } from '../actions/enactproclamationAction'

function mapStateToProps(state) {
    return {
        user: state.login.user,
        status: state.enactProclamation.status,
        statusGetProclamation: state.enactProclamation.statusGetProclamation,
        proclamationsInfo: state.enactProclamation.proclamationsInfo
    };
}

const mapDispatchToProps = (dispatch) => {
    return bindActionCreators({
        enactproclamation,
        getProclamationsInfo,
    }, dispatch);
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Board);
