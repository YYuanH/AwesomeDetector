import React from 'react';
import { withStyles, makeStyles, Select, MenuItem } from '@material-ui/core';
import { Typography, TextField, InputAdornment, IconButton, Button, Popover, FormControl, InputLabel } from '@material-ui/core';
import { cyan } from '@material-ui/core/colors';
import AccountCircle from '@material-ui/icons/AccountCircle';
import Lock from '@material-ui/icons/Lock';
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';

import { ToAddUser } from '../../api/manage';


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
    formControl: {
        marginBottom: theme.spacing(2),
        minWidth: 200,
    },
}));

const ColorButton = withStyles(theme => ({
    root: {
        backgroundColor: cyan[500],
        '&:hover': {
            backgroundColor: cyan[700]
        },
    },
}))(Button);

export default function AddUser() {
    const classes = useStyles();
    //密码可见性切换
    const [showPassword, setShowPassword] = React.useState(false);
    const handleClickShowPassword = () => {
        setShowPassword(!showPassword);
    };
    //密码与确认密码不一致提示弹窗 
    const [anchorEl, setAnchorEl] = React.useState(null);
    const openPopover = Boolean(anchorEl);
    const handleClosePopover = () => setAnchorEl(null);
    //添加成功提示弹窗 
    const [openAdded, setOpenAdded] = React.useState(false);
    const handleCloseAdded = () => setOpenAdded(false);
    //添加失败提示弹窗
    const [openAddFailed, setOpenAddFailed] = React.useState(false);
    const handleCloseAddFailed = () => setOpenAddFailed(false);

    const [values, setValues] = React.useState({
        username: '',
        password: '',
        confirmedPassword: '',
        identity: '',
    });
    const handleChange = name => event => {
        setValues({ ...values, [name]: event.target.value });
    }

    //增加用户 
    const handleAddUser = (e) => {
        e.preventDefault();
        //判断密码与确认密码是否相同
        if (values.password !== values.confirmedPassword) {
            setAnchorEl(e.currentTarget)
            console.log(values)
        } else {
            //请求添加用户
            const data = { ...values };
            delete data.confirmedPassword;
            ToAddUser(data).then(res => {
                if (res.body.status) {
                    //成功
                    setOpenAdded(true);
                } else {
                    //失败
                    setOpenAddFailed(true)
                }
            }).catch(err => console.log(err));
        }
    }


    return (
        <div>
            {/* 密码不一致时出现弹窗 */}
            <Popover
                open={openPopover}
                anchorEl={anchorEl}
                onClose={handleClosePopover}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'center'
                }}
            >
                <Typography className={classes.warning} >密码不一致,请保证密码与确认密码相同！</Typography>
            </Popover>
            {/* 添加成功出现弹窗 */}
            <Popover
                open={openAdded}
                anchorReference='anchorPosition'
                anchorPosition={{ top: 50, left: 650 }}
                onClose={handleCloseAdded}
            >
                <Typography className={classes.success} >成功添加用户！</Typography>
            </Popover>
            {/* 添加失败出现弹窗 */}
            <Popover
                open={openAddFailed}
                anchorReference='anchorPosition'
                anchorPosition={{ top: 50, left: 650 }}
                onClose={handleCloseAddFailed}
            >
                <Typography className={classes.warning} >添加用户失败！该用户已存在！</Typography>
            </Popover>

            <Typography variant='h5' className={classes.title} >
                创建新用户
            </Typography>
            <form className={classes.form} onSubmit={handleAddUser}>
                <FormControl className={classes.formControl}>
                    <InputLabel htmlFor="identity" >用户类型</InputLabel>
                    <Select
                        native
                        value={values.identity}
                        onChange={handleChange('identity')}
                        inputProps={{
                            name: 'identity',
                            id: 'identity',
                        }}
                    >
                        {/* <MenuItem value='root'>root</MenuItem>
                        <MenuItem value='admin'>admin</MenuItem> */}
                        <option value='' />
                        <option value='root'>Root</option>
                        <option value='admin'>Administrator</option>
                    </Select>
                </FormControl>
                <TextField
                    required
                    id='new-user-username'
                    label='用户名'
                    name='username'
                    fullWidth
                    variant='outlined'
                    margin='normal'
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
                    id='new-user-password'
                    label='密码'
                    name='password'
                    fullWidth
                    variant='outlined'
                    margin='normal'
                    onChange={handleChange('password')}
                    type={showPassword ? 'text' : 'password'}
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
                <TextField
                    required
                    id='new-user-confirmed-password'
                    label='确认密码'
                    name='confirmed-password'
                    fullWidth
                    variant='outlined'
                    margin='normal'
                    onChange={handleChange('confirmedPassword')}
                    type={showPassword ? 'Text' : 'password'}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <Lock />
                            </InputAdornment>
                        ),
                        endAdornment: (
                            <InputAdornment position="end">
                                <IconButton
                                    onClick={handleClickShowPassword}
                                >
                                    {showPassword ? <VisibilityOff /> : <Visibility />}
                                </IconButton>
                            </InputAdornment>
                        ),
                    }}
                />
                <ColorButton
                    type='submit'
                    fullWidth
                    variant='contained'
                    color='primary'
                    size='large'
                    className={classes.button}
                >
                    创建用户
                </ColorButton>
            </form>
        </div>
    );
}