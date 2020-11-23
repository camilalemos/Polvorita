import React, {Component, useState, useEffect} from "react";
import Snackbar from '@material-ui/core/Snackbar';


export default function Hand({ open, onClose, threeCards }) {

    const assignImgProclamation = (proclamations) => {
       let image
        if (proclamations === "PHOENIX_ORDER") {
            image = <img src={require('../../../constants/images/ProclamacionF.jpg')} alt= "Proclamacion Orden Fenix" style={{width: "150px", height: "190px"}}></img>
        } else if (proclamations === "DEATH_EATERS" ){
            image = <img src={require('../../../constants/images/ProclamacionM.jpg')} alt= "Proclamacion Mortifagos" style={{width: "150px", height: "190px"}}></img>
        } 
        return image;
    }

    return (
        <div>
            <Snackbar open={open} display= 'flex'>
                <div>
                    {threeCards !==null && threeCards.map((proclamation) => (
                    <button onClick={ onClose}>
                    {assignImgProclamation(proclamation)}
                    </button>
                    ))}
                </div>
            </Snackbar>
        </div>
    );
}

