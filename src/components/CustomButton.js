import { Button, makeStyles } from '@material-ui/core'
import React from 'react'

const useStyle = makeStyles({
    customMargin:{
        margin: "0 16px 0 16px"
    }
})
export default function CustomButton({ text, handleClick, lockButton }) {

    const classes = useStyle();
    return (
        <Button variant="outlined" color="primary" onClick={handleClick} disabled={lockButton} className={classes.customMargin}>
            {text}
        </Button>
    );
}