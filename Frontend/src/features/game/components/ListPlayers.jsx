import React, { useState, useEffect } from 'react';

export default function PlayerList({ gameInfo }) {

    const [playersInfo, setPlayersInfo] = useState([]);
    /* const [minister, setMinister] = useState('');
    const [director, setDirector] = useState('');
    const [candidateMinister, setCandidateMinister] = useState('');
    const [candidateDirector, setCandidateDirector] = useState(''); */

    useEffect(() => {
        if (gameInfo.players)
            setPlayersInfo(Object.values(gameInfo.players));
        /* if (gameInfo.length !== 0) {
            setDirector(gameInfo.elections.headmaster);
            setMinister(gameInfo.elections.minister);
            setCandidateDirector(gameInfo.elections.headmaster_candidate);
            setCandidateMinister(gameInfo.elections.minister_candidate);
        } */
    }, [gameInfo])

    return (
        <div style={{ display: 'flex', flexDirection: 'column', padding: 10 }}>
            {playersInfo.map((player) => {
                let textcolorlist
                if (player.is_alive === true)
                    textcolorlist = <a style={{ fontSize: 26, padding: 3 }}> {player.name}</a>
                else
                    textcolorlist = <a style={{ color: "grey", textDecoration: 'line-through', fontSize: 26, padding: 3 }}> {player.name} </a>
                return textcolorlist
            })}
        </div>
    )
}