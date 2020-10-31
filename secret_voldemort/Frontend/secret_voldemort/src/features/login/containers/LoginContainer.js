import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import Login from '../components/Login';

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
)(Login);
