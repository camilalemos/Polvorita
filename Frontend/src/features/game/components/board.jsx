import React, {useState, useEffect} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Snackbar from '@material-ui/core/Snackbar';

export default function Board( {gameInfo, statusGetProclamation, getProclamationsInfo, proclamationsInfo, discardproclamation}) {
    
    const classes = useStyles();
    const [ ministerName, setMinisterName ] = useState('');
    const [ headmasterName, setHeadmasterName ] = useState('');
    const [ numPlayers, setNumPlayers ] = useState();
    const [ gameName, setGameName] = useState('');
    const [ hand, setHand] = useState([]);
    const [ numProclamations, setNumProclamations] = useState();
    const [ valueProclamation, setValueProclamation ] = useState('');
    const [ POenactedProclamations, setPOenactedProclamations ] = useState();
    const [ DEenactedProclamations, setDEenactedProclamations ] = useState();
    const [ discardedProclamations, setDiscardedProclamations ] = useState([])
    const [open, setOpen] = useState(false);
    const [openSnackDirector, setOpenSnackDirector] =useState(false);

    console.log(gameInfo)

    useEffect(() => {
        if (gameInfo){
            setMinisterName(gameInfo.elections?.minister);
            setHeadmasterName(gameInfo.elections?.headmaster)
            setGameName(gameInfo.name);
            setNumPlayers(gameInfo.num_players);
        }
    }, [gameInfo,setMinisterName])

    useEffect(() => {
        if (ministerName) {
            getProclamationsInfo(ministerName,gameName) 
        }
    },[ministerName])

    useEffect(() => {
        if(gameInfo.length !== 0 ){
            setHand(gameInfo.proclamations?.hand);
        }
    }, [gameInfo.proclamations?.hand])

    useEffect(() => {
        setNumProclamations(Object((gameInfo.proclamations)?.deck).length);
        setDiscardedProclamations(Object((gameInfo.proclamations)?.discarded).length)
    }, )

    useEffect(() => {
        if (gameInfo.length !== 0 ){
            setPOenactedProclamations(gameInfo.proclamations?.PO_enacted_proclamations);
            setDEenactedProclamations(gameInfo.proclamations?.DE_enacted_proclamations);
        }
    }, [gameInfo])


    function ShowSquare(enactedproclamations, loyalty){

        const poArrayAux  = new Array(5).fill(null);
        const deArrayAux  = new Array(6).fill(null);
        let result;

        if ( loyalty === "PHOENIX_ORDER") {
            poArrayAux.fill("PHOENIX_ORDER", 0,enactedproclamations);
            result = poArrayAux.map((proclamation) => (
                assignImgProclamation(proclamation)
                //console.log(proclamation)
            ))
            //console.log(poArrayAux)
        } 
        else if ( loyalty === "DEATH_EATERS") {
            deArrayAux.fill("DEATH_EATERS", 0,enactedproclamations);
            result = deArrayAux.map((proclamation) => (
            assignImgProclamation(proclamation)
            ))
            //console.log(deArrayAux)
        }
        return result;
    }

    const assignImgProclamation = (proclamations) => {

        if (proclamations === "PHOENIX_ORDER") {
            return (
                <img src={require('../../../constants/images/ProclamationOP.png')} alt= "Proclamation Phoenix Order" style={{width: "150px", height: "190px"}}></img>)
        } else if (proclamations === "DEATH_EATERS" ){
            return (
                <img src={require('../../../constants/images/ProclamationDE.png')} alt= "Proclamation Death Eater" style={{width: "150px", height: "190px"}}></img>)
        } else {
            return null;
        }
    }

    const Deck = (proclamations, numProclamationsInDeck,) => {

        const handleClick = () => {
            setOpen(true);
        };
    
        const handleClose = (value) => {
            setOpen(false)
            setValueProclamation(value)
            discardproclamation(value,ministerName,gameName)
            setOpenSnackDirector(true)
        };

        const handleCloseHeadMaster = (value) => {
            setOpenSnackDirector(false)
            discardproclamation(value,headmasterName,gameName)
        }

        return (
            <div>
                <button style={{ cursor: 'pointer' }} onClick={handleClick}>
                    Proclamations: {numProclamationsInDeck}
                <img src= {require('../../../constants/images/Proclamation.png')} alt= "Proclamation" style={{width: "150px", height: "190px"}}></img>
                </button>
                <Snackbar open={open} display= 'flex'>
                    <div>
                        {proclamations.map((threeproclamations) => (
                        <button onClick={ () => handleClose(threeproclamations)}>
                        {assignImgProclamation(threeproclamations)}
                        </button>
                        ))}
                    </div>
                </Snackbar>
                <Snackbar open={openSnackDirector} display= 'flex'>
                    <div>
                        {proclamations.map((threeproclamations) => (
                        <button onClick={ () => handleCloseHeadMaster(threeproclamations)}>
                        {assignImgProclamation(threeproclamations)}
                        </button>
                        ))}
                    </div>
                </Snackbar>
            </div>
        );
    }

    const discardDeck = (numDiscardProclamations) => {

        return (
            <div>
                Discarded: {numDiscardProclamations}
                <img src= {require('../../../constants/images/Discard.png')} alt= "Proclamacion" style={{width: "150px", height: "190px"}}></img>
            </div>
        );
    }

    const imgdeathEatersBoard = ( numplayers ) => {
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
        <div className={classes.root}> 
            <div focusRipple  className={classes.image} focusVisibleClassName={classes.focusVisible} style={{width: '70%', justifyContent:'space-between'}} disable>
                <div className ={classes.imageSrc} style={{ backgroundImage: `url(${imgdeathEatersBoard(numPlayers)})`,}} />
                <div className={classes.imageBackdrop}>
                    {ShowSquare(DEenactedProclamations, "DEATH_EATERS")}
                </div>
            </div>
            <div display= 'flex' style= {{width: 'min-content'}}>
                {Deck(hand,numProclamations)}
            </div>
                <div focusRipple  className={classes.image} focusVisibleClassName={classes.focusVisible} style={{width: '70%',}} disable>
                    <div className ={classes.imageSrc} style={{ backgroundImage: `url(${require('../../../constants/images/TableroPO1.png')})`,}}/>
                    <div className={classes.imageBackdrop}>
                        {ShowSquare(POenactedProclamations, "PHOENIX_ORDER")}
                </div>
            </div>
            <div display= 'flex' style= {{width: 'min-content'}}>
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
        height: 200,
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
        position: 'absolute',
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