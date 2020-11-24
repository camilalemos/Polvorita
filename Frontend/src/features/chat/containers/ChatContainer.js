import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { sendMessage } from '../actions/chatAction'
import Chat from "../components/Chat";

function mapStateToProps(state) {
    return {
        status: state.chat.status,
        errorMsg: state.chat.errorMsg
    };
}

const mapDispatchToProps = (dispatch) => {
    return bindActionCreators({ 
        sendMessage
    }, dispatch);
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Chat);

