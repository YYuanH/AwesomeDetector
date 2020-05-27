import React from 'react';
import { makeStyles, Typography, TextField, InputAdornment, Button, Popover, Dialog, DialogTitle, DialogActions } from '@material-ui/core';
import AccountCircle from '@material-ui/icons/AccountCircle';

import { ToDelUser } from '../../api/manage';

const useStyles = makeStyles(theme => ({
    title: {
        padding: theme.spacing(2),
    },
    form: {
        margin: theme.spacing(2),
    },
    button: {
        margin: theme.spacing(3, 0),
    },
    warning: {
        margin: theme.spacing(2),
        color: '#f44336',
        fontSize: '1000',
    },
    success: {
        margin: theme.spacing(2),
        color: '#4caf50',
        fontSize: '1000',
    },
    dialogTitle: {
        margin: theme.spacing(2),
    },
    dialogButton: {
        margin: theme.spacing(2,1),
    },
}));

export default function DelUser() {
    const classes = useStyles();

    const [username, setUsername] = React.useState('');
    const handleChange = event => setUsername(event.target.value)

    //确认对话框
    const [openDialog, setOpenDialog] = React.useState(false);
    const handleCloseDialog = () => setOpenDialog(false);
    //删除成功弹窗 
    const [openSuccess, setOpenSuccess] = React.useState(false);
    const handleCloseSuccess = () => setOpenSuccess(false);
    //删除失败弹窗
    const [openFailed, setOpenFailed] = React.useState(false);
    const handleCloseFailed = () => setOpenFailed(false);

    //删除用户
    const handleDelUser = () => {
        let data = {username: username};
        handleCloseDialog();
        ToDelUser(data).then(res => {
            if(res.body.status) {
                //成功
                setOpenSuccess(true);
            } else {
                //失败
                setOpenFailed(true);
            }
        }).catch(err => console.log(err));
    }
    
    const handleSubmit = e => {
        e.preventDefault();
        setOpenDialog(true);
    }

    return (
        <div>
            {/* 确认是否删除该用户的提示弹窗 */}
            <Dialog
                open={openDialog}
                onClose={handleCloseDialog}
            >
                <DialogTitle className={classes.dialogTitle}>注意：确认删除用户{username}吗？删除后将无法撤回</DialogTitle>
                <DialogActions>
                    <Button 
                        onClick={handleDelUser} 
                        variant='contained' 
                        color='secondary'
                        className={classes.dialogButton}
                    >
                        删除
                    </Button>
                    <Button 
                        onClick={handleCloseDialog} 
                        variant='contained' 
                        className={classes.dialogButton}
                    >
                        取消
                    </Button>
                </DialogActions>
            </Dialog>
            {/* 删除成功的提示弹窗 */}
            <Popover
                open={openSuccess}
                onClose={handleCloseSuccess}
                anchorReference="anchorPosition"
                anchorPosition={{ top:50, left:650 }}
            >
                <Typography className={classes.success}>删除成功！</Typography>
            </Popover>
            {/* 删除失败的提示弹窗 */}
            <Popover
                open={openFailed}
                onClose={handleCloseFailed}
                anchorReference="anchorPosition"
                anchorPosition={{ top:50, left:650 }}
            >
                <Typography className={classes.warning}>删除失败，该用户不存在！</Typography>
            </Popover>
            <Typography variant='h5' className={classes.title} >
                删除用户
            </Typography>
            <form className={classes.form} onSubmit={handleSubmit}>
                <TextField
                    required
                    id='del-username'
                    label='用户名'
                    name='username'
                    fullWidth
                    variant='outlined'
                    margin='normal'
                    onChange={handleChange}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <AccountCircle />
                            </InputAdornment>
                        ),
                    }}
                />
                <Button
                    type='submit' 
                    fullWidth 
                    variant='contained' 
                    color='secondary' 
                    size='large'
                    className={classes.button}>
                    删除用户
                </Button>
            </form>
        </div>
    );
}