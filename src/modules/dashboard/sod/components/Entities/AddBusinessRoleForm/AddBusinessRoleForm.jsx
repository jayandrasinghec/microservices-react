import React from 'react';
import { Grid, makeStyles } from '@material-ui/core';
import AppTextInput from '../../../../../../components/form/AppTextInput';
import AppCheckbox from '../../../../../../components/form/AppCheckbox';

const useStyles = makeStyles((theme) => ({
  item: {
    marginBottom: theme.spacing(2)
  }
}))

const AddBusinessRoleForm = ({ newData, errors, checkCname, change }) => {
  
  const classes = useStyles();

  return(
    <form>
      <Grid container spacing={16}>
        <Grid item xs={12} className={classes.item}>
          <AppTextInput
            required
            value={newData.name}
            error={!!errors.name}
            onBlur={checkCname}
            helperText={errors.name}
            onChange={e => change({ name: e.target.value })}
            label="Business Role Name" />
        </Grid>
        <Grid item xs={12} className={classes.item}>
          <AppTextInput
            value={newData.description}
            onChange={e => change({ description: e.target.value })}
            label="Business Role Description"
            multiline
            rows={3} />
        </Grid>
        <Grid item xs={12} className={classes.item}>
          <AppCheckbox
            value={newData.active} onChange={e => change({ active: Boolean(e) })}
            switchLabel={newData.active === true ? 'Active' : 'Inactive'}
            label="Status" />
        </Grid>
      </Grid>
    </form>
  );
}

export default AddBusinessRoleForm;