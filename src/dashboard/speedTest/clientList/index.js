import React from 'react';
import PropTypes from 'prop-types';
import { withStyles, CircularProgress, Collapse } from '@material-ui/core';
import { makeStyles, Paper, Button, Typography, Divider } from '@material-ui/core';
import { List, ListItem, ListItemIcon, ListItemText, ListItemSecondaryAction } from '@material-ui/core';
import { cyan, green } from '@material-ui/core/colors';
import Computer from '@material-ui/icons/Computer';
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';

const useStyles = makeStyles(theme => ({
    title: {
        padding: theme.spacing(1),
        fontWeight: 600,
    },
    button: {
        marginRight: theme.spacing(1),
        color: theme.palette.common.white,
    },
    buttonProgress_p2p: {
        color: green[500],
        position: 'absolute',
        zIndex: 1,
        top: '18%',
        marginLeft: theme.spacing(-8),
    },
    buttonProgress_pingRouter: {
        color: green[500],
        position: 'absolute',
        zIndex: 1,
        top: '18%',
        marginLeft: theme.spacing(-9),
    },
    buttonProgress_upDown: {
        color: green[500],
        position: 'absolute',
        zIndex: 1,
        top: '18%',
        marginLeft: theme.spacing(-7),
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

export default function ClientList(props) {
    const classes = useStyles();
    const { list, onClickP2PUpload, onClickP2PDownload, onClickPing, onClickTestUploadSpeed,  onClickUdpUpload, onClickUdpDownload } = props;

    const nestedList = {};
    list.forEach((item, index) => {
        nestedList[index] = false;
    })
    //操作嵌套列表
    const [open, setOpen] = React.useState(nestedList);
    const handleClick = (index) => { setOpen({...open, [index]:!open[index]}) }
    


    return (
        <Paper style={{ height: '480px', margin: '10px' }}>
            <Typography variant='subtitle1' className={classes.title} color='primary'>在线设备</Typography>
            <Divider />
            <div style={{ height: '420px', overflowY: 'scroll' }}>              
                {list.map((item, index) => (
                    <List key={index} >
                        <ListItem button onClick={() => handleClick(index)}>
                            <ListItemIcon>
                                <Computer />
                            </ListItemIcon>
                            <ListItemText
                                style={{ whiteSpace: 'pre' }}
                                primary={item.client_id}
                                secondary={`状态:${item.status}   IP:${item.ip}   MAC:${item.mac}   OS:${item.operation_system}`}
                            />
                            {open[index] ? <ExpandLess /> : <ExpandMore />}
                        </ListItem>
                        <Collapse  in={open[index]} timeout="auto" unmountOnExit>
                            <List>
                              <ListItem>
                                <ListItemText primary="QoS测试" />
                                <ListItemSecondaryAction>
                                    <ColorButton
                                        size='small'
                                        variant='contained'
                                        color='primary'
                                        disabled={item.uploadLoading}
                                        className={classes.button}
                                        onClick={() => onClickTestUploadSpeed(item.client_id)}
                                    >
                                        上行测速
                                    </ColorButton>
                                    {item.uploadLoading && <CircularProgress size={22} className={classes.buttonProgress_upDown} />}
                                    <ColorButton
                                        size='small'
                                        variant='contained'
                                        color='primary'
                                        disabled={item.udpDownloadLoading}
                                        className={classes.button}
                                        onClick={() => onClickUdpDownload(item.client_id)}
                                    >
                                        下行测速
                                    </ColorButton>                                    
                                    {item.udpDownloadLoading && <CircularProgress size={22} className={classes.buttonProgress_upDown} />}
                                    <ColorButton
                                        size='small'
                                        variant='contained'
                                        color='primary'
                                        disabled={item.p2pUploadLoading}
                                        className={classes.button}
                                        onClick={() => onClickP2PUpload(item.client_id, index)}
                                    >
                                        P2P上行测速
                                    </ColorButton>
                                    {item.p2pUploadLoading && <CircularProgress size={22} className={classes.buttonProgress_p2p} />}
                                    <ColorButton
                                        size='small'
                                        variant='contained'
                                        color='primary'
                                        disabled={item.p2pDownloadLoading}
                                        className={classes.button}
                                        onClick={() => onClickP2PDownload(item.client_id, index)}
                                    >
                                        P2P下行测速
                                    </ColorButton>                                    
                                    {item.p2pDownloadLoading && <CircularProgress size={22} className={classes.buttonProgress_p2p} />}
                                    <ColorButton
                                        size='small'
                                        variant='contained'
                                        color='primary'
                                        disabled={item.udpUploadLoading}
                                        className={classes.button}
                                        onClick={() => onClickUdpUpload(item.client_id)}
                                    >
                                        UDP上行测速
                                    </ColorButton>
                                    {item.udpUploadLoading && <CircularProgress size={22} className={classes.buttonProgress_p2p} />}
                                    
                                    <ColorButton
                                        size='small'
                                        variant='contained'
                                        color='primary'
                                        disabled={item.pingLoading || item.routerLoading}
                                        className={classes.button}
                                        onClick={() => onClickPing(item.client_id)}
                                    >
                                        路由跳数/延迟
                                    </ColorButton>
                                    {item.pingLoading && <CircularProgress size={22} className={classes.buttonProgress_pingRouter} />}
                                    {item.routerLoading && <CircularProgress size={22} className={classes.buttonProgress_pingRouter} />}
                                </ListItemSecondaryAction>
                              </ListItem>
                            </List>
                        </Collapse>
                    </List>
                ))}               
            </div>
        </Paper>
    );
}
ClientList.propTypes = {
    list: PropTypes.array,
    onClickP2P: PropTypes.func,
    onClickPing: PropTypes.func,
    onClickTestSpeed: PropTypes.func
}