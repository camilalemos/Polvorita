import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import App from '../components/App';

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
)(App);
