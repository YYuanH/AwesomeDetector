import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles, withStyles, Button, Dialog, DialogTitle, DialogContent, DialogActions, RadioGroup, TextField, InputAdornment } from '@material-ui/core';
import { FormControlLabel, Radio } from '@material-ui/core';
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


export default function P2PDialog(props) {
    const classes = useStyles();
    const { open, id, idTo, clientList, type, onClose, onChange, onClick } = props;

    return (
        <Dialog
            open={open}
            onClose={onClose}
            fullWidth
            maxWidth='sm'
            scroll='paper'
        >
            <DialogTitle>客户端{id}可向以下某一客户端发起P2P网络{type}速率测速：</DialogTitle>
            <DialogContent dividers>
                <TextField
                    required
                    autoFocus
                    className={classes.space}
                    id="param"
                    label="测速数据"
                    onChange={onChange('param')}
                    variant="outlined"
                    //margin="normal"
                    size="small"
                    InputProps={{
                        endAdornment: <InputAdornment position="end">Mb</InputAdornment>,
                    }}
                />
                <RadioGroup
                    onChange={onChange('idTo')}
                    value={idTo}
                    aria-label='p2p-list'
                    name='list'
                >
                    {clientList.map((item) => (
                        <FormControlLabel
                            control={<Radio />}
                            label={'客户端' + item.client_id}
                            value={item.client_id.toString()} //Radio组件的值须为字符串
                            key={item.ip + item.client_id}
                        />
                    ))}
                </RadioGroup>
            </DialogContent>
            <DialogActions>
                <ColorButton variant='contained' color='primary' className={classes.button} onClick={onClick}>确认</ColorButton>
                <ColorButton variant='contained' color='primary' className={classes.button} onClick={onClose}>取消</ColorButton>
            </DialogActions>
        </Dialog>
    );
}

P2PDialog.propTypes = {
    open: PropTypes.bool,
    id: PropTypes.number,
    idTo: PropTypes.number,
    clientList: PropTypes.array,
    type: PropTypes.string,
    onClose: PropTypes.func,
    onChange: PropTypes.func,
    onClick: PropTypes.func,
};