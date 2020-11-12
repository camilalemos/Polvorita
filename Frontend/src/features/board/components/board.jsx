import React, {useState} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Slide from '@material-ui/core/Slide';
import Snackbar from '@material-ui/core/Snackbar';

//import ShowProclamation from './proclamation';
//import Button from '@material-ui/core/Button';
//import TableroMortifago1 from '../../../constants/images/TableroM1.png'
  
function Square() {

    return (
        <button className = "square" >
            Cartas
        </button>
    )
}

export default function  Board() {
  
  const classes = useStyles();

  function ShowSquare(i){
    return (
      <Square/>
    );
  }

  function TransitionUp(props) {
    return <Slide {...props} direction="up" />;
  }

  const ShowDeck = () => {

    const [open, setOpen] = React.useState(false);
    const [transition, setTransition] = React.useState(undefined);
    const deckfake = ["OF","OF","Mortifago"]
    
    const handleClick = (Transition) => () => {
      setTransition(() => Transition);
      setOpen(true);
    };
  
    const handleClose = () => {
      setOpen(false);
    };

    return (
      <div>
        <button onClick={handleClick(TransitionUp)}>Cartas del Deck</button>
        <Snackbar open={open} onClose={handleClose} TransitionComponent={transition} key={transition ? transition.name : ''}>
          <div>
            {deckfake.map((proc) => (
              <button>
              {proc}
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
          {ShowSquare(0)}
          {ShowSquare(1)}
          {ShowSquare(2)}
          {ShowSquare(3)}
          {ShowSquare(4)}
          {ShowSquare(5)}
        </span>
      </div>
      <div className={classes.root} > {images.map((image) => (
        <div focusRipple  className={classes.image} focusVisibleClassName={classes.focusVisible}
            style={{width: image.width,}} disable>
          <span className ={classes.imageSrc} style={{ backgroundImage: `url(${image.url})`,}} />
            <span className={classes.imageBackdrop}>
              {ShowDeck()}
          </span>
        </div>
        ))}
      </div>
        <div focusRipple  className={classes.image} focusVisibleClassName={classes.focusVisible}
          style={{width: '70%',}} disable>
        <span className ={classes.imageSrc} style={{ backgroundImage: `url(${require('../../../constants/images/TableroOF.png')})`,}} />
          <span className={classes.imageBackdrop}>
            {ShowSquare(6)}
            {ShowSquare(7)}
            {ShowSquare(8)}
            {ShowSquare(9)}
            {ShowSquare(10)}
        </span>
      </div>
    </div>
  )
}


const images = [
  /*{
    url: require('../../../constants/images/TableroM1.png'),
    title: 'Mortifagos1',
    width: '60%',
  },
  {
    url: require('../../../constants/images/TableroOF.png'),
    title: 'Mortifagos2',
    width: '60%',
  },*/
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

/*export default function ButtonBases() {
  const classes = useStyles();

    return (
        <div className={classes.root}>
            {images.map((image) => (
                <div
                    focusRipple
                    key={image.title}
                    className={classes.image}
                    focusVisibleClassName={classes.focusVisible}
                    style={{
                    width: image.width,
                    }} disable
                >
                    <span
                    className={classes.imageSrc}
                    style={{
                        backgroundImage: `url(${image.url})`,
                    }}
                    />
                    <span className={classes.imageBackdrop}>
                        {ShowSquare(0)}
                        {ShowSquare(1)}
                        {ShowSquare(2)}
                        {ShowSquare(3)}
                        {ShowSquare(4)}
                        {ShowSquare(5)}
                    </span> 
                </div>
            ))}
        </div>
    );
}*/
