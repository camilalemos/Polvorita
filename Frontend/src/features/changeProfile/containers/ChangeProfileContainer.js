import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { getUserInfo } from '../actions/changeProfileAction';
import ChangeProfile from "../components/ChangeProfile";

function mapStateToProps(state) {
    return {
        status: state.getUserInfo.status,
        statusCode: state.getUserInfo.statusCode,
        userInfo: state.getUserInfo.userInfo
    };
}

const mapDispatchToProps = (dispatch) => {
    return bindActionCreators({ 
        getUserInfo
    }, dispatch);
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(ChangeProfile);

