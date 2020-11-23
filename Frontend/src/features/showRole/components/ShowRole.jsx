import React, {useEffect, useState} from 'react';
import '../../../App.css'

const ShowRole = ({ user , gameInfo }) => {

    const [playersInfo, setplayersInfo] = useState([]);
    const [userLoyalty, setUserLotalty] = useState('');
    const [userRole, setUserRole] = useState('');

    useEffect(() => {
		if(gameInfo.players){
			setplayersInfo(Object.values(gameInfo.players).filter(player => player.user_name === user.username)[0]);
            setUserLotalty(playersInfo?.loyalty)
            setUserRole(playersInfo?.role)
		}
	},[gameInfo])
    
    const handleSelectImgLoyalty = (playerLoyalty) => {
        
        if ( playerLoyalty === "PHOENIX_ORDER") {
            return (require('../../../constants/images/LoyaltyPO.png'));
        } else {
            return (require('../../../constants/images/LoyaltyDE.png'));
        }
    };

    const handelSelectImgRole = (playerRole) => {

        const snapeSelectLoyalty = (snapeLoyalty) => {
            if (snapeLoyalty === "PHOENIX_ORDER") {
                return (require('../../../constants/images/Roles/RoleSNAPEOF.png'));
            } else {
                return (require('../../../constants/images/Roles/RoleSNAPEM.png'));
            }
        }

        switch (playerRole) {
            case "BELLATRIX":
                return (require('../../../constants/images/Roles/RoleBELLATRIX.png'));

            case "DOLORES":
                return (require('../../../constants/images/Roles/RoleDOLORES.png'));

            case "DRACO":
                return (require('../../../constants/images/Roles/RoleDRACO.png'));

            case "DUMBLEDORE":
                return (require('../../../constants/images/Roles/RoleDUMBLEDORE.png'));

            case "FRED":
                return (require('../../../constants/images/Roles/RoleFRED.png'));

            case "GEORGE":
                return (require('../../../constants/images/Roles/RoleGEORGE.png'));

            case "HARRY":
                return (require('../../../constants/images/Roles/RoleHARRY.png'));

            case "HERMIONE":
                return (require('../../../constants/images/Roles/RoleHERMIONE.png'));

            case "LUCIUS":
                return (require('../../../constants/images/Roles/RoleLUCIUS.png'));

            case "NEVILLE":
                return (require('../../../constants/images/Roles/RoleNEVILLE.png'));

            case "RON":
                return (require('../../../constants/images/Roles/RoleRON.png'));

            case "SIRIUS":
                return (require('../../../constants/images/Roles/RoleSIRIUS.png'));
            
            case "SNAPE":
                return (snapeSelectLoyalty(userLoyalty));
            
            case "VOLDEMORT":
                return (require('../../../constants/images/Roles/RoleVOLDEMORT.png'));
            default:
                return("Image Not Found")
        }
    }

    return (

        <div style={{display: 'flex', flexDirection:'column', padding:20}}>
            <div style={{ display: 'flex', flexDirection:'row', justifyContent:'space-between'}}>

            <div style= {{display: 'flex', flexDirection:'column', justifyContent:'center', alignItems:'center'}}>
                <p style={{ flex: 1, textAlign: 'center', verticalAlign:'center' , fontSize:30 }}>Role: {userRole}</p>
                <img  src={handelSelectImgRole(userRole)} alt= "Role" style={{display: 'flex', width: '200px', height: '270'}}/>
            </div>  
            <div style= {{display: 'flex', flexDirection:'column', justifyContent:'center', alignItems:'center'}}>
                <p style={{ flex: 1, textAlign: 'center', verticalAlign:'center', fontSize:30 }}>Loyalty: {userLoyalty}</p>
                <img src={handleSelectImgLoyalty(userLoyalty)} alt= "Loyalty" style={{display: 'flex', width: '200px', height: '270'}}/>
            </div>  

            </div>
        </div>
    );
}; export default ShowRole;