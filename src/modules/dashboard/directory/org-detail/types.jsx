import React from 'react'
import { Switch, Route, Redirect } from "react-router-dom"
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(() => ({
    container: {
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        height: '100%',
        padding: 15,
    }
}))

export default function Types(props) {
    const classes = useStyles()

    return (
        <>
            {/* <p>type</p> */}
        </>
    )
}