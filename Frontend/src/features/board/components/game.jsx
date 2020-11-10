import React, { useState } from 'react';
import Board from 'board';


export default function Game () {
    return (
        <div className="game">
        <div className="game-board">
          <Board />
        </div>
        <div className="game-info">
          <div>{/* status */}</div>
          <ol>{/* TODO */}</ol>
        </div>
      </div>
    );
}