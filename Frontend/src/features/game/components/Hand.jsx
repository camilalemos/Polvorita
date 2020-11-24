import React from "react";
import Snackbar from '@material-ui/core/Snackbar';

export default function Hand({ open, onClose, cards }) {

   
    const assignImgProclamation = (cards) => {
       let image
        if (cards === "PHOENIX_ORDER") {
            image = <img src={require('../../../constants/images/ProclamationOP.png')} alt= "Proclamation Phoenix Order" style={{width: "150px", height: "190px"}}></img>
        } else if (cards === "DEATH_EATERS" ){
            image = <img src={require('../../../constants/images/ProclamationDE.png')} alt= "Proclamation Death Eater" style={{width: "150px", height: "190px"}}></img>
        }
        return image;
    }
    const handleSelectImgLoyalty = (playerLoyalty) => {

        let imageLoyalty
        
        switch (playerLoyalty) {
            case "PHOENIX_ORDER":
                imageLoyalty =  <img src={(require('../../../constants/images/LoyaltyPO.png'))} alt= "Proclamation Phoenix Order" style={{width: "150px", height: "190px"}}></img>
                break;
            case "DEATH_EATERS":
                imageLoyalty =  <img src={(require('../../../constants/images/LoyaltyDE.png'))} alt= "Proclamation Phoenix Order" style={{width: "150px", height: "190px"}}></img>;
                break;
            default:
                imageLoyalty = <img src={(require('../../../constants/images/LoyaltyDefault.png'))} alt= "Proclamation Phoenix Order" style={{width: "150px", height: "190px"}}></img>;
                break;
        }
        return imageLoyalty;
    };

    return (
        <div>
            <Snackbar open={open} display= 'flex'>
                <div>
                {console.log("HERE PRRO " + cards)}
                    {cards !== null &&
                        <button onClick={ onClose}>
                        {console.log("HERE PRRO")}
                        {handleSelectImgLoyalty(cards)}
                        </button>
                    }
                    {cards !==null && cards.length === 3 && cards.map((card) => (
                    <button onClick={ onClose}>
                    {assignImgProclamation(card)}
                    </button>
                    ))}
                </div>
            </Snackbar>
        </div>
    );
}

