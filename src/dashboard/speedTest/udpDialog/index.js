import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles, withStyles, Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField, InputAdornment } from '@material-ui/core';
import { cyan } from '@material-ui/core/colors';

const useStyles = makeStyles(theme => ({
    space: {
        marginRight: theme.spacing(2),
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

export default function UdpDialog(props) {
    const classes = useStyles();
    const { open, id, type, errDur, errDurMsg, errSpeed, errSpeedMsg, disable, onClose, onChange, onClick } = props;

    return (
        < Dialog
            open = { open }
            onClose = { onClose }
            fullWidth
            maxWidth = 'sm'
        >
            <DialogTitle>客户端{id} UDP{type}测速参数：</DialogTitle>
            <DialogContent dividers>
            <TextField
                required
                autoFocus
                error={errDur}
                helperText={errDurMsg}
                className={classes.space}
                id="duration"
                label="测试持续时间"
                onChange={onChange('duration')}
                variant="outlined"
                margin="normal"
                InputProps={{
                    endAdornment: <InputAdornment position="end">秒</InputAdornment>,
                }}
            />
            <TextField
                required
                error={errSpeed}
                helperText={errSpeedMsg}
                id="speed"
                label="测试速度"
                onChange={onChange('speed')}
                variant="outlined"
                margin="normal"
                InputProps={{
                    endAdornment: <InputAdornment position="end">Mb/s</InputAdornment>,
                }}
            />
            </DialogContent>
            <DialogActions>
                <ColorButton variant='contained' color='primary' className={classes.button} onClick={onClick} disabled={disable}>发起UDP{type}测速</ColorButton>
                <ColorButton variant='contained' color='primary' className={classes.button} onClick={onClose}>取消</ColorButton>
            </DialogActions>
        </Dialog >
    );
}

UdpDialog.propTypes = {
    open: PropTypes.bool,
    errDur: PropTypes.bool,
    errSpeed: PropTypes.bool,
    errDurMsg: PropTypes.string,
    errSpeedMsg: PropTypes.string,
    disable: PropTypes.bool,
    id: PropTypes.number,
    type: PropTypes.string,
    onClose: PropTypes.func,
    onChange: PropTypes.func,
    onClick: PropTypes.func,
};