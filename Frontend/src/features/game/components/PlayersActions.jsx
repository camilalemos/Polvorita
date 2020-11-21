import React, { useEffect, useState } from 'react';
import Button from '@material-ui/core/Button';
import SelectDirectorCandidate from './SelectDirectorCandidate';
import { Fireplace, SettingsVoiceOutlined } from '@material-ui/icons';

const PlayersAction = ({ gameInfo, user, selectDirector, statusVote, vote, getResults, statusResults,results, statusResultsPut, putResults }) => {

    const [minister, setMinister] = useState('');
    const [director, setDirector] = useState('');
    const [players, setPlayers] = useState([]);
    const [currentPlayer, setCurrentPlayer] = useState(null);
    const [isCandidateMinister, setIsCandidateMinister] = useState(false);
    const [openModal, setOpenModal] = useState(false);
    const [candidatePlayers, setCandidatePlayers] = useState([]);
    const [voting, setVoting] = useState(false);
    const [candidateToDirector, setCandidateToDirector] = useState(null);
    const [voted, setVoted] = useState(false);
    const [voteChoice, setVoteChoice] = useState('')
    const [dataResults, setDataResults] = useState(false);
    console.log(gameInfo, "GAME INFO"); 
    useEffect(() => {
        if(gameInfo.length !== 0 && Object.keys(gameInfo.elections.votes).length === 5) getResults(gameInfo.name);
    },[gameInfo])

    useEffect(() => {
        if(statusResults === 'success' && results === 'LUMOS') {
            setDataResults(false);
            setVoting(false);
            setVoted(false);
            putResults(gameInfo.name);
        }
        if(statusResults === 'success' && results === 'NOX') {
            setDataResults(false)
            setVoting(true);
            setVoted(false);
            putResults(gameInfo.name);
        }
    },[statusResults, results])

    useEffect(() => {
        if (gameInfo.length !== 0) {
            let players = Object.keys(gameInfo.players);
            setPlayers(Object.values(gameInfo.players));
            let indexPlayerMinister = players.findIndex(names => names === gameInfo.elections.minister_candidate);
            setMinister(indexPlayerMinister);
        }
    }, [gameInfo, setPlayers, setMinister])

    useEffect(() => {
        setCurrentPlayer(players.filter(player => player.user_name === user.username)[0]);
    }, [user, currentPlayer, players])


    useEffect(() => {
        if(gameInfo.length !== 0 && currentPlayer ){
            setDirector(gameInfo.elections.headmaster);
            setMinister(gameInfo.elections.minister)
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
            if (gameInfo.elections.headmaster_candidate !== candidateToDirector) {
                setCandidateToDirector(gameInfo.elections.headmaster_candidate);
                setVoting(true);
            }
        }
    },[gameInfo,setCandidateToDirector, setVoting])

    useEffect(() => {
        if (statusVote === 'success' && gameInfo.elections?.headmaster_candidate){
            setVoted(true);
        } 
    },[statusVote])

    const handleVote = (type) => {  
        setVoteChoice(type);
        vote(type, currentPlayer.name, gameInfo.name)
    }   

    // console.log(voting, "VOTING", voted, "VOTED", dataResults, "DATARESULT");

    return (
        <div style={{ padding:20, display:'flex', flexDirection:'column' }}>
            {gameInfo && 
                <>
                    <a style={{ flex:1, textAlign:'center', fontSize:30 }}>Minister: {minister ? minister : 'Not selected'}</a>
                    <a style={{ flex:1, textAlign:'center', fontSize:30 }}>Director: {director ? director : 'Not selected'}</a>
                </>
            }
            {isCandidateMinister && !voting &&
                <Button color='secondary' style={{ backgroundColor: 'lightblue', width:200 }} onClick={() => setOpenModal(true)}>
                    Choose director
                </Button>
            }
            {voting && !voted && !dataResults && gameInfo.elections.headmaster_candidate &&
                <>
                    <a style={{ flex:1, textAlign:'center', fontSize:30 }}>Candidate to director is: {gameInfo.elections.headmaster_candidate}</a>
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