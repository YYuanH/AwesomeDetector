import React from 'react';
import { withStyles, makeStyles,Typography, TextField, InputAdornment, IconButton, Button, Popover } from '@material-ui/core';
import AccountCircle from '@material-ui/icons/AccountCircle';
import Lock from '@material-ui/icons/Lock';
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';
import { cyan } from '@material-ui/core/colors';

import { ModifyPassword } from '../../api/manage';

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
}));

const ColorButton = withStyles(theme => ({
    root: {
        backgroundColor: cyan[500],
        '&:hover': {
            backgroundColor: cyan[700],
        },
    },
}))(Button);

export default function Modify() {
    const classes = useStyles();

    //密码不一致提示弹窗 
    const [anchorEl, setAnchorEl] = React.useState(null);
    const open = Boolean(anchorEl);
    const handleClosePopover = () => setAnchorEl(null);

    //修改失败提示弹窗 
    const [openModifyFailed, setOpenModiyFailed] = React.useState(false);
    const handleCloseModifyFailed = () => setOpenModiyFailed(false);
    
    //修改成功提示弹窗
    const [openModified, setOpenModified] = React.useState(false);
    const handleCloseModified = () => setOpenModified(false);

    //密码可见性切换
    const [showPassword, setShowPassword] = React.useState(false);
    const handleClickShowPassword = () => {
        setShowPassword(!showPassword);
    };

    const [modifying, setModifying] = React.useState({
        username: '',
        password: '',
        newPassword: '',
        comfirmedPassword: '',
    });
    const handleChange_1 = name => event => {
        setModifying({...modifying, [name]: event.target.value});
    }

    //点击按钮
    const handleModifying = event => {
        event.preventDefault();
        //检查新密码与确认密码是否一致
        if(modifying.newPassword !== modifying.comfirmedPassword){
            setAnchorEl(event.currentTarget);
        } else {
            //提价表单并提示结果
            let data = {
                username: modifying.username,
                old_password: modifying.password,
                new_password: modifying.newPassword
            };
            ModifyPassword(data).then(res => {               
                if(!res.body.status){
                    //失败
                    setOpenModiyFailed(true);
                } else {
                    //成功
                    setOpenModified(true);
                }
            }).catch( err => console.log(err) );
        }    
    }

    return (
      <div>
        {/* 连续两次输入的密码不一致出现提示 */}
        <Popover
            open={open}
            anchorEl={anchorEl}
            onClose={handleClosePopover}
            anchorOrigin={{vertical: 'bottom', horizontal: 'center'}}
        >
            <Typography className={classes.warning}>密码不一致,请保证新密码与确认密码相同！</Typography>
        </Popover>
        {/* 修改密码失败 */}
        <Popover
            open={openModifyFailed}
            onClose={handleCloseModifyFailed}
            anchorReference="anchorPosition"
            anchorPosition={{top:50, left:650}}
        >
            <Typography className={classes.warning}>该用户不存在，请检查用户名和密码！</Typography>
        </Popover>
        {/* 修改密码成功 */}
        <Popover
            open={openModified}
            onClose={handleCloseModified}
            anchorReference="anchorPosition"
            anchorPosition={{top:50, left:650}}
        >
            <Typography className={classes.success}>密码修改成功！</Typography>
        </Popover>
        <Typography variant='h5' className={classes.title} >
            修改密码
        </Typography>
        <form className={classes.form} onSubmit={handleModifying}>
            <TextField 
                required
                id='modify-username'
                label='用户名'
                name='username'
                fullWidth
                variant='outlined'
                margin='normal'
                onChange={handleChange_1('username')}
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
                id='modify-password'
                label='当前密码'
                name='password'
                fullWidth
                variant='outlined'
                margin='normal'
                onChange={handleChange_1('password')}
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
                id='modify-new-password'
                label='新密码'
                name='new-password'
                fullWidth
                variant='outlined'
                margin='normal'
                onChange={handleChange_1('newPassword')}
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
            <TextField 
                required
                id='modify-confirmed-password'
                label='确认密码'
                name='confirmed-password'
                fullWidth
                variant='outlined'
                margin='normal'
                onChange={handleChange_1('comfirmedPassword')}
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
                修改密码
            </ColorButton>
        </form>
      </div>  
    );
}