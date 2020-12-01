import { dark } from '@material-ui/core/styles/createPalette';
import React, { useState, useEffect } from 'react';

export default function PlayerList({ gameInfo, user }) {

    const [playersInfo, setPlayersInfo] = useState([]);
    const [currentPlayer, setCurrentPlayer] = useState(null);
    const [isDeathEaters, setIsDeathEaters] = useState(false);
    const [numPlayers, setNumPlayers] = useState()
    const [isVoldemort, setIsVoldemort] = useState(false)

    useEffect(() => {
        if (gameInfo.players) {
            setPlayersInfo(Object.values(gameInfo.players));
        }
        setNumPlayers(gameInfo.num_players);
    }, [gameInfo])
    

    useEffect(() => {
        if (gameInfo.length !== 0) {
            setCurrentPlayer(playersInfo.filter(player => player.user_name === user.username)[0]);
        }
    }, [user, currentPlayer, playersInfo, gameInfo])

    useEffect(() => {
        if (currentPlayer) {
            if ('DEATH_EATERS' === currentPlayer.loyalty) {
                setIsDeathEaters(true);
            } else {
                setIsDeathEaters(false);
            }
        }
    }, [currentPlayer, setIsDeathEaters])

    useEffect(() => {
        if (currentPlayer) {
            if ('VOLDEMORT' === currentPlayer.role) {
                setIsVoldemort(true);
            } else {
                setIsVoldemort(false);
            }
        }
    }, [currentPlayer, setIsVoldemort])

    return (
        <div style={{ display: 'flex', flexDirection: 'column', padding: 10, paddingLeft:'10%' }}>
            {playersInfo.map((player) => {

                let textcolorlist

                if (player.is_alive === true){
                    if (numPlayers < 7){
                    textcolorlist = <h style={{ fontSize: 26, padding: 3 }}> 
                        {player.name}
                        {isDeathEaters && player.loyalty === 'DEATH_EATERS' && player.role !== 'VOLDEMORT' &&
                            <h style={{ fontSize: 26, padding: 3, color: '#34203b' }}> is {'Death Eater'}</h>}
                        {isDeathEaters && player.loyalty === 'DEATH_EATERS' && player.role === 'VOLDEMORT' &&
                            <h style={{ fontSize: 26, padding: 3, color: '#34203b' }}> is {'Voldemort'}</h>}
                    </h>
                    } else {
                        textcolorlist = <h style={{ fontSize: 26, padding: 3 }}> 
                        {player.name}
                        {isDeathEaters && player.loyalty === 'DEATH_EATERS' && player.role !== 'VOLDEMORT' && !isVoldemort &&
                            <h style={{ fontSize: 26, padding: 3, color: '#34203b' }}> is {'Death Eater'}</h>}
                        {isDeathEaters && player.loyalty === 'DEATH_EATERS' && player.role === 'VOLDEMORT' && !isVoldemort &&
                            <h style={{ fontSize: 26, padding: 3, color: '#34203b' }}> is {'Voldemort'}</h>}
                        </h>
                    }
                } else {
                    textcolorlist = <h style={{ color: "#6b1e24", textDecoration: 'line-through', fontSize: 26, padding: 3 }}>
                        {player.name} </h>
                    }
                return textcolorlist
            })}
        </div>
    )
}