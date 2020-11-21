import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { createGame } from '../actions/CreateGameActions';
import CreateGameForm from "../components/CreateGameForm";

function mapStateToProps(state) {
    return {
        status: state.createGame.status,
        statusCode: state.createGame.statusCode
    };
}

const mapDispatchToProps = (dispatch) => {
    return bindActionCreators({ 
        createGame
    }, dispatch);
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(CreateGameForm);