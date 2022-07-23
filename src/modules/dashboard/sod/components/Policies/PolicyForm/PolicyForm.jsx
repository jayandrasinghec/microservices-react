import React from 'react';
import { Grid, makeStyles, TextField } from '@material-ui/core';
import AppCheckbox from '../../../../../../components/form/AppCheckbox';
import AppTextInput from '../../../../../../components/form/AppTextInput';
import { Autocomplete } from '@material-ui/lab';

const useStyles = makeStyles((theme) => ({
  item: {
    marginBottom: theme.spacing(2)
  }
}))

const PolicyForm = ({ 
  newData, 
  checkPolicyName, 
  checkPolicyOwner,
  errors, 
  change, 
  ownerList,
  setNewData,
  ownerQuery,
  setOwnerQuery,
  loadPolicyOwnerList }) => {
  const classes = useStyles();
  return(
    <form>
      <Grid container spacing={16}>
        <Grid item xs={12} className={classes.item}>
          <AppTextInput
            required
            value={newData.name}
            error={!!errors.name}
            onBlur={checkPolicyName}
            helperText={errors.name}
            onChange={e => change({ name: e.target.value })}
            label="Policy Name" />
        </Grid>
        <Grid item xs={12} className={classes.item}>
          <AppTextInput
            value={newData.description}
            onChange={e => change({ description: e.target.value })}
            label="Policy Description"
            multiline
            rows={3} />
        </Grid>
        <Grid item xs={12}>
          Policy Owner <span className='text-danger'>*</span>
        </Grid>
        <Grid item xs={12} className={classes.item}>
          <Autocomplete
            options={ownerList}
            onFocus={loadPolicyOwnerList}
            value={newData.owner}
            onChange={(event, newValue, reason) => {
              setOwnerQuery({ ...ownerQuery, keyword: event.target.value})
              if (newValue && newValue.displayName) {
                setOwnerQuery({ ...ownerQuery, keyword: newValue.displayName });
                setNewData({ ...newData, owner: newValue.displayName })
              }
              if(reason === 'clear') {
                setOwnerQuery({ ...ownerQuery, keyword: "" });
                setNewData({ ...newData, owner: "" });  
              }
            }}
            getOptionSelected={(o, v) => o.displayName === v}
            autoHighlight
            filterOptions={(options, state) => {
              const res = options.filter((o) => {
                const name = `${o.displayName}`.toLowerCase()
                return name.includes(state.inputValue.toLowerCase())
              })
              return res
            }}
            getOptionLabel={(option) => {
              const user = ownerList.find(u => u.displayName === option || u.displayName === newData.owner)
              if (!user) return ''
              return `${user.displayName}`
            }}
            renderOption={(option) => (
              <React.Fragment>
                {option.displayName}
              </React.Fragment>
            )}
            renderInput={(params) => (
              <TextField
                {...params}
                variant="outlined"
                size="small"
                className={classes.textField}
                fullWidth
                onBlur={checkPolicyOwner}
                error={!!errors.owner}
                helperText={errors.owner}
              />
            )}
          />
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

export default PolicyForm;