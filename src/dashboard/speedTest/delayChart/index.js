import React from 'react';
import PropTypes from 'prop-types';
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

export default function DelayChart(props) {
    const { delayData, clientId } = props;
    const classes = useStyles();

    return (
        <Paper className={classes.paperHeight}>
            <Typography color='primary' variant='subtitle1' className={classes.title} >
                延时
            </Typography>
            <MyLine data={delayData} style={{ height: cardHeight - 12 }} clientId={clientId} />
        </Paper>
    );
}

// UploadChart.propTypes = {
//     upData: PropTypes.object.isRequired
// };