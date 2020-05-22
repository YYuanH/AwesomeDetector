import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles, withStyles, Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField, InputAdornment } from '@material-ui/core';
import { cyan } from '@material-ui/core/colors';

const useStyles = makeStyles(theme => ({
    space: {
        marginRight: theme.spacing(2),
    },
}));

{/* 自定义按钮 */}
const ColorButton = withStyles(theme => ({
    root: {
        backgroundColor: cyan[500],
        '&:hover': {
            backgroundColor: cyan[700]
        },
    },
}))(Button);

export default function PingDialog(props) {
    const classes = useStyles();
    const { open, id, onClose, onChange, onClick } = props;

    return (
        < Dialog
            open = { open }
            onClose = { onClose }
            fullWidth
            maxWidth = 'sm'
        >
            <DialogTitle>客户端{id} Ping任务：</DialogTitle>
            <DialogContent dividers>
            <TextField
                required
                autoFocus
                className={classes.space}
                id="params"
                label="参数"
                onChange={onChange}
                variant="outlined"
                margin="normal"
                // InputProps={{
                //     endAdornment: <InputAdornment position="end">MB</InputAdornment>,
                // }}
            />
            </DialogContent>
            <DialogActions>
                <ColorButton variant='contained' color='primary' className={classes.button} onClick={onClick}>发起任务</ColorButton>
                <ColorButton variant='contained' color='primary' className={classes.button} onClick={onClose}>取消</ColorButton>
            </DialogActions>
        </Dialog >
    );
}

PingDialog.propTypes = {
    open: PropTypes.bool,
    id: PropTypes.number,
    onClose: PropTypes.func,
    onChange: PropTypes.func,
    onClick: PropTypes.func,
};