import React, { useEffect, useState } from 'react';
import Button from '@material-ui/core/Button';
import SelectDirectorCandidate from './SelectDirectorCandidate';
import { SettingsVoiceOutlined } from '@material-ui/icons';

const PlayersAction = ({ gameInfo, user, selectDirector, statusVote, vote, getResults, statusResults,results }) => {

    const [minister, setMinister] = useState('');
    const [players, setPlanyers] = useState([]);
    const [currentPlayer, setCurrentPlayer] = useState(null);
    const [isCandidateMinister, setIsCandidateMinister] = useState(false);
    const [openModal, setOpenModal] = useState(false);
    const [candidatePlayers, setCandidatePlayers] = useState([]);
    const [voting, setVoting] = useState(false);
    const [candidateToDirector, setCandidateToDirector] = useState(null);
    const [voted, setVoted] = useState(false);
    const [voteChoice, setVoteChoice] = useState('')
    const [viewResults, setViewResults] = useState(false);
    const [dataResults, setDataResults] = useState(false);
    console.log(gameInfo, "GAME INFO"); 
    useEffect(() => {
        if(gameInfo.length !== 0 && Object.keys(gameInfo.elections.votes).length === 5) getResults(gameInfo.name);
    },[gameInfo])

    useEffect(() => {
        if(statusResults === 'success') setDataResults(true);
    },[statusResults])

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
            if (gameInfo.elections.headmaster_candidate !== candidateToDirector) {
                setCandidateToDirector(gameInfo.elections.headmaster_candidate);
                setVoting(true);
                setVoted(false);
            }
        }
    },[gameInfo,setCandidateToDirector, setVoting])

    useEffect(() => {
        if (statusVote === 'success') setVoted(true);
    },[statusVote])

    const handleVote = (type) => {  
        setVoteChoice(type);
        vote(type, currentPlayer.name, gameInfo.name)
    }   

    console.log(dataResults, voted, voting,results);

    return (
        <div style={{ padding:20, display:'flex', flexDirection:'column' }}>
            {dataResults &&
                <a style={{ flex:1, textAlign:'center', fontSize:30 }}>The results of votation is : {results}</a>
            }   
            {isCandidateMinister && !gameInfo.elections.headmaster_candidate && !voting &&
                <Button color='secondary' style={{ backgroundColor: 'lightblue', width:200 }} onClick={() => setOpenModal(true)}>
                    Choose director
                </Button>
            }
            {voted && 
                <a style={{ flex:1, textAlign:'center', fontSize:30 }}>Your vote is: {voteChoice} </a>
            }
            {voting && !voted && !dataResults &&
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
        <SelectDirectorCandidate open={openModal} onClose={() => setOpenModal(false)} candidatePlayers={candidatePlayers} selectDirector={(playerName) => selectDirector(playerName, currentPlayer.name, gameInfo.name)} />
        </div>
    )

}

export default PlayersAction;