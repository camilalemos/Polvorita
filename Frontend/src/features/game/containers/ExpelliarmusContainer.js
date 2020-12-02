import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { expelliarmus } from '../actions/expelliarmusAction';
import Expelliarmus from "../components/Expelliarmus";

function mapStateToProps(state) {
    return {
        status: state.expelliarmus.status,
        user: state.login.user,
        errorMsg: state.expelliarmus.errorMsg,
    };
}

const mapDispatchToProps = (dispatch) => {
    return bindActionCreators({ 
       expelliarmus
    }, dispatch);
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Expelliarmus);

