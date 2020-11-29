import React, { useEffect, useState } from 'react';
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
    const [previusDeProclamationsCount, setPreviusDeProclamationsCount] = useState(0)


    const handleClick = () => {
        if (newCards === null && spell === 'DIVINATION') {
            setOpenHand(true)
            castSpell('', gameInfo.name, currentPlayer.name)

        } else if (spell !== 'DIVINATION' && spell !== 'NONE_SPELL') {
            setOpenModal(true)
        }
    }

    const handleSpells = (spells) => {
        if (spells.length > 0 && spells[DEProclamationsCount] !== 'NONE_SPELL' &&
            previusDeProclamationsCount < DEProclamationsCount) {
            setSpell(spells[DEProclamationsCount])
            setAviableSpell(true)
        }
    }

    const handleSucces = (spell) => {
        switch (spell) {
            case 'CRUCIO':
                setNewCards(cards)
                setOpenHand(true)
                setAviableSpell(false)
                setPreviusDeProclamationsCount(DEProclamationsCount)
                break;
            case 'DIVINATION':
                setNewCards(cards)
                setAviableSpell(false)
                setPreviusDeProclamationsCount(DEProclamationsCount)
                break;
            default:
                setAviableSpell(false)
                setPreviusDeProclamationsCount(DEProclamationsCount)
                break;
        }
    }

    useEffect(() => {
        if (gameInfo.length !== 0) {
            setPlayers(Object.values(gameInfo.players));
        }
    }, [gameInfo, setPlayers, setMinister])

    useEffect(() => {
        if (gameInfo.length !== 0) {
            setCurrentPlayer(players.filter(player => player.user_name === user.username)[0]);
        }
    }, [user, currentPlayer, players])


    useEffect(() => {
        if (currentPlayer && gameInfo.length !== 0) {
            setMinister(gameInfo.elections.minister)
            if (minister === currentPlayer.name) {
                setIsMinister(true);
            }
        }
    }, [gameInfo.elections, currentPlayer])

    useEffect(() => {
        if (gameInfo.length !== 0) {
            setDEProclamationsCount(gameInfo.proclamations?.DE_enacted_proclamations)
            setSpells(gameInfo.spells)
            handleSpells(spells)
        }

    }, [gameInfo.proclamations?.DE_enacted_proclamations, gameInfo.spells])


    useEffect(() => {
        if (status === 'failed') {
            console.log("ERROR " + errorMsg)
        }
        if (status === 'success') {
            handleSucces(spell)
        }
    }, [status])

    return (
        <div>
            <div style={{ padding: 20, display: 'flex', flexDirection: 'column' }}>
                {aviableSpell && currentPlayer && currentPlayer.is_alive && spells && spells.length > 0 && isMinister &&
                    <Button color='secondary' style={{ backgroundColor: 'lightblue', width: 200 }} onClick={handleClick}>
                        {spell}
                    </Button>
                }
                {aviableSpell && !isMinister && minister &&
                    <a style={{ flex: 1, textAlign: 'center', fontSize: 30 }}> The Magic Minister {minister} has obtained {spell}</a>
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

