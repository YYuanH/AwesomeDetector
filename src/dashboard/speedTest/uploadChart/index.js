import React from 'react';
import { makeStyles, Paper, Typography } from '@material-ui/core';

import MyLine from '../../../component/myline';

const cardHeight = 290;

const useStyles = makeStyles(theme => ({
    title: {
        padding: theme.spacing(1),
        fontWeight: 600,
    },
    paperHeight: {
        height: cardHeight,
    },
}));

export default function UploadChart(props) {
    const { upData, clientId } = props;
    const classes = useStyles();

    return (
        <Paper className={classes.paperHeight}>
            <Typography color='primary' variant='subtitle1' className={classes.title} >
                上行速度
            </Typography>
            <MyLine data={upData} style={{ height: cardHeight - 12 }} clientId={clientId} />
        </Paper>
    );
}
