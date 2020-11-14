import React from 'react';
import images from '../../constants/images/index'
import Box from '@material-ui/core/Box';

const NotFound = function () {
    return (
        <Box style={{ display: 'flex', justifyContent:'center', alignItems:'center', height:'100%' }}>
            <Box component='img' src={images.page_not_found} alt='notFound' />
        </Box>
    )
}

export default NotFound;