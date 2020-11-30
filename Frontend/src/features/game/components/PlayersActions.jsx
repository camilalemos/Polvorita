import React, { useEffect, useState } from 'react';
import Button from '@material-ui/core/Button';
import SelectDirectorCandidate from './SelectDirectorCandidate';
import { Fireplace, SettingsVoiceOutlined } from '@material-ui/icons';

const PlayersAction = ({ gameInfo, user, selectDirector, vote, statusResults,results, putResults }) => {

    const [minister, setMinister] = useState('');
    const [director, setDirector] = useState('');
    const [ministerCandidate, setMinisterCandidate] = useState('');
    const [directorCandidate, setDirectorCandidate] = useState('');
    const [players, setPlayers] = useState([]);
    const [currentPlayer, setCurrentPlayer] = useState(null);
    const [isCandidateMinister, setIsCandidateMinister] = useState(false);
    const [openModal, setOpenModal] = useState(false);
    const [candidatePlayers, setCandidatePlayers] = useState([]);
    const [voting, setVoting] = useState(false);
    const [voted, setVoted] = useState(false);
    const [voteChoice, setVoteChoice] = useState('')

    useEffect(() => {
        if(statusResults === 'success' && results === 'LUMOS') {
            putResults(gameInfo.name);
        }
        if(statusResults === 'success' && results === 'NOX') {
            putResults(gameInfo.name);
        }
    },[statusResults, results])

    useEffect(() => {
        if (gameInfo && gameInfo.players) setPlayers(Object.values(gameInfo.players));
    }, [gameInfo, setPlayers])

    useEffect(() => {
        setCurrentPlayer(players.filter(player => player.user_name === user.username)[0]);
    }, [user, currentPlayer, players])

    useEffect(() => {
        if(gameInfo && gameInfo.elections && currentPlayer ){
            setDirector(gameInfo.elections.headmaster);
            setMinister(gameInfo.elections.minister);
            setDirectorCandidate(gameInfo.elections.headmaster_candidate);
            setMinisterCandidate(gameInfo.elections.minister_candidate);
            if(gameInfo.elections.minister_candidate === currentPlayer.name ){ 
                setIsCandidateMinister(true);
            } else {
                setIsCandidateMinister(false);
            } 
        }
    },[setIsCandidateMinister, gameInfo, currentPlayer])

    useEffect(() => {
        let array = [];
        if(isCandidateMinister && gameInfo && gameInfo.elections) {
            for(const player of players) {
                if(player.is_alive && player.name !== currentPlayer.name && player.name !== gameInfo.elections.minister && player.name !== gameInfo.elections.headmaster) array.push(player);
            }
        }
        setCandidatePlayers(array);
    },[setCandidatePlayers,players,currentPlayer, gameInfo])

    useEffect(() => {
        if(gameInfo) {
            setVoting(gameInfo.status === 'VOTING');
        }
    },[gameInfo, setVoting])

    useEffect(() => {
        if(gameInfo && gameInfo.elections && currentPlayer) {
            if (Object.keys(gameInfo.elections.votes).filter(player => player === currentPlayer.name).length) {
                setVoted(true);
                setVoteChoice(gameInfo.elections.votes[currentPlayer.name]);
            }
        }
    },[gameInfo, currentPlayer])

    useEffect(() => {
        if(gameInfo && gameInfo.status === "STARTED") setVoted(false);
    },[gameInfo])

    const handleVote = (type) => {  
        setVoteChoice(type);
        vote(type, currentPlayer.name, gameInfo.name)
    }   

    return (
        <div style={{ padding:20, display:'flex', flexDirection:'column' }}>
            {gameInfo !== null && 
                <>
                    <a style={{ flex:1, textAlign:'left', fontSize:23 }}>Minister: {minister ? minister : 'Not selected'}</a>
                    <a style={{ flex:1, textAlign:'left', fontSize:23 }}>Director: {director ? director : 'Not selected'}</a>
                    <a style={{ flex:1, textAlign:'left', fontSize:23 }}>Minister Candidate: {ministerCandidate ? ministerCandidate : 'Not selected'}</a>
                    <a style={{ flex:1, textAlign:'left', fontSize:23 }}>Director Candidate: {directorCandidate ? directorCandidate : 'Not selected'}</a>
                </>
            }
            {isCandidateMinister && !voting && gameInfo.status === "STARTED" &&
                <Button color='secondary' style={{ backgroundColor: 'lightblue', width:200 }} onClick={() => setOpenModal(true)}>
                    Choose director
                </Button>
            }
            {voting && !voted &&
                <>
                    <div style={{ display:'flex', flexDirection:'row', justifyContent:'center', marginTop:30 }} >
                        <Button size='large' style={{ backgroundColor: 'lightblue', marginRight:40 }} onClick={() => handleVote("LUMOS")}>
                            LUMOS
                        </Button>
                        <Button size='large' style={{ backgroundColor: 'lightblue' }} onClick={() => handleVote("NOX")} >
                            NOX
                        </Button>
                    </div>
                </>
            }
            {voted && voting &&
                <a style={{ flex:1, textAlign:'center', fontSize:30 }}>Your vote is: {voteChoice} </a>
            }

        <SelectDirectorCandidate open={openModal} onClose={() => setOpenModal(false)} candidatePlayers={candidatePlayers} selectDirector={(playerName) => selectDirector(playerName, currentPlayer.name, gameInfo.name)} />
        </div>
    )

}

export default PlayersAction;
