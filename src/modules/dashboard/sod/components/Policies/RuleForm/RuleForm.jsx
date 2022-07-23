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

const RuleForm = ({ 
  newData, 
  checkRuleName, 
  checkRuleRole1, 
  checkRuleRole2, 
  errors, 
  change, 
  roleList,
  setNewData,
  setBusinessRoleQuery,
  loadBusinessRoleList,
  businessRoleQuery }) => {
  const classes = useStyles();

  return(
    <form>
      <Grid container spacing={16}>
        <Grid item xs={12} className={classes.item}>
          <AppTextInput
            required
            value={newData.name}
            error={!!errors.name}
            onBlur={checkRuleName}
            helperText={errors.name}
            onChange={e => change({ name: e.target.value })}
            label="Rule Name" />
        </Grid>
        <Grid item xs={12} lg={3}>
          Business Role A <span className='text-danger'>*</span>
        </Grid>
        <Grid item xs={12} className={classes.item}>
        <Autocomplete
          options={roleList}
          onFocus={loadBusinessRoleList}
          value={newData.entityValue1}
          onChange={(event, newValue, reason) => {
            setBusinessRoleQuery({ ...businessRoleQuery, keyword: event.target.value})
            if (newValue && newValue.name) {
              setBusinessRoleQuery({ ...businessRoleQuery, keyword: newValue.name });
              setNewData({ ...newData, entityValue1: newValue.name })
            }
            if(reason === 'clear') {
              setBusinessRoleQuery({ ...businessRoleQuery, keyword: "" });
              setNewData({ ...newData, entityValue1: "" });  
            }
          }}
          getOptionSelected={(o, v) => o.name === v}
          autoHighlight
          filterOptions={(options, state) => {
            const res = options.filter((o) => {
              const name = `${o.name}`.toLowerCase()
              return name.includes(state.inputValue.toLowerCase())
            })
            return res
          }}
          getOptionLabel={(option) => {
            const role = roleList.find(r => r.name === option || r.name === newData.entityValue1)
            if (!role) return ''
            return `${role.name}`
          }}
          renderOption={(option) => (
            <React.Fragment>
              {option.name}
            </React.Fragment>
          )}
          renderInput={(params) => (
            <TextField
              {...params}
              variant="outlined"
              size="small"
              className={classes.textField}
              fullWidth
              onBlur={checkRuleRole1}
              error={!!errors.entityValue1}
              helperText={errors.entityValue1}
            />
          )}
        />
        </Grid>
        <Grid item xs={12} lg={3}>
          Business Role B <span className='text-danger'>*</span>
        </Grid>
        <Grid item xs={12} className={classes.item}>
        <Autocomplete
          options={roleList}
          onFocus={loadBusinessRoleList}
          value={newData.entityValue2}
          onChange={(event, newValue, reason) => {
            setBusinessRoleQuery({ ...businessRoleQuery, keyword: event.target.value})
            if (newValue && newValue.name) {
              setBusinessRoleQuery({ ...businessRoleQuery, keyword: newValue.name });
              setNewData({ ...newData, entityValue2: newValue.name })
            }
            if(reason === 'clear') {
              setBusinessRoleQuery({ ...businessRoleQuery, keyword: "" });
              setNewData({ ...newData, entityValue2: "" });  
            }
          }}
          getOptionSelected={(o, v) => o.name === v}
          autoHighlight
          filterOptions={(options, state) => {
            const res = options.filter((o) => {
              const name = `${o.name}`.toLowerCase()
              return name.includes(state.inputValue.toLowerCase())
            })
            return res
          }}
          getOptionLabel={(option) => {
            const role = roleList.find(r => r.name === option || r.name === newData.entityValue2)
            if (!role) return ''
            return `${role.name}`
          }}
          renderOption={(option) => (
            <React.Fragment>
              {option.name !== newData.entityValue1 ? option.name : null}
            </React.Fragment>
          )}
          renderInput={(params) => (
            <TextField
              {...params}
              variant="outlined"
              size="small"
              className={classes.textField}
              fullWidth
              onBlur={checkRuleRole2}
              error={!!errors.entityValue2}
              helperText={errors.entityValue2}
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

export default RuleForm;