import React, { useState, useEffect } from 'react';

export default function PlayerList({ gameInfo }) {

    const [playersInfo, setPlayersInfo] = useState([]);

    useEffect(() => {
        if (gameInfo.players)
            setPlayersInfo(Object.values(gameInfo.players));
    }, [gameInfo])

    return (
        <div style={{ display: 'flex', flexDirection: 'column', padding: 10 }}>
            {playersInfo.map((player) => {

                let textcolorlist
                
                if (player.is_alive === true)
                    textcolorlist = <h style={{ fontSize: 26, padding: 3 }}> {player.name}</h>
                else
                    textcolorlist = <h style={{ color: "grey", textDecoration: 'line-through', fontSize: 26, padding: 3 }}> {player.name} </h>
                return textcolorlist
            })}
        </div>
    )
}