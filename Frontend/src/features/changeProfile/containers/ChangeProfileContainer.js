import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import ChangePorfile from "../components/ChangeProfile";

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
)(ChangePorfile);