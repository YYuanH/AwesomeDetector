import React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { Table, TableHead, TableBody, TableRow, TableCell, withStyles, CircularProgress } from '@material-ui/core';
import { makeStyles, Paper, Typography } from '@material-ui/core';
import { cyan } from '@material-ui/core/colors';


const useStyles = makeStyles(theme => ({
    title: {
        padding: theme.spacing(1),
        fontWeight: 600,
    },
    paperHeight: {
        height: 290,
    },
    circularProgressCommon: {
        color: cyan[500],
        position: 'absolute',
        zIndex: 2,
        [theme.breakpoints.up('lg')]: {
            marginLeft: theme.spacing(-8),
        },
        [theme.breakpoints.down('md')]: {
            marginLeft: theme.spacing(-23),
        },
        [theme.breakpoints.down('sm')]: {
            marginLeft: theme.spacing(-15),
        },
    },
    circularProgress_1: {
        top: '25%',
    },
    circularProgress_2: {
        top: '28%',
    }
}));

//自定义Table的样式
const StyledTableCell = withStyles(theme => ({
    head: {
        backgroundColor: '#66bb6a',
        color: '#fff',
        fontSize: 18,
    },
    body: {
        fontSize: 16,
    },
}))(TableCell);

export default function PingTable(props) {
    const classes = useStyles();
    const { values, pingLoading, routerLoading, clientId } = props;

    return (
        <Paper className={classes.paperHeight}>
            <Typography variant='subtitle1' color='primary' className={classes.title}>
                Ping
            </Typography>
            <div style={{ margin: '12px' }}>
                <Typography variant='subtitle1' align='center' gutterBottom>
                    客户端{clientId}
                </Typography>
                <Table>
                    <TableHead>
                        <TableRow>
                            <StyledTableCell align='center'>Items</StyledTableCell>
                            <StyledTableCell align='center' >Values</StyledTableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {values.map((row, index) => (
                            <TableRow key={row.name}>
                                <StyledTableCell align='center'>{row.name}</StyledTableCell>
                                <StyledTableCell align='right' >{(row.value && index === 0) ? row.value + 'ms' : row.value}</StyledTableCell>
                                <td style={{ position: 'relative' }}>{row.name === 'ping' ? (
                                    pingLoading && < CircularProgress size={24} className={clsx(classes.circularProgress_1, classes.circularProgressCommon)} />
                                ) : (
                                        routerLoading && < CircularProgress size={24} className={clsx(classes.circularProgress_2, classes.circularProgressCommon)} />
                                    )}
                                </td>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </Paper>
    );
}
PingTable.propTypes = {
    values: PropTypes.array,
    pingLoading: PropTypes.bool,
    routerLoading: PropTypes.bool,
}
