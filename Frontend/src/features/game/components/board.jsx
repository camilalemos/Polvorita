import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Snackbar from '@material-ui/core/Snackbar';

export default function Board({ user, gameInfo, statusGetProclamation, getProclamationsInfo, discardproclamation }) {

    const classes = useStyles();
    const [ministerName, setMinisterName] = useState('');
    const [headmasterName, setHeadmasterName] = useState('');
    const [numPlayers, setNumPlayers] = useState();
    const [gameName, setGameName] = useState('');
    const [hand, setHand] = useState([]);
    const [numProclamations, setNumProclamations] = useState();
    const [POenactedProclamations, setPOenactedProclamations] = useState(0);
    const [DEenactedProclamations, setDEenactedProclamations] = useState(0);
    const [discardedProclamations, setDiscardedProclamations] = useState([])
    const [open, setOpen] = useState(false);
    const [openSnackDirector, setOpenSnackDirector] = useState(false);
    const [isMinister, setIsMinister] = useState(false);
    const [isHeadMaster, setIsHeadMaster] = useState(false);
    const [players, setPlayers] = useState([]);
    const [currentPlayer, setCurrentPlayer] = useState(null);
    const [isGetProclamation, setIsGetProclamation] = useState(true);

    useEffect(() => {
        if (gameInfo.length !== 0) {
            setMinisterName(gameInfo.elections.minister);
            setHeadmasterName(gameInfo.elections.headmaster)
            setGameName(gameInfo.name);
            setNumPlayers(gameInfo.num_players);
        }
    }, [gameInfo, setMinisterName])

    useEffect(() => {
        if (gameInfo.length !== 0) {
            setHand(gameInfo.proclamations.hand);
        }
    }, [gameInfo])

    useEffect(() => {
        if (statusGetProclamation) {
            setNumProclamations(Object((gameInfo.proclamations)?.deck).length);
        }
        setDiscardedProclamations(Object((gameInfo.proclamations)?.discarded).length)
    }, [statusGetProclamation, gameInfo])

    useEffect(() => {
        if (gameInfo.length !== 0) {
            setPOenactedProclamations(gameInfo.proclamations.PO_enacted_proclamations);
            setDEenactedProclamations(gameInfo.proclamations.DE_enacted_proclamations);
        }
    }, [gameInfo])

    //--------------------------------------------

    useEffect(() => {
        if (gameInfo.length !== 0) {
            setPlayers(Object.values(gameInfo.players));
        }
    }, [gameInfo, setPlayers])

    useEffect(() => {
            setCurrentPlayer(players.filter(player => player.user_name === user.username)[0]);
    }, [user, players])

    //console.log(currentPlayer)

    useEffect(() => {
        if (currentPlayer && gameInfo.elections) {
            if (gameInfo.elections.minister === currentPlayer.name) {
                setIsMinister(true);
            } else { 
                setIsMinister(false);
            }
            if (gameInfo.elections.headmaster === currentPlayer.name) {
                setIsHeadMaster(true);
            } else {
                setIsHeadMaster(false);
            }
        }
    }, [gameInfo, currentPlayer, setIsMinister, setIsHeadMaster])
    
    function ShowSquare(enactedproclamations, loyalty) {

        const poArrayAux = new Array(5)
        const deArrayAux = new Array(6)
        let result = [];

        if (loyalty === "PHOENIX_ORDER") {
            poArrayAux.fill("PHOENIX_ORDER", 0, enactedproclamations);
            for (const proclamation of poArrayAux) {
                result.push(assignImgProclamation(proclamation))
            }
        }
        else if (loyalty === "DEATH_EATERS") {
            deArrayAux.fill("DEATH_EATERS", 0, enactedproclamations);
            for (const proclamation of deArrayAux) {
                result.push(assignImgProclamation(proclamation))
            }
        }
        return result;
    }

    const assignImgProclamation = (proclamations) => {

        if (proclamations === "PHOENIX_ORDER") {
            return (
                <img src={require('../../../constants/images/ProclamationOP.png')} alt="Proclamation Phoenix Order" style={{ width: "150px", height: "190px" }}></img>)
        } else if (proclamations === "DEATH_EATERS") {
            return (
                <img src={require('../../../constants/images/ProclamationDE.png')} alt="Proclamation Death Eater" style={{ width: "150px", height: "190px" }}></img>)
        } else {
            return null;
        }
    }

    const Deck = (proclamations, numProclamationsInDeck,) => {

        useEffect(() => {
            if (hand.length === 2) {
                setOpenSnackDirector(true)
                if (gameInfo.proclamations?.headmaster_exp) {
                    setOpenSnackDirector(false)
                }
            }
        })

        useEffect(() => {
            if (hand.length === 3) {
                setOpen(true)
            }
        })

        const handleClick = () => {
            if (currentPlayer && gameInfo.length !== 0 && gameInfo.status === "LEGISLATIVE") {
                if (gameInfo.elections.minister === currentPlayer.name && statusGetProclamation !== 'success' && isGetProclamation) {
                    getProclamationsInfo(ministerName, gameName)
                    setIsGetProclamation(false)
                }
            }
        };

        const handleClose = (value) => {
            setOpen(false)
            discardproclamation(value, ministerName, gameName)
        };

        const handleCloseHeadMaster = (value) => {
            setOpenSnackDirector(false)
            discardproclamation(value, headmasterName, gameName)
        }
        console.log(gameInfo)
        return (
            <div>
                <button style={{ cursor: 'pointer' }} onClick={handleClick}>
                    <h style={{ display: 'flex', justifyContent: 'center'}}>Proclamations: {numProclamationsInDeck}</h>
                    <img src={require('../../../constants/images/Proclamation.png')} alt="Proclamation" style={{ width: "150px", height: "190px" }}></img>
                </button>
                {isMinister && hand.length === 3 &&
                    <Snackbar open={open} display='flex'>
                        <div>
                            <h style={{ display: 'flex', justifyContent: 'center', fontSize:'30px'}}>Press a proclamation to discard</h>
                            {proclamations.map((threeproclamations) => (
                                <button style={{cursor:'pointer', justifyContent: 'center'}} onClick={() => handleClose(threeproclamations)} key={threeproclamations}>
                                    {assignImgProclamation(threeproclamations)}
                                </button>
                            ))}
                        </div>
                    </Snackbar>}
                {isHeadMaster && hand.length === 2 &&
                    <Snackbar open={openSnackDirector} display='flex'>
                        <div>
                            <h style={{ display: 'flex', justifyContent: 'center', fontSize:'30px'}}>Press a proclamation to enact</h>
                            {proclamations.map((threeproclamations) => (
                                <button style={{cursor:'pointer', justifyContent: 'center' }} onClick={() => handleCloseHeadMaster(threeproclamations)} key={threeproclamations}>
                                    {assignImgProclamation(threeproclamations)}
                                </button>
                            ))}
                        </div>
                    </Snackbar>}
            </div>
        );
    }

    const discardDeck = (numDiscardProclamations) => {

        return (
            <div>
                <h style={{ display: 'flex', justifyContent: 'center'}}>Discarded: {numDiscardProclamations}</h>
                <img src={require('../../../constants/images/Discard.png')} alt="Proclamacion" style={{ width: "150px", height: "190px" }}></img>
            </div>
        );
    }

    const imgdeathEatersBoard = (numplayers) => {
        let imgBoardDE
        switch (numplayers) {
            case 5:
            case 6:
                imgBoardDE = require('../../../constants/images/TableroDE1.png');
                break;
            case 7:
            case 8:
                imgBoardDE = require('../../../constants/images/TableroDE2.png');
                break;
            case 9:
            case 10:
                imgBoardDE = require('../../../constants/images/TableroDE3.png');
                break;
            default:
                imgBoardDE = require('../../../constants/images/TableroDE1.png');
                break;
        }
        return imgBoardDE;
    }

    return (
        <div className={classes.root} >
            <div focusRipple className={classes.image} focusVisibleClassName={classes.focusVisible} style={{ width: '70%'}} disable>
                <div style={{display: 'flex', flex: 2.8, borderLeft: 'solid', borderLeftWidth: 1, padding: 145, backgroundPosition: 'center', backgroundRepeat: 'no-repeat', backgroundSize: "cover",backgroundImage: `url(${imgdeathEatersBoard(numPlayers)})`, }} />
                <div className={classes.imageBackdrop}>
                    {ShowSquare(DEenactedProclamations, "DEATH_EATERS")}
                </div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'center', flexDirection: 'row', width: '80%'}}>
                {Deck(hand, numProclamations)}
                <div focusRipple className={classes.image} focusVisibleClassName={classes.focusVisible} style={{ display:'flex', width: '80%', }} disable>
                    <div className={classes.imageSrc} style={{display: 'flex', flex: 2.8, borderLeft: 'solid', borderLeftWidth: 1, padding: 145, backgroundPosition: 'center', backgroundRepeat: 'no-repeat', backgroundSize: "cover",backgroundImage: `url(${require('../../../constants/images/TableroPO.png')})`, }}/>
                    <div className={classes.imageBackdrop}>
                        {ShowSquare(POenactedProclamations, "PHOENIX_ORDER")}
                    </div>
                </div>
                {discardDeck(discardedProclamations)}
            </div>
        </div>
    )
}

const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex',
        flexWrap: 'wrap',
        minWidth: 300,
        width: '100%',
        placeContent: 'center',
    },
    image: {
        position: 'relative',
        [theme.breakpoints.down('xs')]: {
            width: '100% !important', // Overrides inline-style
            height: 100,
        },
        '&:hover, &$focusVisible': {
            zIndex: 1,
            '& $imageBackdrop': {
                opacity: 0.15,
            },
            '& $imageMarked': {
                opacity: 0,
            },
            '& $imageTitle': {
                border: '4px solid currentColor',
            },
        },
    },
    focusVisible: {},
    imageSrc: {
   
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        backgroundSize: 'cover',
        backgroundPosition: 'center 40%',
    },
    imageBackdrop: {
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        opacity: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: theme.palette.common.white,
        transition: theme.transitions.create('opacity'),
    },
}));
