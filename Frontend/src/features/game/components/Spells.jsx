import React, { useEffect, useState, useCallback } from 'react';
import Button from '@material-ui/core/Button';
import HandSnackbar from './HandSnackbar.jsx'
import TargetsPopUp from './TargetsPopUp.jsx'

const Spells = ({ errorMsg, status, gameInfo, user, castSpell, cards }) => {

    const [players, setPlayers] = useState([]);
    const [currentPlayer, setCurrentPlayer] = useState(null);
    const [isMinister, setIsMinister] = useState(false);
    const [openHand, setOpenHand] = useState(false);
    const [openModal, setOpenModal] = useState(false);
    const [minister, setMinister] = useState('');
    const [DEProclamationsCount, setDEProclamationsCount] = useState('');
    const [spells, setSpells] = useState([])
    const [newCards, setNewCards] = useState(null)
    const [spell, setSpell] = useState('')
    const [aviableSpell, setAviableSpell] = useState('')
    const [gameStatus, setGameStatus] = useState('')

    const handleClick = () => {
        if (newCards === null && spell === 'DIVINATION') {
            setOpenHand(true)
            castSpell('', gameInfo.name, currentPlayer.name)

        } else if (spell !== 'DIVINATION' && spell !== 'NONE_SPELL') {
            setOpenModal(true)
        }
    }

    const handleSpells = useCallback((spells) => {
        if (spells.length > 0 && spells[DEProclamationsCount] !== 'NONE_SPELL' && gameStatus === 'EXECUTIVE') {
            setSpell(spells[DEProclamationsCount])
            setAviableSpell(true)
        }
    }, [DEProclamationsCount, gameStatus])

    const handleSucces = useCallback((spell) => {
        switch (spell) {
            case 'CRUCIO':
                setNewCards(cards)
                setOpenHand(true)
                setAviableSpell(false)
                break;
            case 'DIVINATION':
                setNewCards(cards)
                setAviableSpell(false)
                break;
            default:
                setAviableSpell(false)
                break;
        }
    }, [cards])

    useEffect(() => {
        if (gameInfo.length !== 0) {
            setPlayers(Object.values(gameInfo.players));
        }
    }, [gameInfo, setPlayers, setMinister])

    useEffect(() => {
        if (gameInfo.length !== 0) {
            setCurrentPlayer(players.filter(player => player.user_name === user.username)[0]);
        }
    }, [user, currentPlayer, players, gameInfo])

    useEffect(() => {
        if (currentPlayer && gameInfo.length !== 0) {
            setMinister(gameInfo.elections.minister)
            if (minister === currentPlayer.name) {
                setIsMinister(true);
            } else {
                setIsMinister(false);
            }
        }
    }, [gameInfo.elections, currentPlayer, minister, gameInfo.length])
    
    useEffect(() => {
        if (gameInfo.length !== 0) {
            setGameStatus(gameInfo.status)
        }
    }, [gameInfo, gameInfo.status, setGameStatus])

    useEffect(() => {
        if (gameInfo.length !== 0) {
            setDEProclamationsCount(gameInfo.proclamations?.DE_enacted_proclamations)
            setSpells(gameInfo.spells)
            handleSpells(spells)
        }
    }, [gameInfo.proclamations?.DE_enacted_proclamations, gameInfo.spells, gameInfo.length, handleSpells, spells])
    
    useEffect(() => {
        if (status === 'failed') {
            console.log("ERROR " + errorMsg)
        }
        if (status === 'success') {
            handleSucces(spell)
        }
    }, [status, errorMsg, handleSucces, spell])

    return (
        <div>
            <div style={{ padding: 20, display: 'flex', flexDirection: 'column' }}>
                {aviableSpell && currentPlayer && currentPlayer.is_alive && spells && spells.length > 0 && isMinister && gameStatus === 'EXECUTIVE' &&
                    <Button color='secondary' style={{ backgroundColor: 'darkslategrey', width: 200 }} onClick={handleClick}>
                        {spell}
                    </Button>
                }
                {aviableSpell && !isMinister && minister && gameStatus === 'EXECUTIVE' &&
                    <h style={{ flex: 1, textAlign: 'center', fontSize: 30 }}> The Minister of Magic {minister} has obtained {spell}</h>
                }
            </div>
            <div display='flex' style={{ width: 'min-content' }}>
                <HandSnackbar open={openHand} onClose={() => setOpenHand(false)} cards={newCards} />
            </div>
            <TargetsPopUp open={openModal} onClose={() => setOpenModal(false)} players={players} currentPlayer={currentPlayer}
                castSpell={(targetName) => castSpell(targetName, gameInfo.name, currentPlayer.name)} />

        </div>
    )
}

export default Spells;

