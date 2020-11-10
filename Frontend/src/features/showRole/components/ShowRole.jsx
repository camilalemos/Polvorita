import React from 'react';
//import Lealtad from '../../../constants/images/Fondo.jpg'

const ShowRole = () => {



    return (

        <div style={{display: 'flex', flexDirection:'column', padding:40}}>
            <div style= {{display: 'flex', marginBottom: 40}}>
                <a style={{ flex: 1, textAlign: 'center', fontSize:40 }}>Role:</a>
                <a style={{ flex: 1, textAlign: 'center', fontSize:40 }}>Loyalty:</a>
            </div>  
            <div style={{ display: 'flex', flexDirection:'row', justifyContent:'space-between'}}>
            <img src={require('../../../constants/images/OFchar1.jpg')} style={{display: 'flex', width: '49%'}}/>
                <img src={require('../../../constants/images/LoyaltyOF.jpg')} style={{display: 'flex', width: '49%'}}/>
            </div>
        </div>
    );
}; export default ShowRole;