import React, { useEffect, useState } from 'react';
import Button from '@material-ui/core/Button';
import MinisterPopUp from '../components/ExpelliarmusPopUp'

const Expelliarmus = ({ gameInfo, errorMsg, status, user, expelliarmus }) => {

    const [players, setPlayers] = useState([]);
    const [currentPlayer, setCurrentPlayer] = useState(null);
    const [isMinister, setIsMinister] = useState(false);
    const [openModal, setOpenModal] = useState(false);
    const [minister, setMinister] = useState('');
    const [isHeadMaster, setIsHeadMaster] = useState(false);
    const [headMaster, setHeadMaster] = useState('');
    const [proclamationsDEcount, setProclamationsDECount] = useState('');
    const [hand, setHand] = useState(0)
    const [isActivated, setIsActivated] = useState(false)
    const [gameStatus, setGameStatus] = useState('')

    const handleHeadMasterClick = () => {
        expelliarmus('', currentPlayer.name, gameInfo.name)
    }

    const expelliarmusActivated = () => {
        let isExpelliarmus = false;
        if (proclamationsDEcount === 5 && hand.length === 2 && gameStatus === "LEGISLATIVE") {
            isExpelliarmus = true;
        }
        return isExpelliarmus;
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
        if (gameInfo && gameInfo.length !== 0) {
            setIsActivated(gameInfo.proclamations?.headmaster_exp)
        }
    }, [gameInfo.proclamations?.headmaster_exp])

    useEffect(() => {
        if (gameInfo.length !== 0) {
            setHand(gameInfo.proclamations?.hand)
        }
    }, [gameInfo.proclamations?.hand])

    useEffect(() => {
        if (gameInfo.length !== 0) {
            setGameStatus(gameInfo.status)
        }
    }, [gameInfo, gameInfo.status, setGameStatus])

    useEffect(() => {
        if (isActivated && isMinister && expelliarmusActivated()) setOpenModal(true)
    }, [isActivated, isMinister])

    useEffect(() => {
        if (currentPlayer && gameInfo.length !== 0) {
            setMinister(gameInfo.elections.minister);
            setHeadMaster(gameInfo.elections?.headmaster)
            if (minister === currentPlayer.name) {
                setIsMinister(true);
            } else {
                setIsMinister(false);
            }
            if (headMaster === currentPlayer.name) {
                setIsHeadMaster(true);
            } else {
                setIsHeadMaster(false);
            }
        }
    }, [gameInfo.elections, currentPlayer])

    useEffect(() => {
        setProclamationsDECount(gameInfo.proclamations?.DE_enacted_proclamations)
    }, [gameInfo, setProclamationsDECount])

    useEffect(() => {
        if (status === 'failed') {
            console.log("ERROR " + errorMsg)
        }
    }, [status])

    return (
        <div>
            <div style={{ padding: 20, display: 'flex', flexDirection: 'column' }}>
                {status !== 'success' && expelliarmusActivated() && isHeadMaster &&
                    <Button color='secondary' style={{ backgroundColor: 'darkslategrey', width: 200 }} onClick={handleHeadMasterClick}>
                        Expelliarmus!
                    </Button>
                }
                {expelliarmusActivated() && !isMinister && !isHeadMaster &&
                    <a style={{ flex: 1, textAlign: 'center', fontSize: 30 }}> Expelliarmus Aviable</a>
                }
            </div>
            <div display='flex' style={{ width: 'min-content' }}>
                <MinisterPopUp open={openModal} onClose={() => setOpenModal(false)} headMaster={headMaster} expelliarmus={(ministerResponse) => expelliarmus(ministerResponse, currentPlayer.name, gameInfo.name)} />
            </div>

        </div>
    )

}

export default Expelliarmus;