import React from 'react';
//import Button from '@material-ui/core/Button';
//import Dialog from '@material-ui/core/Dialog';

import Snackbar from '@material-ui/core/Snackbar';
import Slide from '@material-ui/core/Slide';

const Transition = React.forwardRef(function TransitionUp(props) {
    return <Slide {...props} direction="up" />;
  });

const showProclamation = (open, onClose) => {
    const numproclamation = 0
    const mazofake = ["OF","OF","Mortifago"]
    const maxnumproclamation = 3
    
    if (numproclamation >= maxnumproclamation) {
      return (
        <p>No puedes tomar mas proclamacions</p>
        );
      }
      if(numproclamation < maxnumproclamation) {
        return (
            <div>
            <Snackbar open={open} onClick={onClose}>
                <div>
                    {mazofake.map((proc) => (
                        <button>
                        {proc}
                        Proclamacion
                        </button>
                    ))}
                </div>

            </Snackbar>
        </div>
      );
    }
  }
  export default showProclamation;
