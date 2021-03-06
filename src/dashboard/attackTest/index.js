import React from 'react';
import { Grid, TextField, FormControl, FormControlLabel, RadioGroup, Radio, FormLabel, Tooltip } from '@material-ui/core';
import { makeStyles, withStyles, Container, Paper, Typography, Divider, Button, Popover, CircularProgress } from '@material-ui/core';
import { List, ListItem, ListItemIcon, ListItemText, ListItemSecondaryAction } from '@material-ui/core';
import { createMuiTheme, MuiThemeProvider } from '@material-ui/core/styles';
import { green } from '@material-ui/core/colors';
import ComputerIcon from '@material-ui/icons/Computer';

import { GetList } from '../../api/speedTest';
import { CreateMission, IsFinished, GetResult, CreateAttackMission } from '../../api/mission';
import ErrorDialog from '../speedTest/errorDialog';
import FloodDialog from './floodDialog';
import isNumber from '../../utils/isNumber';
import isIP from '../../utils/isIP';

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
        // marginLeft: theme.spacing(9),
        marginTop: theme.spacing(2),
        marginBottom: theme.spacing(2),
    },
    text: {
        margin: theme.spacing(1),
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
    //令Grid中的按钮居中显示：Grid是包含按钮的容器，故在容器之上使用flex布局，作用于容器内部的元素
    box: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center'
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

const HtmlTooltip = withStyles((theme) => ({
    arrow: {
        color: theme.palette.common.white,
    },
    tooltip: {
        backgroundColor: theme.palette.common.white,
        color: 'rgba(0, 0, 0, 0.87)',
        boxShadow: theme.shadows[2],
        fontSize: 14,
    },
}))(Tooltip);

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


    {/* 输入校验 */ }
    const [errState, setErrState] = React.useState({
        errIP: false,
        errPort: false,
        errFloodNum: false,
        errPackNum: false,
        msgIP: '',
        msgPort: '',
        msgFloodNum: '',
        msgPackNum: '',
        disableIP: false,
        disablePort: false,
        disableFloodNum: false,
        disablePackNum: false,
    })
    const isErr = type => {
        switch (type) {
            case 'target_ip':
                if (!isIP(values.target_ip))
                    setErrState({ ...errState, errIP: true, msgIP: 'IP地址不合法', disableIP: true })
                else
                    setErrState({ ...errState, errIP: false, msgIP: '', disableIP: false })
                break;
            case 'target_port':
                if (!isNumber(values.target_port))
                    setErrState({ ...errState, errPort: true, msgPort: '只能输入整数', disablePort: true })
                else
                    setErrState({ ...errState, errPort: false, msgPort: '', disablePort: false })
                break;
            case 'flood_numbers':
                if (!isNumber(values.flood_numbers))
                    setErrState({ ...errState, errFloodNum: true, msgFloodNum: '只能输入整数', disableFloodNum: true })
                else
                    setErrState({ ...errState, errFloodNum: false, msgFloodNum: '', disableFloodNum: false })
                break;
            case 'package_numbers':
                if (!isNumber(packNum))
                    setErrState({ ...errState, errPackNum: true, msgPackNum: '只能输入整数', disablePackNum: true })
                else
                    setErrState({ ...errState, errPackNum: false, msgPackNum: '', disablePackNum: false })
                break;
            default:
                break;
        }
    }

    {/* 对任意客户端发起攻击， */ }
    const [values, setValues] = React.useState({
        target_ip: '',
        target_port: '',
        type: '',
        flood_numbers: '100',
    })
    const handleChange = name => event => {
        setValues({ ...values, [name]: event.target.value });
    }


    //关闭三个攻击按钮上的Popover
    const handleClosePopover = () => setAnchorEl(null);
    //打开三个攻击按钮上的Popover，并显示不同颜色按钮的含义
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

    {/* SYN UDP洪水所需的额外参数 */ }
    const [synUdpStates, setSynUdpStates] = React.useState({
        id: -1,
        ip: '',
        mac: '',
        index: -1,
        type: '',
    });
    //SYN、UDP洪水攻击弹窗中，输入的发包量
    const [packNum, setPackNum] = React.useState('100');
    //输入改变
    const handleChangePackNum = event => { setPackNum(event.target.value) }
    //点击SYN、UDP供水攻击按钮
    const handleClickSynUdp = (clientId, clientIP, clientMAC, synUdpType, clientIndex) => {
        setSynUdpStates({
            id: clientId,
            ip: clientIP,
            mac: clientMAC,
            index: clientIndex,
            type: synUdpType,
        });
        handleOpenSynUdp(); //打开弹窗
    }
    {/* SYN/UDP攻击弹窗的开启关闭状态 */ }
    const [openSynUdp, setOpenSynUdp] = React.useState(false);
    //开启弹窗
    const handleOpenSynUdp = () => { setOpenSynUdp(true); }
    //关闭弹窗
    const handleCloseSynUdp = () => {
        setOpenSynUdp(false);
        if (errState.errPackNum)
            setErrState({ ...errState, errPackNum: false, msgPackNum: '', disablePackNum: false })
    }


    //关闭错误警告弹窗
    const handleCloseErrorDialog = () => { setOpenErrorDialog(false) }
    //打开错误警告弹窗 
    const handleOpenErrorDialog = massege => {
        setMsg(massege);
        setOpenErrorDialog(true);
    }


    {/** 获取客户端列表并初始化按钮状态 */ }
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

    {/** 查询任务状态，任务完成时请求任务结果 */ }
    const checking = (mission_id, index, type) => {
        var data = { mission_id: mission_id }
        var id = clientList[index].client_id
        //检查任务是否完成
        IsFinished(data).then(res => {
            console.log(clientList[index].client_id, mission_id, type, 'Checking the state ...');
            if (res.body.status) {
                //任务完成时，请求数据，终止超时检测，终止轮询
                if (res.body.data.is_done) {
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

    {/** 创建任务并轮询任务结果 */ }
    const handleClick = (id, ip, mac, type, index) => {
        var data = {
            client_id: id,
            ip: ip,
            mac: mac,
            type: type,
            params: packNum,
        };
        var states_temp = [].concat(states);
        handleCloseSynUdp();
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

    {/** 提交表单，发起对任意客户端的攻击 */ }
    const handleSubmit = e => {
        e.preventDefault();
        CreateAttackMission(values).then(res => {
            if (!res.body.status) {
                console.log(res.body);
                handleOpenErrorDialog("攻击测试任务创建失败！");
            } else {

            }
        }).catch(err => console.log(err));
    }




    return (
        <Container maxWidth='lg' className={classes.container}>
            <ErrorDialog open={openErrorDialog} handleClose={handleCloseErrorDialog} msg={msg} />
            <Grid container spacing={4}>
                <Grid item xs={12} lg={12}>
                    <Paper>
                        <form onSubmit={handleSubmit}>
                            <Grid item lg={12}>
                                <Typography variant='subtitle1' color='primary' className={classes.title}>
                                    指定设备洪水攻击测试
                                </Typography>
                                <Divider />
                                <TextField
                                    required
                                    className={classes.text}
                                    error={errState.errIP}
                                    helperText={errState.msgIP}
                                    id="ip"
                                    label="IP地址"
                                    onChange={handleChange("target_ip")}
                                    onKeyUp={() => isErr('target_ip')}
                                    variant="outlined"
                                    margin="normal"
                                />
                                <TextField
                                    required
                                    className={classes.text}
                                    error={errState.errPort}
                                    helperText={errState.msgPort}
                                    id="port"
                                    label="端口"
                                    onChange={handleChange("target_port")}
                                    onKeyUp={() => isErr('target_port')}
                                    variant="outlined"
                                    margin="normal"
                                />
                                <HtmlTooltip title="请确认发包量填写无误" placement="top" arrow>
                                    <TextField
                                        required
                                        className={classes.text}
                                        error={errState.errFloodNum}
                                        helperText={errState.msgFloodNum}
                                        id="flood-numbers"
                                        label="发包量"
                                        value={values.flood_numbers}
                                        onChange={handleChange("flood_numbers")}
                                        onKeyUp={() => isErr('flood_numbers')}
                                        variant="outlined"
                                        margin="normal"
                                    />
                                </HtmlTooltip>
                                <FormControl className={classes.text}>
                                    <FormLabel>攻击类型：</FormLabel>
                                    <RadioGroup row value={values.type} onChange={handleChange('type')}>
                                        <FormControlLabel value='SYN' label="SYN洪水" control={<Radio />} />
                                        <FormControlLabel value='UDP' label="UDP洪水" control={<Radio />} />
                                        <FormControlLabel value='SHA' label="HTTP长连接" control={<Radio />} />
                                    </RadioGroup>
                                </FormControl>
                            </Grid>
                            <Grid item lg={12} className={classes.box}>
                                <Button type='submit' variant='contained' color='primary' className={classes.attack_button} disabled={errState.disableIP || errState.disablePort || errState.disableFloodNum}>
                                    发起攻击测试
                                </Button>
                            </Grid>
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
                                                    onClick={() => handleClickSynUdp(item.client_id, item.ip, item.mac, 'SYN', index)}
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
                                                    onClick={() => handleClickSynUdp(item.client_id, item.ip, item.mac, 'UDP', index)}
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
            {/* 鼠标移动到三个攻击按钮上时出现消息提示 */}
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
            <FloodDialog
                open={openSynUdp}
                id={synUdpStates.id}
                err={errState.errPackNum}
                errMsg={errState.msgPackNum}
                disable={errState.disablePackNum}
                value={packNum}
                onKeyUp={isErr}
                type={synUdpStates.type}
                onChange={handleChangePackNum}
                onClose={handleCloseSynUdp}
                onClick={() => handleClick(synUdpStates.id, synUdpStates.ip, synUdpStates.mac, synUdpStates.type, synUdpStates.index)}
            />
        </Container>
    );
}