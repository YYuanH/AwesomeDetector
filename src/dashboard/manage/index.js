import React from 'react';
import { Container, Paper,  makeStyles, Grid, Divider } from '@material-ui/core';
import Modify from './modify';
import AddUser from './addUser';
import DelUser from './delUser';
import GetUsers from './getUsers';

const useStyles = makeStyles(theme => ({
    container: {
        marginTop: theme.spacing(4),
        marginBottom: theme.spacing(4),
    },
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
}));

export default function Manage(props) {
    const classes = useStyles();
    // const [showPassword, setShowPassword] = React.useState(false);
    // const handleClickShowPassword = () => {
    //     setShowPassword(!showPassword);
    // };

    // //删除用户
    // const [showPassword_2, setShowPassword_2] = React.useState(false);
    // const handleClickShowPassword_2 = () => {
    //     setShowPassword_2(!showPassword_2);
    // };
    return (
        <Container maxWidth='lg' className={classes.container}>
            <Paper>
                <Grid container>
                    <Grid item lg={6} md={8} xs={12}>
                        <GetUsers />
                    </Grid>
                </Grid>
                <Divider />
                <Grid container>
                    <Grid item lg={6} md={8} xs={12}>
                        <AddUser />
                    </Grid>
                </Grid>
                <Divider />
                <Grid container>
                    <Grid item lg={6} md={8} xs={12}>
                        <Modify />
                    </Grid>
                </Grid>
                <Divider />
                <Grid container>
                    <Grid item lg={6} md={8} xs={12}>
                        <DelUser />
                    </Grid>
                </Grid>
            </Paper>
        </Container>
    );
}