import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import Lobby from '../components/Lobby';

function mapStateToProps(state) {
    return {
    };
}


const mapDispatchToProps = (dispatch) => {
    return bindActionCreators({
    }, dispatch);
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Lobby);
