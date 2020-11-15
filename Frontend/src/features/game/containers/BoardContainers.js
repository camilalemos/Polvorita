import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import Board from '../components/board';


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
)(Board);
