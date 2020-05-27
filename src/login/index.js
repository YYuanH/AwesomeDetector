import React from 'react';
import { Dialog, DialogContent, DialogContentText } from '@material-ui/core';
import { makeStyles, Container, Avatar, Typography, TextField, Button, InputAdornment, IconButton } from '@material-ui/core';
import AccountBoxIcon from '@material-ui/icons/AccountBox';
import AccountCircle from '@material-ui/icons/AccountCircle';
import Lock from '@material-ui/icons/Lock';
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';

import SignIn from '../api/signIn';

const useStyles = makeStyles(theme => ({
    box: {
        marginTop: theme.spacing(15),
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    avatar: {
        marginBottom: theme.spacing(2),
        backgroundColor: theme.palette.secondary.main,
    },
    button: {
        marginTop: theme.spacing(3),
    },
    warningBox: {
        margin: theme.spacing(3, 2),
    },
}));

export default function Login(props) {
    const classes = useStyles();
    const { history } = props;
    const [showPassword, setShowPassword] = React.useState(false);
    const [dialogOpen, setDialogOpen] = React.useState(false);
    const [values, setValues] = React.useState({
        username: '',
        password: '',
        remember: false,
    });
    const handleClickShowPassword = () => {
        setShowPassword(!showPassword);
    };
    const handleDialogClose = () => {
        setDialogOpen(false);
    }
    const handleChange = name => event => {
        if(name === 'remember')
            setValues({ ...values, [name]: event.target.checked });
        else setValues({ ...values, [name]: event.target.value });
    };
    const handleSubmit = (e) => {
        e.preventDefault();
        SignIn(values.username, values.password).then(res => {
            if(res.body.status) {
                history.push('/dashboard');
            }
            else {
               setDialogOpen(true);
            }
        }).catch( err => console.log(err) );
    };

    return (
        <Container maxWidth='xs'>
            <div className={classes.box}>
                <Avatar className={classes.avatar}>
                    <AccountBoxIcon />
                </Avatar>
                <Typography variant='h5' gutterBottom>登录</Typography>
                <form onSubmit={handleSubmit}>
                    <TextField 
                        required
                        autoFocus
                        id='username'
                        label='用户名'
                        name='username'
                        fullWidth
                        variant='outlined'
                        margin='normal'
                        value={values.username}
                        onChange={handleChange('username')}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <AccountCircle />
                                </InputAdornment>
                            ),
                        }}
                    />
                    <TextField 
                        required
                        id='password'
                        label='密码'
                        name='password'
                        fullWidth
                        variant='outlined'
                        margin='normal'
                        type={showPassword ? 'text' : 'password'}
                        value={values.password}
                        onChange={handleChange('password')}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <Lock />
                                </InputAdornment>
                            ),
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton
                                        // edge='end'
                                        onClick={handleClickShowPassword}
                                    >
                                        {showPassword ? <VisibilityOff /> : <Visibility />}
                                    </IconButton>
                                </InputAdornment>
                            ),
                        }}
                    />
                    {/* <FormControlLabel
                        control={<Checkbox value='remember' color='primary' checked={values.remember} onChange={handleChange('remember')} />}
                        label='Remember me'
                    /> */}
                    <Button 
                        type='submit'
                        size='large'
                        fullWidth 
                        variant='contained' 
                        color='primary' 
                        className={classes.button}
                    >
                        登录
                    </Button>
                </form>
            </div>
            <Dialog open={dialogOpen} onClose={handleDialogClose} className={classes.warningBox}>
                <DialogContent>
                    <DialogContentText color='error'>登录失败！请检查用户名和密码是否输入正确！</DialogContentText>
                </DialogContent>
            </Dialog>
        </Container>
    );
}