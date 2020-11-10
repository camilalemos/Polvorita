import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import ButtonBase from '@material-ui/core/ButtonBase';

//import TableroMortifago1 from '../../../constants/images/TableroM1.png'

function Square(props) {

    //const [value, setValue] = useState(null)

    return (
        <button className = "square">
            {props.value}
        </button>
    )
}

/*export default function  Board() {
    
    //const [square, setSquare] = useState({square})

    function ShowSquare(i){

        return (
            <Square
                //value = {setSquare.squares[i]}
            />
        );
    }

    return (
        <div className="Board"> 
            <div className = "Mortifagos" background= {TableroMortifago1} >
                {ShowSquare(0)}
                {ShowSquare(1)}
                {ShowSquare(2)}
                {ShowSquare(3)}
                {ShowSquare(4)}
                {ShowSquare(5)}
            </div>
            <p>
                {ShowSquare(12)}
                {ShowSquare(13)}
            </p>
            <div className = "FenixOrder">
                {ShowSquare(6)}
                {ShowSquare(7)}
                {ShowSquare(8)}
                {ShowSquare(9)}
                {ShowSquare(10)}
                {ShowSquare(11)}
            </div>

        </div>

    )
}
*/

const images = [
  {
    url: require('../../../constants/images/TableroM1.png'),
    title: 'Mortifagos1',
    width: '60%',
  },
  {
    url: require('../../../constants/images/TableroOF.png'),
    title: 'Mortifagos2',
    width: '60%',
  },
  {
    url: require('../../../constants/images/Descarte.jpg'),
    title: 'Descarte',
    width: '10%',
  }

];

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexWrap: 'wrap',
    minWidth: 300,
    width: '100%',
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
    backgroundColor: theme.palette.common.black,
    opacity: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: theme.palette.common.white,
    transition: theme.transitions.create('opacity'),
  },
  imageTitle: {
    position: 'relative',
    padding: `${theme.spacing(2)}px ${theme.spacing(4)}px ${theme.spacing(1) + 6}px`,
  },
  imageMarked: {
    height: 3,
    width: 18,
    backgroundColor: theme.palette.common.white,
    position: 'absolute',
    bottom: -2,
    left: 'calc(50% - 9px)',
    transition: theme.transitions.create('opacity'),
  },
}));

export default function ButtonBases() {
  const classes = useStyles();

  function ShowSquare(i){

    return (
        <Square
            //value = {setSquare.squares[i]}
        />
    );
}

    return (
        <div className={classes.root}>
            {images.map((image) => (
                <ButtonBase
                    focusRipple
                    key={image.title}
                    className={classes.image}
                    focusVisibleClassName={classes.focusVisible}
                    style={{
                    width: image.width,
                    }}
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
                </ButtonBase>
            ))}
        </div>
    );
}







