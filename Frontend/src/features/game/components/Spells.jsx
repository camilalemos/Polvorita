import React, { useEffect, useState } from 'react';
import Button from '@material-ui/core/Button';
import { Fireplace, SettingsVoiceOutlined } from '@material-ui/icons';
import Hand from './Hand.jsx'
import { makeStyles } from '@material-ui/core/styles';
import PopUp from './popUp.jsx'

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
    
    const handleClick = () => {
        if(spell === 'ADIVINATION') setOpenHand(true)
        else setOpenModal(true)
        if(newCards === null && spell!== 'CRUCIO'){
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
        setCurrentPlayer(players.filter(player => player.user_name === user.username)[0]);
    }, [user, currentPlayer, players])


    useEffect(() => {
        if(currentPlayer && gameInfo.length !==0){
            setMinister(gameInfo.elections.minister)
            if(minister === currentPlayer.name ) setIsMinister(true);
        }
    },[setIsMinister, gameInfo, currentPlayer])

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
            setOpenHand(true)
            
          
        }
        if (status === 'success' && spell !== 'AVADA_KEDAVRA' && spell !== 'CRUCIO') {
            setNewCards(cards)
            console.log("HERE1") 
        }
        if (status === 'success' && spell !== 'AVADA_KEDAVRA' && spell === 'CRUCIO') {
            console.log(cards, "CRUCIO")
            let axus = cards
            setNewCards(axus)
            console.log(newCards, "CRUCIO")
            setOpenHand(true)
            console.log("HERE1") 
        }

        console.log("HERE3")
    },  [status])


    return (
        <div>
            <div style={{ padding:20, display:'flex', flexDirection:'column' }}>
                {
                isMinister &&
                    <Button color='secondary' style={{ backgroundColor: 'lightblue', width:200 }} onClick={handleClick}>
                        {spell}
                    </Button>
                } 
                {!isMinister && spells !== undefined &&
                    <a style={{ flex:1, textAlign:'center', fontSize:30 }}> The Magic Minister {minister} has obtained {spell}</a>
                }
            </div>
            <div display= 'flex' style= {{width: 'min-content'}}>
                <Hand open={openHand} onClose={() => setOpenHand(false)} cards={newCards} />
            </div>
            <PopUp open={openModal} onClose={() => setOpenModal(false)} players={players} currentPlayer={currentPlayer}
            castSpell={(targetName) => castSpell(spell, targetName, gameInfo.name, currentPlayer.name)} />      

        </div>    
    )

}

export default Spells;

