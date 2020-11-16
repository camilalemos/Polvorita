import React, { useEffect, useState } from 'react';
import Button from '@material-ui/core/Button';
import SelectDirectorCandidate from './SelectDirectorCandidate';

const PlayersAction = ({ gameInfo, user, selectDirector, status, vote }) => {

    const [minister, setMinister] = useState('');
    const [players, setPlanyers] = useState([]);
    const [currentPlayer, setCurrentPlayer] = useState(null);
    const [isCandidateMinister, setIsCandidateMinister] = useState(false);
    const [openModal, setOpenModal] = useState(false);
    const [candidatePlayers, setCandidatePlayers] = useState([]);
    const [voting, setVoting] = useState(false)

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

    useEffect(() => {
        if(gameInfo.length !== 0) {
            if (gameInfo.elections.headmaster_candidate) setVoting(true);
        }
    },[gameInfo])

    const handleVote = (type) => {
        vote(currentPlayer.name, type, gameInfo.name)
    }

    return (
        <div style={{ padding:20, display:'flex', flexDirection:'column' }}>
            {isCandidateMinister && !gameInfo.elections.headmaster_candidate &&
                <Button color='secondary' style={{ backgroundColor: 'lightblue', width:200 }} onClick={() => setOpenModal(true)}>
                    Choose director
                </Button>
            }
            {isCandidateMinister && gameInfo.elections.headmaster_candidate &&
                <a style={{flex:1, textAlign:'center', fontSize:30 }}>Voting Time!!</a>
            }
            {voting && !isCandidateMinister &&
                <>
                <a style={{ flex:1, textAlign:'center', fontSize:30 }}>Candidate to director is: {gameInfo.elections.headmaster_candidate}</a>
                <div style={{ display:'flex', flexDirection:'row', justifyContent:'center', marginTop:30 }} >
                    <Button size='large' style={{ backgroundColor: 'lightblue', marginRight:40 }} onClick={() => handleVote("LUMUS")}>
                        LUMUS
                    </Button>
                    <Button size='large' style={{ backgroundColor: 'lightblue' }} onClick={() => handleVote("NOX")} >
                        NOX
                    </Button>
                </div>
                </>
            }
        <SelectDirectorCandidate open={openModal} onClose={() => setOpenModal(false)} candidatePlayers={candidatePlayers} selectDirector={(playerName) => selectDirector(playerName, currentPlayer.name, gameInfo.name)} vote={(playerName, newVote) => vote(newVote, playerName, gameInfo.name) } />
        </div>
    )

}

export default PlayersAction;