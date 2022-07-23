import React, { useState } from 'react';
import { Button, Checkbox, FormControlLabel, Grid, makeStyles, Switch, TextField, Typography } from '@material-ui/core';
import AppTextInput from '../../../components/form/AppTextInput';
import ApplicationCard from './application/Application';
import { callApi } from '../../../utils/api';
import EmptyScreen from '../../../components/EmptyScreen';
import CardViewWrapper from '../../../components/HOC/CardViewWrapper';
import CustomPagination from '../../../components/CustomPagination';
import { showSuccess } from '../../../utils/notifications';
import ConfirmationModal from '../../../components/ConfirmationModal';
import { isActiveForRoles } from '../../../utils/auth';
import { getISODatetime } from '../../../utils/helper';



const useStyles = makeStyles((theme) => ({
    root: {
        margin: '10px',
        padding: '25px',
        backgroundColor: '#EEF1F8',
        borderRadius: '10px'
    },
    header: {
        fontSize: '18px',
        fontWeight: '500',
        paddingBottom: '15px'
    },
    delegationGrid: {
        backgroundColor: 'white',
        padding: '30px',
        borderRadius: '10px',
        marginBottom: '20px',
    },
    divtwo: { 
        flex: 1, 
        overflow: 'auto', 
    },
}));

const delegatBody = {
    "filter": {
      
      "userId": ''
    },
    "keyword": "string",
    "pageNumber": 0,
    "pageSize": 10,
    "sortDirection": "ASC",
    "sortOn": [
      "id"
    ]
  }

export default function Delegation(props) {
    const classes = useStyles();
    const [delStatus, setDelStatus] = useState(false)
    const [newData, setNewData] = useState({
        active: false,
        endDate: null,
        startDate: null,
        delegateTo: 'John Doe',
        consent: false,
        activatedOn: ''
    });
    const [showConfirmation, setShowConfirmation] = useState(false);

    const handleDelStatus = (status) => {
        callApi(`/authsrvc/delegate/${status ? 'activate' : 'deactivate'}/${newData.id}`, 'PUT')
            .then(res => {
                res && res.success && setNewData({ ...newData, active: status })
                showSuccess("Updated Successfully")
            })
            // .catch(err => console.log(err))
    }

    const getUserDelegation = () => {
        let obj = delegatBody;
        obj.filter.userId = props.match.params.id;
        callApi('/authsrvc/delegate/listDelegateByUserId', 'POST', obj)
            .then(res => {
                if(res.success && res.data && res.data.content.length > 0) {
                    setNewData(res.data.content[0]);
                    setDelStatus(true)
                }
            })
            // .catch(err => console.log(err))
    }

    React.useEffect(() => getUserDelegation(), [])

    return (
        <div className={classes.root}> 
            <Grid container>
                <Grid container>
                    <Grid item xs={3}>
                        <Typography className={classes.header}>Delegation</Typography>
                    </Grid>
                </Grid>
                { !delStatus ? <EmptyScreen /> : <>
                <Grid container className={classes.delegationGrid}>
                    <Grid container>
                        <Grid item xs={6} className="mt-2">
                                Delegation State
                            </Grid>
                            <Grid item xs={6}>
                                <FormControlLabel
                                    className='float-right'
                                    control={
                                        <Switch
                                            name="status"
                                            color="primary"
                                            checked={newData.active}
                                            onChange={(e) => setShowConfirmation(true)}
                                            disabled={!isActiveForRoles(['ORG_ADMIN'])}
                                        />
                                    }
                                />
                            </Grid>
                    </Grid>
                </Grid>
                <Grid container className={classes.delegationGrid}>
                    <Grid container className="mb-3">
                        <Grid item xs={12} sm={6}>
                            <AppTextInput
                                disabled
                                type='text'
                                label='Status'
                                value={newData.status}
                                className="mx-2"
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <AppTextInput
                                disabled
                                type='text'
                                label='Delegated To'
                                value={newData.assigneName}
                                className="mx-2"
                            />
                        </Grid>
                    </Grid> 
                    <Grid container >
                        <Grid item xs={12} sm={6}>
                            <AppTextInput
                                disabled
                                type="datetime-local"
                                label='Start Date'
                                value={getISODatetime(newData.startDate, 'DD-MM-YYYY HH:mm')}
                                className="mx-2"
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <AppTextInput
                                disabled
                                type="datetime-local"
                                label='End Date'
                                value={getISODatetime(newData.endDate, 'DD-MM-YYYY HH:mm')}
                                className="mx-2"
                            />
                        </Grid>
                    </Grid>
                </Grid></> }
            </Grid>
            <ConfirmationModal 
                open={showConfirmation} 
                name={`${newData.active ? 'Deactivate' : 'Activate'} user's delegation`} 
                // content='Warning'
                onClose={() => {
                    setShowConfirmation(false)
                }} 
                onConfirm={() => {
                    handleDelStatus(!newData.active);
                }}
            />
        </div>    
    );
}