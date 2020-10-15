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

export default function UpDialog(props) {
    const classes = useStyles();
    const { open, id, err, errMsg, disable, onClose, onChange, onClick } = props;

    return (
        < Dialog
            open = { open }
            onClose = { onClose }
            fullWidth
            maxWidth = 'sm'
        >
            <DialogTitle>客户端{id} 吞吐量测试参数：</DialogTitle>
            <DialogContent dividers>
            <TextField
                required
                autoFocus
                error={err}
                helperText={errMsg}
                className={classes.space}
                id="params"
                label="测速数据"
                onChange={onChange}
                variant="outlined"
                margin="normal"
                InputProps={{
                    endAdornment: <InputAdornment position="end">Mb</InputAdornment>,
                }}
            />
            </DialogContent>
            <DialogActions>
                <ColorButton variant='contained' color='primary' className={classes.button} onClick={onClick} disabled={disable}>发起测试</ColorButton>
                <ColorButton variant='contained' color='primary' className={classes.button} onClick={onClose}>取消</ColorButton>
            </DialogActions>
        </Dialog >
    );
}

UpDialog.propTypes = {
    open: PropTypes.bool,
    err: PropTypes.bool,
    errMsg: PropTypes.string,
    disable: PropTypes.bool,
    id: PropTypes.number,
    onClose: PropTypes.func,
    onChange: PropTypes.func,
    onClick: PropTypes.func,
};