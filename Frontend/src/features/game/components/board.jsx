import React, {useState} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Snackbar from '@material-ui/core/Snackbar';

export default function  Board() {
  
  const classes = useStyles();
  const deckfake = ["OF","OF","Mortifago"]

  function ShowSquare(){

    return (
      <button className = "square" >
            Cartas
      </button>
    );
  }
  const assignImgProclamation = (proclamations) => {

    if (proclamations == "OF") {
      return (
        <img src={require('../../../constants/images/ProclamacionF.jpg')} alt= "Proclamacion Orden Fenix" style={{width: "150px", height: "190px"}}></img>)
    } else {
      return (
        <img src={require('../../../constants/images/ProclamacionM.jpg')} alt= "Proclamacion Mortifagos" style={{width: "150px", height: "190px"}}></img>)
    }
  }


  const Deck = (proclamations, numproclamations,) => {

    const [open, setOpen] = useState(false);
    const [numProclamationInDeck, setNumProclamationInDeck] = useState(numproclamations);
    
    const handleClick = () => {
      setOpen(true);
      if (numProclamationInDeck > 0) {
        setNumProclamationInDeck(numProclamationInDeck - 3);
      }
    };
  
    const handleClose = (event) => {
      setOpen(false)
    };

    return (
      <div>
        <button onClick={handleClick}>
          Proclamaciones: {numProclamationInDeck}
          <img src= {require('../../../constants/images/Proclamacion.jpg')} alt= "Proclamacion" style={{width: "150px", height: "190px"}}></img>
        </button>
        <Snackbar open={open} display= 'flex'>
          <div>
            {proclamations.map((threeproclamations) => (
              <button onClick={handleClose}>
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
      <div focusRipple  className={classes.image} focusVisibleClassName={classes.focusVisible}
        style={{width: '70%',}} disable>
        <span className ={classes.imageSrc} style={{ backgroundImage: `url(${require('../../../constants/images/TableroM1.png')})`,}} />
        <span className={classes.imageBackdrop}>
          {ShowSquare()}
          {ShowSquare()}
          {ShowSquare()}
          {ShowSquare()}
          {ShowSquare()}
          {ShowSquare()}
        </span>
      </div>
      <div display= 'flex' style= {{width: 'min-content'}}>
            {Deck(deckfake,21)}
      </div>
        <div focusRipple  className={classes.image} focusVisibleClassName={classes.focusVisible}
          style={{width: '70%',}} disable>
        <span className ={classes.imageSrc} style={{ backgroundImage: `url(${require('../../../constants/images/TableroOF.png')})`,}} />
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

const images = [
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
];

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