import React, {useEffect, useState} from 'react';

const ShowRole = ({ user }) => {

    const [gameInfo, setGameInfo] = useState([]);
    const userLoyalty = "DEATH_EATERS";
    const userRole = "SNAPE"

    useEffect(() => {

		const ws = new WebSocket('ws://localhost:8000/game/Test1');

		ws.onopen = () => {
		ws.send(JSON.stringify({event: 'game:subscribe'}));
		};

		ws.onmessage = (event) => {
		setGameInfo(JSON.parse(event.data));
	    console.log(gameInfo);
		};

		ws.onclose = () => {
		ws.close();
		};

		return () => {
		ws.close();
		};
    });
    
    const handleSelectImgLoyalty = (playerLoyalty) => {
        
        if ( playerLoyalty === "PHOENIX_ORDER") {
            return (require('../../../constants/images/LoyaltyOF.jpg'));
        } else {
            return (require('../../../constants/images/LoyaltyM.jpg'));
        }
    };

    const handelSelectImgRole = (playerRole) => {

        const snapeSelectLoyalty = (snapeLoyalty) => {
            if (snapeLoyalty === "PHOENIX_ORDER") {
                return (require('../../../constants/images/Roles/RoleSNAPEOF.jpg'));
            } else {
                return (require('../../../constants/images/Roles/RoleSNAPEM.jpg'));
            }
        }

        switch (playerRole) {
            case "BELLATRIX":
                return (require('../../../constants/images/Roles/RoleBELLATRIX.jpg'));

            case "DOLORES":
                return (require('../../../constants/images/Roles/RoleDOLORES.jpg'));

            case "DRACO":
                return (require('../../../constants/images/Roles/RoleDRACO.jpg'));

            case "DUMBLEDORE":
                return (require('../../../constants/images/Roles/RoleDUMBLEDORE.jpg'));

            case "FRED":
                return (require('../../../constants/images/Roles/RoleFRED.jpg'));

            case "GEORGE":
                return (require('../../../constants/images/Roles/RoleGEORGE.jpg'));

            case "HARRY":
                return (require('../../../constants/images/Roles/RoleHARRY.jpg'));

            case "HERMIONE":
                return (require('../../../constants/images/Roles/RoleHERMIONE.jpg'));

            case "LUCIUS":
                return (require('../../../constants/images/Roles/RoleLUCIUS.jpg'));

            case "NEVILLE":
                return (require('../../../constants/images/Roles/RoleNEVILLE.jpg'));

            case "RON":
                return (require('../../../constants/images/Roles/RoleRON.jpg'));

            case "SIRIUS":
                return (require('../../../constants/images/Roles/RoleSIRIUS.jpg'));
            
            case "SNAPE":
                return (snapeSelectLoyalty(userLoyalty));
            
            case "VOLDEMORT":
                return (require('../../../constants/images/Roles/RoleVOLDEMORT.jpg'));
            default:
                return("Image Not Found")
        }
    }

    return (

        <div style={{display: 'flex', flexDirection:'column', padding:40}}>
            <div style= {{display: 'flex', marginBottom: 40}}>
                <p style={{ flex: 1, textAlign: 'center', fontSize:40 }}>Role: {userRole}</p>
                <p style={{ flex: 1, textAlign: 'center', fontSize:40 }}>Loyalty: {userLoyalty}</p>
            </div>  
            <div style={{ display: 'flex', flexDirection:'row', justifyContent:'space-between'}}>
            <img src={handelSelectImgRole(userRole)} alt= "Role" style={{display: 'flex', width: '49%'}}/>
            <img src={handleSelectImgLoyalty(userLoyalty)} alt= "Loyalty" style={{display: 'flex', width: '49%'}}/>
            </div>
        </div>
    );
}; export default ShowRole;