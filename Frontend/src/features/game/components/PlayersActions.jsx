import React, { useEffect, useState } from 'react';
import Button from '@material-ui/core/Button';
import SelectDirectorCandidate from './SelectDirectorCandidate';

const PlayersAction = ({ gameInfo, user, selectDirector, status }) => {

    const [minister, setMinister] = useState('');
    const [players, setPlanyers] = useState([]);
    const [currentPlayer, setCurrentPlayer] = useState(null);
    const [isCandidateMinister, setIsCandidateMinister] = useState(false);
    const [openModal, setOpenModal] = useState(false);
    const [candidatePlayers, setCandidatePlayers] = useState([]);

    useEffect(() => {
        if (gameInfo.length !== 0) {
            let players = Object.keys(gameInfo.players);
            setPlanyers(Object.values(gameInfo.players));
            let indexPlayerMinister = players.findIndex(names => names === gameInfo.elections.minister_candidate);
            setMinister(indexPlayerMinister);
        }
    }, [gameInfo, setPlanyers, setMinister])

    useEffect(() => {
        setCurrentPlayer(players.filter(player => player.user_name === user.username)[0]);
    }, [user, currentPlayer, players])


    useEffect(() => {
        if(gameInfo.length !== 0 && currentPlayer ){
            if(gameInfo.elections.minister_candidate === currentPlayer.name ) setIsCandidateMinister(true);
        }
    },[setIsCandidateMinister, gameInfo, currentPlayer])

    useEffect(() => {
        let array = [];
        if(isCandidateMinister) {
            for(const player of players) {
                if(player.name !== currentPlayer.name) array.push(player);
            }

        }
        setCandidatePlayers(array);
    },[setCandidatePlayers,players,currentPlayer])

    return (
        <div style={{ padding:20 }}>
            {isCandidateMinister &&
                <Button color='secondary' style={{ backgroundColor: 'lightblue' }} onClick={() => setOpenModal(true)}>
                    Choose director
                </Button>

            }
        <SelectDirectorCandidate open={openModal} onClose={() => setOpenModal(false)} candidatePlayers={candidatePlayers} selectDirector={(playerName) => selectDirector(playerName, currentPlayer.name, gameInfo.name)} />
        </div>
    )

}

export default PlayersAction;