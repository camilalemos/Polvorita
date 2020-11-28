import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import Spells from '../components/Spells';
import {castSpell} from '../actions/SpellsActions'

function mapStateToProps(state) {
    return {
        status: state.spellsReducer.status,
        user: state.login.user,
        errorMsg: state.spellsReducer.errorMsg,
        cards: state.spellsReducer.cards
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
