import React, { useEffect, useState } from 'react';
import Button from '@material-ui/core/Button';
import { Fireplace, SettingsVoiceOutlined } from '@material-ui/icons';
import HandSnackbar from './HandSnackbar.jsx'
import { makeStyles } from '@material-ui/core/styles';
import TargetsPopUp from './TargetsPopUp.jsx'

const Spells = ({ errorMsg, status, gameInfo, user, castSpell, cards}) => {

    
    const [players, setPlayers] = useState([]);
    const [currentPlayer, setCurrentPlayer] = useState(null);
    const [isMinister, setIsMinister] = useState(false);
    const [openHand, setOpenHand] = useState(false);
    const [openModal, setOpenModal] = useState(false);
    const [minister, setMinister] = useState(null);
    const [proclamationsDEcount, setProclamationsDECount] = useState('');
    const [spells, setSpells] = useState([])
    const [newCards, setNewCards] = useState(null)
    const [spell, setSpell] = useState('')
    const [numPlayers, setNumPlayers] = useState('')
    
    console.log(gameInfo, "GAME INFO")
    const handleClick = () => {
        if(spell === 'ADIVINATION') setOpenHand(true)
        else setOpenModal(true)
        if(newCards === null && spell === 'ADIVINATION'){
            castSpell(spell, '',gameInfo.name, currentPlayer.name)             
        }
    }

    const handleSpells = (spells) => {
        if (proclamationsDEcount == 0){
            setSpell (spells[0])
        }
        if (proclamationsDEcount == 1) {
            setSpell (spells[1])
        }
        if (proclamationsDEcount == 2) {
            setSpell (spells[2])
        }
        if (proclamationsDEcount == 3) {
            setSpell (spells[3])
        }
    }

    useEffect(() => {
        if (gameInfo.length !==0 ) {
            setPlayers(Object.values(gameInfo.players));
        }
    }, [gameInfo, setPlayers, setMinister])

    useEffect(() => {
        if (gameInfo.length !== 0) {
            setCurrentPlayer(players.filter(player => player.user_name === user.username)[0]);
        }
    }, [user, currentPlayer, players])


    useEffect(() => {
        if(currentPlayer && gameInfo.length !==0){
            if(gameInfo.elections.minister === currentPlayer.name ){
                setIsMinister(true);
                setMinister(gameInfo.elections.minister)
            }
        }
    },[gameInfo.elections, currentPlayer])

    useEffect(() => {
        setProclamationsDECount(gameInfo.proclamations?.DE_enacted_proclamations)
        setSpells(gameInfo.spells)
        handleSpells(spells)
    }, [gameInfo, setProclamationsDECount, setSpells])
    //console.log("CURRENT PLAYER " + JSON.stringify(currentPlayer))
    //console.log("MINISTER " + JSON.stringify(minister))
    //console.log("DE PROC " + proclamationsDEcount)
    useEffect(() => {
        if (status === 'failed') {
            console.log("ERROR " + errorMsg)
        }
        if (status === 'success' && spell !== 'AVADA_KEDAVRA' && spell !== 'CRUCIO' !== 'IMPERIUS') {
            setNewCards(cards)
        }
        if (status === 'success' && spell !== 'AVADA_KEDAVRA' && spell === 'CRUCIO' && spell !== 'IMPERIUS') {
            setNewCards(cards)
            setOpenHand(true)
        }
    },  [status])

    return (
        <div>
            <div style={{ padding:20, display:'flex', flexDirection:'column' }}>
                {
                currentPlayer !== null && currentPlayer.is_alive && spells !== undefined && spells.length > 0 && isMinister &&
                    <Button color='secondary' style={{ backgroundColor: 'lightblue', width:200 }} onClick={handleClick}>
                        {spell}
                    </Button>
                } 
                {!isMinister && spells !== undefined &&
                    <a style={{ flex:1, textAlign:'center', fontSize:30 }}> The Magic Minister {minister} has obtained {spell}</a>
                }
            </div>
            <div display= 'flex' style= {{width: 'min-content'}}>
                <HandSnackbar open={openHand} onClose={() => setOpenHand(false)} cards={newCards} />
            </div>
            <TargetsPopUp open={openModal} onClose={() => setOpenModal(false)} players={players} currentPlayer={currentPlayer}
            castSpell={(targetName) => castSpell(spell, targetName, gameInfo.name, currentPlayer.name)} />      

        </div>    
    )

}

export default Spells;

