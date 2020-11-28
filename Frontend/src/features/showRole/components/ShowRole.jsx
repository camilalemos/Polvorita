import React, {useEffect, useState} from 'react';
import '../../../App.css'

export const handleSelectImgLoyalty = (playerLoyalty) => {

    let imageLoyalty
    
    switch (playerLoyalty) {
        case "PHOENIX_ORDER":
            imageLoyalty = (require('../../../constants/images/LoyaltyPO.png'));
            break;
        case "DEATH_EATERS":
            imageLoyalty = (require('../../../constants/images/LoyaltyDE.png'));
            break;
        default:
            imageLoyalty = (require('../../../constants/images/LoyaltyDefault.png'));
            break;
    }
    return imageLoyalty;
};


export const handelSelectImgRole = (playerRole, playerLoyalty) => {
    
    let imageRole

    const snapeSelectLoyalty = (snapeLoyalty) => {
        if (snapeLoyalty === "PHOENIX_ORDER") {
            imageRole =  (require('../../../constants/images/Roles/RoleSNAPEOF.png'));
        } else {
            imageRole = (require('../../../constants/images/Roles/RoleSNAPEM.png'));
        }
        return imageRole;
    }

    switch (playerRole) {
        case "BELLATRIX":
            imageRole = (require('../../../constants/images/Roles/RoleBELLATRIX.png'));
            break;                
        case "DOLORES":
            imageRole = (require('../../../constants/images/Roles/RoleDOLORES.png'));
            break;
        case "DRACO":
            imageRole = (require('../../../constants/images/Roles/RoleDRACO.png'));
            break;
        case "DUMBLEDORE":
            imageRole = (require('../../../constants/images/Roles/RoleDUMBLEDORE.png'));
            break;
        case "FRED":
            imageRole = (require('../../../constants/images/Roles/RoleFRED.png'));
            break;
        case "GEORGE":
            imageRole = (require('../../../constants/images/Roles/RoleGEORGE.png'));
            break;
        case "HARRY":
            imageRole = (require('../../../constants/images/Roles/RoleHARRY.png'));
            break;
        case "HERMIONE":
            imageRole = (require('../../../constants/images/Roles/RoleHERMIONE.png'));
            break;
        case "LUCIUS":
            imageRole = (require('../../../constants/images/Roles/RoleLUCIUS.png'));
            break;
        case "NEVILLE":
            imageRole = (require('../../../constants/images/Roles/RoleNEVILLE.png'));
            break;
        case "RON":
            imageRole = (require('../../../constants/images/Roles/RoleRON.png'));
            break;
        case "SIRIUS":
            imageRole = (require('../../../constants/images/Roles/RoleSIRIUS.png'));
            break;            
        case "SNAPE":
            imageRole = (snapeSelectLoyalty(playerLoyalty));
            break;            
        case "VOLDEMORT":
            imageRole = (require('../../../constants/images/Roles/RoleVOLDEMORT.png'));
            break;
        default:
            imageRole = (require('../../../constants/images/Roles/RoleDefault.png'));
            break;
    }
    return imageRole;
}

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
    
    

    return (

        <div style={{display: 'flex', flexDirection:'column', padding:20}}>
            <div style={{ display: 'flex', flexDirection:'row', justifyContent:'space-between'}}>
                <img  src={handelSelectImgRole(userRole, userLoyalty)} alt= "Role" style={{display: 'flex', width: '200px', height: '270', padding: 5}}/>
                <img src={handleSelectImgLoyalty(userLoyalty)} alt= "Loyalty" style={{display: 'flex', width: '200px', height: '270',padding: 5}}/>
            </div>
        </div>
    );
}; export default ShowRole;