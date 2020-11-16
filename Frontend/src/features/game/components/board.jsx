import React, {useState, useEffect} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Snackbar from '@material-ui/core/Snackbar';

export default function  Board({gameInfo, enacproclamation, getProclamationsInfo, proclamationsInfo}) {
  
    const classes = useStyles();
    const [ playerName, setPlayerName ] = useState([]);
    const [ gameName, setGameName] = useState('');
    const [ deck, setDeck] = useState(["DEATH_EATERS","PHOENIX_ORDER","PHOENIX_ORDER"]);
    const [ numProclamations, setNumProclamations] = useState();
    const [ valueProclamation, setValueProclamation ] = useState('');

    useEffect(() => {
        if (gameInfo){
            setPlayerName(gameInfo.elections?.minister); 
            setGameName(gameInfo.name);
        }
    }, [gameInfo,setPlayerName])

    useEffect(() => {
            //getProclamationsInfo(playerName,gameName)
            //setDeck(proclamationsInfo);
            setNumProclamations(Object((gameInfo.proclamations)?.proclamations).length);
    },[gameInfo])

    function ShowSquare(proclamation){

        return (
            <button className = "square" >
                {assignImgProclamation(proclamation)}
            </button>
        );
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
        };

        return (
            <div>
                <button style={{ cursor: 'pointer' }} onClick={handleClick}>
                    Proclamaciones: {numProclamationsInDeck}
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
                <span className ={classes.imageSrc} style={{ backgroundImage: `url(${require('../../../constants/images/TableroOF.png')})`,}}/>
                <span className={classes.imageBackdrop}>
                    {ShowSquare()}
                    {ShowSquare()}
                    {ShowSquare()}
                    {ShowSquare()}
                    {ShowSquare()}
                </span>
            </div>
        </div>
    )
}

/*const images = [
    {
        url: require('../../../constants/images/Proclamacion.jpg'),
        title: 'Mortifagos1',
        width: '20%',
    },
    {
        url: require('../../../constants/images/Descarte.jpg'),
        title: 'Descarte',
        width: '20%',
    }
];*/

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