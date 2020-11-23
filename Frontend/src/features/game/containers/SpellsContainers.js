import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import Spells from '../components/Spells';
import {castSpell} from '../actions/SpellsActions'

function mapStateToProps(state) {
    return {
        status: state.SpellsReducer.status,
        user: state.login.user,
        errorMsg: state.SpellsReducer.errorMsg,
        threeCards: state.SpellsReducer.threeCards
    };
}

const mapDispatchToProps = (dispatch) => {
    return bindActionCreators({
        castSpell
    }, dispatch);
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Spells);
