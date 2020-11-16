import React, {useEffect, useState} from 'react';

const ShowRole = ({ user , game }) => {

    const [gameInfo, setGameInfo] = useState([]);
    const [playersInfo, setplayersInfo] = useState([]);
    const [userLoyalty, setUserLotalty] = useState('');
    const [userRole, setUserRole] = useState('');

    useEffect(() => {

		const ws = new WebSocket(`ws://190.190.133.175:8000/game/${game}`);

		ws.onopen = () => {
		ws.send(JSON.stringify({event: 'game:subscribe'}));
		};

		ws.onmessage = (event) => {
        setGameInfo(JSON.parse(event.data));
        console.log(gameInfo)
		};

		ws.onclose = () => {
		ws.close();
		};

		return () => {
		ws.close();
		};
    });
    
    useEffect(() => {
		if(gameInfo.players){
			setplayersInfo(Object.values(gameInfo.players).filter(player => player.user_name === "Testedor1")[0]);
            setUserLotalty(playersInfo?.loyalty)
            setUserRole(playersInfo?.role)
		}
	},[gameInfo])
    
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