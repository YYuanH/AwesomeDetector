import React from 'react';
import { makeStyles, withStyles, Typography, Button, Popover, Table, TableHead, TableBody, TableRow, TableCell } from '@material-ui/core';
import {cyan} from '@material-ui/core/colors';

import { ToGetUsers } from '../../api/manage';

const useStyles = makeStyles(theme => ({
    root: {
        margin: theme.spacing(2),
    },
    title: {
        padding: theme.spacing(2, 0),
    },
    button: {
        margin: theme.spacing(3, 0),
    },
    warning: {
        margin: theme.spacing(2),
        color: '#f44336',
        fontSize: '1000',
    },
}));

//自定义按钮
const ColorButton = withStyles(theme => ({
    root: {
        backgroundColor: cyan[500],
        color: theme.palette.common.white,
        '&:hover': {
            backgroundColor: cyan[700]
        },
    },
}))(Button);
//自定义表格 
const StyledTableCell = withStyles(theme => ({
    head: {
        backgroundColor: '#66bb6a',
        color: '#fff',
        fontSize: 15,
    },
    body: {
        fontSize: 15,
    },
}))(TableCell);

export default function GetUsers() {
    const classes = useStyles();
    const [users, setUsers] = React.useState(['/']);
    //请求失败弹窗
    const [openFailed, setOpenFailed] = React.useState(false);
    const handleCloseFailed = () => setOpenFailed(false);
    
    const handleClick = () => {
        ToGetUsers().then(res => {
            if(res.body.status){
                setUsers(res.body.data.username);
            } else {
                setOpenFailed(true);
            }           
        }).catch(err => console.log(err));
    }

    return (
        <div className={classes.root}>
            {/* 请求失败时出现提示弹窗 */}
            <Popover
                open={openFailed}
                onClose={handleCloseFailed}
                anchorReference='anchorPosition'
                anchorPosition={{ top:50, left:650 }}
            >
                <Typography className={classes.warning}>查询失败</Typography>
            </Popover>
            <Typography variant='h5' className={classes.title} >
                查询用户
            </Typography>
            <ColorButton variant="contained" onClick={handleClick} className={classes.button}>
                查询用户
            </ColorButton>
            <Table>
                <TableHead>
                    <TableRow>
                        <StyledTableCell align='center'>用户名</StyledTableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {users.map((username, index) => (
                        <TableRow key={index}>
                            <StyledTableCell align='center'>{username}</StyledTableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );    
}