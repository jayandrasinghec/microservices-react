import React, { useState } from 'react';
import { Grid, Typography, makeStyles } from '@material-ui/core';
import AppSelectInput from '../../../../../../../components/form/AppSelectInput';
import AppTextInput from '../../../../../../../components/form/AppTextInput';

const useStyles = makeStyles(() => ({
  paperLevel: {
    margin: '0 0 20px',
    padding: '7px 22px',
    display: 'flex',
    justifyContent: 'flex-start',
    backgroundColor: 'white',
    borderRadius: '10px',
    flexDirection: 'column',
    overflow: 'hidden',
    alignItems: 'flex-start',
  },
  griditemone: { 
    display: 'flex', 
    alignItems: 'center' 
  },
  displayflex: { 
    display: 'flex' 
  },
  griditemtwo: { 
    display: 'flex', 
    alignItems: 'center', 
    justifyContent: 'flex-end' 
  },
  buttondiv: { 
    display: 'flex', 
    alignItems: 'center', 
    margin: '35px 10px 10px' 
  },
  button: { 
    borderRadius: '8px' 
  },
}))

const FileItem = ({ 
  index, 
  item, 
  moduleFields, 
  handleMappings, 
  setSampleArray, 
  sampleArray, 
  setDisabledList, 
  disabledList, 
  setDisabled }) => {

  const classes = useStyles();

  const defaultValues = {
    headerRow: "",
    moduleField: "",
    row1: "",
    defaultValue: "",
  }

  const [newData, setNewData] = useState(item ? item : defaultValues);
  
  const change = (e) => {
    setNewData({ ...newData, ...e });
    let sample = sampleArray;
    sample[index] = {...newData, ...e};
    setSampleArray(sample);
  }

  const hanleDisable = (e) => {
    let list = {};
    disabledList.forEach((item)=>{
      sampleArray.forEach((val)=>{
        if(val.moduleField && val.moduleField === item.key){    
          list[item.key] = true;
        }
      })
    })
    let newList = disabledList.map(item=>{
      if(list[item.key]){
        item.isDisable = true;
      }else{
        item.isDisable = false;
      }
      return item;
    })
    setDisabledList(newList)
  }

  return(
    <div className={classes.paperLevel}>
      <Grid container spacing={3}>
        <Grid item xs={6} md={3} className={classes.griditemone}>
          <Typography>{newData.headerRow}</Typography>
        </Grid>
        <Grid item xs={6} md={3}>
          <AppSelectInput
            fullWidth
            placeholder="Module Field"
            value={newData.moduleField}
            onChange={e => {
              change({ moduleField: e.target.value })
              hanleDisable(e)
              let arr = sampleArray.filter(a => a.moduleField === '')
              setDisabled(arr.length === 0 ? false : true)
            }}
            disabledList={disabledList}
            options={moduleFields.map(opt => opt.key)}
            labels={moduleFields.map(opt => opt.name)}
          />
        </Grid>
        <Grid item xs={6} md={3} className={classes.griditemone}>
          <Typography>{newData.row1}</Typography>
        </Grid>
        <Grid item xs={6} md={3} className={classes.griditemone}>
          <AppTextInput
            value={newData.defaultValue}
            placeholder={"Default Value"}
            onChange={e => change({ defaultValue: e.target.value })} 
          />
        </Grid>
      </Grid>
    </div>
  );
}

export default FileItem;