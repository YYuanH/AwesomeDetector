import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles, withStyles, Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField, InputAdornment, Typography, Popover } from '@material-ui/core';
import { cyan } from '@material-ui/core/colors';

const useStyles = makeStyles(theme => ({
    space: {
        marginRight: theme.spacing(2),
    },
    popover: {
        pointerEvents: 'none',
    },
    typography: {
        padding: theme.spacing(1),
    },
}));

//自定义按钮
const ColorButton = withStyles(theme => ({
    root: {
        backgroundColor: cyan[500],
        '&:hover': {
            backgroundColor: cyan[700]
        },
    },
}))(Button);

export default function FloodDialog(props) {
    const classes = useStyles();
    const { open, id, type, onClose, onChange, onClick } = props;

    {/** 攻击按钮上的浮窗 */ }
    const [anchorEl, setAnchorEl] = React.useState(null);
    const openPopover = Boolean(anchorEl);
    const handleOpenPopover = event => { setAnchorEl(event.currentTarget) }
    const handleClosePopover = () => { setAnchorEl(null) }

    return (
        < Dialog
            open={open}
            onClose={onClose}
            fullWidth
            maxWidth='sm'
        >
            <DialogTitle>客户端{id} 针对{type}洪水攻击的发包数量：</DialogTitle>
            <DialogContent dividers>
                <Typography color="primary">请谨慎填写发包数量，当客户端检测到的包数量大于或等于输入值的95%时，将上报“有风险”状态！</Typography>
                <TextField
                    required
                    autoFocus
                    className={classes.space}
                    id="package-number"
                    label="发包量"
                    onChange={onChange}
                    variant="outlined"
                    margin="normal"
                />
            </DialogContent>
            <DialogActions>
                <ColorButton
                    variant='contained'
                    color='primary'
                    className={classes.button}
                    onClick={onClick}
                    onMouseEnter={handleOpenPopover}
                    onMouseLeave={handleClosePopover}
                >
                    发起{type}洪水攻击
                </ColorButton>
                <ColorButton variant='contained' color='primary' className={classes.button} onClick={onClose}>取消</ColorButton>
            </DialogActions>
            <Popover
                className={classes.popover}
                open={openPopover}
                anchorEl={anchorEl}
                anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'center'
                }}
                transformOrigin={{
                    vertical: 'bottom',
                    horizontal: 'center'
                }}
            >
                <Typography variant="subtitle2" className={classes.typography}>
                    发起{type}洪水攻击测试:<br/>此操作属<b>危险操作</b>，请<b>确认无误</b>再发起！
                </Typography>
            </Popover>
        </Dialog >

    );
}

FloodDialog.propTypes = {
    open: PropTypes.bool,
    id: PropTypes.number,
    type: PropTypes.string,
    onClose: PropTypes.func,
    onChange: PropTypes.func,
    onClick: PropTypes.func,
};