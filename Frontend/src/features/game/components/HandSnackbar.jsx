import React from "react";
import Snackbar from '@material-ui/core/Snackbar';
import {handleSelectImgLoyalty} from '../../showRole/components/ShowRole'
export default function Hand({ open, onClose, cards }) {

   
    const assignImgProclamation = (cards) => {
       let image
        if (cards === "PHOENIX_ORDER") {
            image = require('../../../constants/images/ProclamationOP.png')
        } else if (cards === "DEATH_EATERS" ){
            image = require('../../../constants/images/ProclamationDE.png')
        }
        return image;
    }

    return (
        <div>
            <Snackbar open={open} display= 'flex'>
                <div>
                    {cards !== null && cards.length > 3 && 
                        <button onClick={ onClose}>
                            <img  src={handleSelectImgLoyalty(cards)} alt= "Proclamation" style={{width: "150px", height: "190px"}}/>
                        </button>
                    }
                    {cards !==null && cards.length === 3 && cards.map((card) => (
                    <button onClick={ onClose}>
                        <img  src={assignImgProclamation(card)} alt= "Proclamation" style={{width: "150px", height: "190px"}}/>
                    </button>
                    ))}
                </div>
            </Snackbar>
        </div>
    );
}

