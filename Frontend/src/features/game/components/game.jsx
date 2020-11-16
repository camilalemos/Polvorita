import React from 'react';
import Board from './board';
import ShowRoleContainers from '../../../features/showRole/containers/ShowRoleContainers';
import { useParams } from 'react-router-dom';


export default function Game () {

    const { game } = useParams();

    return (
      <div  style={{display:'flex', flex:1, flexDirection:'row', backgroundColor:'blue', height:'100%'}} >
        
        <div className="game" style={{display:'flex', flex:1}}><ShowRoleContainers game={ game }/> </div>
        <div className="game-board" style={{display:'flex', flex:2.5, backgroundColor:'red'}}>
          <Board />
        </div>
        <div className="game-info" style={{display:'flex', flex:.7, backgroundColor:'yellow'}}>
          <div>{/* status */}</div>
          <ol>{/* TODO */}</ol>
        </div>
      </div>
    );
}