import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import Board from '../components/board';
import { enacproclamation} from '../actions/enactproclamationAction'

function mapStateToProps(state) {
    return {
        user: state.login.user,
    };
}


const mapDispatchToProps = (dispatch) => {
    return bindActionCreators({
        enacproclamation
    }, dispatch);
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Board);
