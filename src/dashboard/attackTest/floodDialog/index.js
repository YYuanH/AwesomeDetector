import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles, withStyles, Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Tooltip, Typography, Popover } from '@material-ui/core';
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

//自定义Tooltip
const HtmlTooltip = withStyles((theme) => ({
    arrow: {
        color: theme.palette.common.white,
    },
    tooltip: {
        backgroundColor: theme.palette.common.white,
        color: 'rgba(0, 0, 0, 0.87)',
        boxShadow: theme.shadows[1],
        fontSize: 14,
    },
}))(Tooltip);

export default function FloodDialog(props) {
    const classes = useStyles();
    const { open, id, type, err, errMsg, disable, value, onKeyUp, onClose, onChange, onClick } = props;

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
                    error={err}
                    helperText={errMsg}
                    value={value}
                    onKeyUp={() => onKeyUp('package_numbers')}
                    className={classes.space}
                    id="package-number"
                    label="发包量"
                    onChange={onChange}
                    variant="outlined"
                    margin="normal"
                />
            </DialogContent>
            <DialogActions>
                <HtmlTooltip title="此操作危险，请确认无误" placement="bottom" arrow>
                    <ColorButton
                        variant='contained'
                        color='primary'
                        className={classes.button}
                        disabled={disable}
                        onClick={onClick}
                    >
                        发起{type}洪水攻击
                    </ColorButton>
                </HtmlTooltip>
                <ColorButton variant='contained' color='primary' className={classes.button} onClick={onClose}>取消</ColorButton>
            </DialogActions>
        </Dialog >

    );
}

FloodDialog.propTypes = {
    open: PropTypes.bool,
    id: PropTypes.number,
    type: PropTypes.string,
    err: PropTypes.bool,
    errMsg: PropTypes.string,
    disable: PropTypes.bool,
    value: PropTypes.string,
    onKeyUp: PropTypes.func,
    onClose: PropTypes.func,
    onChange: PropTypes.func,
    onClick: PropTypes.func,
};