import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import Chat from "../components/Chat";

function mapStateToProps(state) {
    return {
        status: state.chat.status
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

