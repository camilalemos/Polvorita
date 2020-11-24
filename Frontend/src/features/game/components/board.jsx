import React, {useState, useEffect} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Snackbar from '@material-ui/core/Snackbar';

export default function  Board( {gameInfo, enactproclamation, statusGetProclamation, getProclamationsInfo, proclamationsInfo}) {
    
    const classes = useStyles();
    const [ ministerName, setMinisterName ] = useState('');
    const [ headmasterName, setHeadmasterName ] = useState('');
    const [ gameName, setGameName] = useState('');
    const [ deck, setDeck] = useState([]);
    const [ numProclamations, setNumProclamations] = useState();
    const [ valueProclamation, setValueProclamation ] = useState('');
    const [ POenactedProclamations, setPOenactedProclamations ] = useState();
    const [ DEencatedProclamations, setDEenactedProclamations ] = useState();
    const [ discardedProclamations, setDiscardedProclamations ] = useState([])

    console.log(gameInfo)

    useEffect(() => {
        if (gameInfo){
            setMinisterName(gameInfo.elections?.minister);
            setHeadmasterName(gameInfo.elections?.headmaster)
            setGameName(gameInfo.name);
        }
    }, [gameInfo,setMinisterName])

    useEffect(() => {
        if (ministerName) {
            getProclamationsInfo(ministerName,gameName) 
        }
    },[ministerName])

    useEffect(() => {
        if (statusGetProclamation === 'success')
            setDeck(proclamationsInfo);
    }, [statusGetProclamation])

    useEffect(() => {
        setNumProclamations(Object((gameInfo.proclamations)?.proclamations).length);
    }, )

    function ShowSquare(proclamation){

        return (
            <button className = "square" >
                {assignImgProclamation(proclamation)}
            </button>
        );
    }

    function ShowBoards(proclamation, loyalt){
        
        const [ phoenixOrderBoard, setPhoenixOrderBoard ] = useState([null,null,null,null,null])
        const [ deathEatersBoard, setDeathEatersBoard ] = useState([null,null,null,null,null,null])
        
        if (loyalt === 'OF') {
            setPhoenixOrderBoard[0] = proclamation;
            return (
                <button className = "square" >
                    {assignImgProclamation(proclamation)}
                </button>
            );    
        } else if (loyalt === 'DE'){
            setDeathEatersBoard[0] = proclamation;

            return (
                <button className = "square" >
                    {assignImgProclamation(proclamation)}
                </button>
            );
        }
    }

    const assignImgProclamation = (proclamations) => {

        if (proclamations === "PHOENIX_ORDER") {
            return (
                <img src={require('../../../constants/images/ProclamacionF.jpg')} alt= "Proclamacion Orden Fenix" style={{width: "150px", height: "190px"}}></img>)
        } else if (proclamations === "DEATH_EATERS" ){
            return (
                <img src={require('../../../constants/images/ProclamacionM.jpg')} alt= "Proclamacion Mortifagos" style={{width: "150px", height: "190px"}}></img>)
        } else {
            return null;
        }
    }

    const Deck = (proclamations, numProclamationsInDeck,) => {

        const [open, setOpen] = useState(false);

        const handleClick = () => {
            setOpen(true);
        };
    
        const handleClose = (value) => {
            setOpen(false)
            setValueProclamation(value)
            enactproclamation(value,headmasterName,gameName)
            console.log(enactproclamation)

            //console.log(valueProclamation)
        };

        return (
            <div>
                <button style={{ cursor: 'pointer' }} onClick={handleClick}>
                    Proclamations: {numProclamationsInDeck}
                <img src= {require('../../../constants/images/Proclamacion.jpg')} alt= "Proclamacion" style={{width: "150px", height: "190px"}}></img>
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
            </div>
        );
    }

    return (
        <div className={classes.root}> 
            <div focusRipple  className={classes.image} focusVisibleClassName={classes.focusVisible} style={{width: '70%', justifyContent:'space-between'}} disable>
                <div className ={classes.imageSrc} style={{ backgroundImage: `url(${require('../../../constants/images/TableroM1.png')})`,}} />
                <div className={classes.imageBackdrop}>
                {ShowSquare(valueProclamation)}
                {ShowSquare()}
                {ShowSquare()}
                {ShowSquare()}
                {ShowSquare()}
                {ShowSquare()}
                </div>
            </div>
            <div display= 'flex' style= {{width: 'min-content'}}>
                {Deck(deck,numProclamations)}
            </div>
                <div focusRipple  className={classes.image} focusVisibleClassName={classes.focusVisible} style={{width: '70%',}} disable>
                <div className ={classes.imageSrc} style={{ backgroundImage: `url(${require('../../../constants/images/TableroOF.png')})`,}}/>
                <div className={classes.imageBackdrop}>
                {ShowSquare()}
                {ShowSquare()}
                {ShowSquare()}
                {ShowSquare()}
                {ShowSquare()}
                </div>
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