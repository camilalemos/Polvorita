import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import Chat from "../components/Chat";

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
)(Chat);

