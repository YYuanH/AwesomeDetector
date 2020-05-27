import React from 'react';
import { Grid, TextField, FormControl, FormControlLabel, RadioGroup, Radio, FormLabel } from '@material-ui/core';
import { makeStyles, Container, Paper, Typography, Divider, Button, Popover, CircularProgress } from '@material-ui/core';
import { List, ListItem, ListItemIcon, ListItemText, ListItemSecondaryAction } from '@material-ui/core';
import { createMuiTheme, MuiThemeProvider } from '@material-ui/core/styles';
import { green } from '@material-ui/core/colors';
import ComputerIcon from '@material-ui/icons/Computer';

import { GetList } from '../../api/speedTest';
import { CreateMission, IsFinished, GetResult, CreateAttackMission } from '../../api/mission';
import ErrorDialog from '../speedTest/errorDialog';

const useStyles = makeStyles(theme => ({
    container: {
        marginTop: theme.spacing(4),
        marginBottom: theme.spacing(4),
    },
    title: {
        padding: theme.spacing(1),
        fontWeight: 600,
    },
    button: {
        marginRight: theme.spacing(2),
    },
    attack_button: {
        marginLeft: theme.spacing(9),
        marginTop: theme.spacing(3)
    },
    text: {
        margin: theme.spacing(2),
    },
    popover: {
        pointerEvents: 'none',
    },
    popoverPaper: {
        padding: theme.spacing(1),
    },
    buttonProgress: {
        color: green[500],
        position: 'absolute',
        zIndex: 1,
        top: '23%',
        marginLeft: theme.spacing(-10),
    },
}));

const theme = createMuiTheme({
    palette: {
        primary: {
            main: '#4caf50',
            contrastText: '#fff',
        },
    },
});

export default function AttackTest(props) {
    const classes = useStyles();
    const [openErrorDialog, setOpenErrorDialog] = React.useState(false);
    const [msg, setMsg] = React.useState('');
    const [anchorEl, setAnchorEl] = React.useState(null);
    const openPopover = Boolean(anchorEl);
    const [popoverStr, setPopoverStr] = React.useState('');
    const [clientList, setClientList] = React.useState(Array);
    //primary表示“安全”，secondary表示“有风险”，default表示“尚未测试” 
    const [states, setStates] = React.useState(Array);
    const [values, setValues] = React.useState({
        target_ip: '',
        target_port: '',
        type: ''
    })

    //关闭Popover
    const handleClosePopover = () => setAnchorEl(null);
    //打开Popover，并显示不同颜色按钮的含义
    const handleOpenPopover = (event, type) => {
        switch (type) {
            case 'primary':
                setPopoverStr('安全');
                break;
            case 'secondary':
                setPopoverStr('有风险');
                break;
            default:
                setPopoverStr('尚未检测');
                break;
        }
        setAnchorEl(event.currentTarget);
    }

    //获取客户端列表并初始化按钮状态
    React.useEffect(() => {
        GetList().then(res => {
            if (res.body.status) {
                var states_temp = [];
                states_temp = res.body.data.clients.map(item => {
                    var obj_temp = {};
                    switch (item.syn) {
                        case 'SAFE':
                            obj_temp.SYN = 'primary';
                            break;
                        case 'DANGER':
                            obj_temp.SYN = 'secondary';
                            break;
                        default:
                            obj_temp.SYN = 'default';
                            break;
                    };
                    switch (item.udp) {
                        case 'SAFE':
                            obj_temp.UDP = 'primary';
                            break;
                        case 'DANGER':
                            obj_temp.UDP = 'secondary';
                            break;
                        default:
                            obj_temp.UDP = 'default';
                            break;
                    };
                    switch (item.sha) {
                        case 'SAFE':
                            obj_temp.SHA = 'primary';
                            break;
                        case 'DANGER':
                            obj_temp.SHA = 'secondary';
                            break;
                        default:
                            obj_temp.SHA = 'default';
                            break;
                    };
                    obj_temp.synLoading = false;
                    obj_temp.udpLoading = false;
                    obj_temp.shaLoading = false;
                    return obj_temp;
                });
                setStates(states_temp);
                setClientList(res.body.data.clients);
            } else {
                console.log(res.body);
                handleOpenErrorDialog('在线客户端列表获取失败');
            }
        }).catch(err => console.log(err))
    }, [])

    //查询任务状态，任务完成时请求任务结果 
    const checking = (mission_id, index, type) => {
        var data = { mission_id: mission_id }
        var id = clientList[index].client_id
        //检查任务是否完成
        IsFinished(data).then(res => {
            console.log(clientList[index].client_id, mission_id, type, 'Checking the state ...');
            if (res.body.status) {
                //任务完成时，请求数据，终止超时检测，终止轮询
                if (res.body.data.isDone) {
                    console.log(clientList[index].client_id, mission_id, type, 'Misstion is done.');
                    //终止超时监听
                    clearTimeout(document.attackTestTimeout[id][type]);
                    //请求数据
                    GetResult(data).then(res => {
                        if (res.body.status) {
                            var value = res.body.data.result[0].value;
                            console.log(id, mission_id, type, 'Got the data.', value)
                            var states_temp = [].concat(states);
                            var loadingStr;
                            switch (type) {
                                case 'SYN':
                                    loadingStr = 'synLoading';
                                    break;
                                case 'UDP':
                                    loadingStr = 'udpLoading';
                                    break;
                                default:
                                    loadingStr = 'shaLoading';
                                    break;
                            }
                            switch (value) {
                                case 'SAFE':
                                    states_temp[index][type] = 'primary';
                                    states_temp[index][loadingStr] = false;
                                    break;
                                case 'DANGER':
                                    states_temp[index][type] = 'secondary';
                                    states_temp[index][loadingStr] = false;
                                    break;
                                default:
                                    states_temp[index][type] = 'default';
                                    states_temp[index][loadingStr] = false;
                                    break;
                            }
                            setStates(states_temp);
                        } else {
                            console.log(res.body);
                            let errMsg = type === 'SHA' ? 'HTTP长连接' : type;
                            handleOpenErrorDialog(errMsg + '攻击测试任务已完成，但无法获得测试结果');
                        }
                        //终止轮询
                        clearInterval(document.checkingTimerInterval[id][type]);
                    }).catch(err => console.log(err));
                }
            } else {
                var states_temp = [].concat(states);
                switch (type) {
                    case 'SYN':
                        states_temp[index].synLoading = false;
                        break;
                    case 'UDP':
                        states_temp[index].udpLoading = false;
                        break;
                    default:
                        states_temp[index].shaLoading = false;
                        break;
                }
                setStates(states_temp);
                console.log(res.body);
                let errMsg = type === 'SHA' ? 'HTTP长连接' : type;
                handleOpenErrorDialog('无法检测到' + errMsg + '攻击测试任务是否完成');
                clearInterval(document.checkingTimerInterval[id][type]);
            }
        }).catch(err => console.log(err));
    }

    //创建任务并轮询任务结果
    const handleClick = (id, ip, mac, type, index) => {
        var data = {
            client_id: id,
            ip: ip,
            mac: mac,
            type: type
        };
        var states_temp = [].concat(states);
        switch (type) {
            case 'SYN':
                states_temp[index].synLoading = true;
                break;
            case 'UDP':
                states_temp[index].udpLoading = true;
                break;
            default:
                states_temp[index].shaLoading = true;
                break;
        }
        var time = type === 'SHA' ? 105000 : 40000;
        setStates(states_temp);
        //当计时器对象为空时，初始化计时器对象为{}
        if (!document.checkingTimerInterval) {
            document.checkingTimerInterval = {};
        }
        if (!document.checkingTimerInterval[id]) {
            document.checkingTimerInterval[id] = {};
        }
        //当超时监听对象为空时，初始化超时监听对象为{}
        if (!document.attackTestTimeout) {
            document.attackTestTimeout = {}
        }
        if (!document.attackTestTimeout[id]) {
            document.attackTestTimeout[id] = {}
        }

        //创建任务
        CreateMission(data).then(res => {
            let errMsg = type === 'SHA' ? 'HTTP长连接' : type;
            if (res.body.status) {
                var mission_id = res.body.data.mission_id;
                //轮询，直到任务完成
                document.checkingTimerInterval[id][type] = setInterval(checking, 2000, mission_id, index, type);
                //超时
                document.attackTestTimeout[id][type] = setTimeout(() => {
                    switch (type) {
                        case 'SYN':
                            states_temp[index].synLoading = false;
                            break;
                        case 'UDP':
                            states_temp[index].udpLoading = false;
                            break;
                        default:
                            states_temp[index].shaLoading = false;
                            break;
                    }
                    clearInterval(document.checkingTimerInterval[id][type]);
                    console.log('超时', mission_id, type, time);
                    setStates(states_temp);
                    handleOpenErrorDialog(errMsg + '测试超时');
                }, time);
            } else {
                console.log(res.body);
                handleOpenErrorDialog(errMsg + '任务创建失败');
            }
        }).catch(err => console.log(err));
    }

    //关闭错误警告弹窗
    const handleCloseErrorDialog = () => { setOpenErrorDialog(false) }

    //打开错误警告弹窗 
    const handleOpenErrorDialog = massege => {
        setMsg(massege);
        setOpenErrorDialog(true);
    }

    const handleSubmit = e => {
        e.preventDefault();
        CreateAttackMission(values).then(res => {
            if(!res.body.status) {
                console.log(res.body);
                handleOpenErrorDialog("攻击测试任务创建失败！");
            } else {

            }
        }).catch(err => console.log(err));
    }

    const handleChange = name => event => {
        if (name === 'target_ip')
            setValues({ ...values, [name]: event.target.value })
        else if (name === "target_port")
            setValues({ ...values, [name]: event.target.value })
        else
            setValues({ ...values, [name]: event.target.value })
    }


    return (
        <Container maxWidth='lg' className={classes.container}>
            <ErrorDialog open={openErrorDialog} handleClose={handleCloseErrorDialog} msg={msg} />
            <Grid container spacing={4}>
                <Grid item xs={12} lg={12}>
                    <Paper>
                        <form onSubmit={handleSubmit}>
                            <Typography variant='subtitle1' color='primary' className={classes.title}>
                                指定设备洪水攻击测试
                            </Typography>
                            <Divider />
                            <TextField
                                required
                                className={classes.text}
                                id="ip"
                                label="IP地址"
                                onChange={handleChange("target_ip")}
                                variant="outlined"
                                margin="normal"
                            />
                            <TextField
                                required
                                className={classes.text}
                                id="port"
                                label="端口"
                                onChange={handleChange("target_port")}
                                variant="outlined"
                                margin="normal"
                            />
                            <FormControl className={classes.text}>
                                <FormLabel>攻击类型：</FormLabel>
                                <RadioGroup row value={values.type} onChange={handleChange('type')}>
                                    <FormControlLabel value='SYN' label="SYN洪水" control={<Radio />} />
                                    <FormControlLabel value='UDP' label="UDP洪水" control={<Radio />} />
                                    <FormControlLabel value='SHA' label="HTTP长连接" control={<Radio />} />
                                </RadioGroup>
                            </FormControl>
                            <Button type='submit' variant='contained' color='primary' className={classes.attack_button}>
                                发起攻击测试
                            </Button>
                        </form>
                    </Paper>
                </Grid>
                <Grid item xs={12} lg={12}>
                    <Paper>
                        <Typography variant='subtitle1' color='primary' className={classes.title}>
                            在线设备洪水攻击测试
                        </Typography>
                        <Divider />
                        <div style={{ height: '60vh', overflowY: 'scroll' }}>
                            <List>
                                {clientList.map((item, index) => (
                                    <ListItem key={index}>
                                        <ListItemIcon>
                                            <ComputerIcon />
                                        </ListItemIcon>
                                        <ListItemText
                                            style={{ whiteSpace: 'pre' }}
                                            primary={item.client_id}
                                            secondary={`状态:${item.status}    IP:${item.ip}    MAC:${item.mac}    OS:${item.operation_system}`}
                                        />
                                        <ListItemSecondaryAction>
                                            <MuiThemeProvider theme={theme}>
                                                <Button
                                                    variant='contained'
                                                    color={states[index].SYN}
                                                    className={classes.button}
                                                    onClick={() => handleClick(item.client_id, item.ip, item.mac, 'SYN', index)}
                                                    onMouseEnter={(event) => handleOpenPopover(event, states[index].SYN)}
                                                    onMouseLeave={handleClosePopover}
                                                    disabled={states[index].synLoading}
                                                >
                                                    SYN洪水
                                                </Button>
                                                {states[index].synLoading && <CircularProgress size={24} className={classes.buttonProgress} />}
                                                <Button
                                                    variant='contained'
                                                    color={states[index].UDP}
                                                    className={classes.button}
                                                    onClick={() => handleClick(item.client_id, item.ip, item.mac, 'UDP', index)}
                                                    onMouseEnter={(event) => { handleOpenPopover(event, states[index].UDP) }}
                                                    onMouseLeave={handleClosePopover}
                                                    disabled={states[index].udpLoading}
                                                >
                                                    UDP洪水
                                                </Button>
                                                {states[index].udpLoading && <CircularProgress size={24} className={classes.buttonProgress} />}
                                                <Button
                                                    variant='contained'
                                                    color={states[index].SHA}
                                                    className={classes.button}
                                                    onClick={() => handleClick(item.client_id, item.ip, item.mac, 'SHA', index)}
                                                    onMouseEnter={(event) => { handleOpenPopover(event, states[index].SHA) }}
                                                    onMouseLeave={handleClosePopover}
                                                    disabled={states[index].shaLoading}
                                                >
                                                    HTTP长连接
                                                </Button>
                                                {states[index].shaLoading && <CircularProgress size={24} className={classes.buttonProgress} />}
                                            </MuiThemeProvider>
                                        </ListItemSecondaryAction>
                                    </ListItem>
                                ))}
                            </List>
                        </div>
                    </Paper>
                </Grid>
            </Grid>

            <Popover
                classes={{ paper: classes.popoverPaper }}
                className={classes.popover}
                open={openPopover}
                anchorEl={anchorEl}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
                onClose={handleClosePopover}
            >
                <Typography variant='body2'>
                    {popoverStr}
                </Typography>
            </Popover>
        </Container>
    );
}