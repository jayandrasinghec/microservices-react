import React, { useCallback, useState, useEffect } from 'react'
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid'

import { Typography } from '@material-ui/core';
import AppSelectInput from './AppSelectInput';
import AppTextInput from '../../../../components/form/AppTextInput';


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

const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay)

    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);

  return debouncedValue;
}


export default function ImportItem(props) {
  // console.log('list item props', props);
  const classes = useStyles();

  const defaultValues = {
    headerRow: "",
    moduleField: "",
    row1: "",
    defaultValue: "",
  }

  const { index, item, moduleFields, handleMappings, setSampleArray, sampleArray, setDisabledList, disabledList, setDisabled } = props;
  const [newData, setNewData] = React.useState(item || defaultValues)
  // const [changes, setChange] = React.useState(false)
  // const debouncedText = useDebounce(newData, 500);

  // useEffect(() => setNewData({...newData}), [newData])

  const mapData = {
    column: newData.headerRow,
    defaultValue: newData.defaultValue
  }

  // const debounce = (callback, delay) => {
  //   let timer;
  //   return (...args) => {
  //     clearTimeout(timer);
  //     timer = setTimeout(() => useCallback(...args), delay)
  //   }
  // }

  // const debounceLog = useCallback(
  //   debounce(text => console.log(text), 500)
  // )

  const change = (e) => {
    // console.log('e',e);
    setNewData({ ...newData, ...e })
    let sample = sampleArray
    sample[index] = {...newData, ...e}
    setSampleArray(sample)
    // debounceLog(e)

    // if(e.moduleField || e.defaultValue) {
    //   if(newData.moduleField) {
    //     handleMappings({[newData.moduleField]: {...newData,...e}})
    //   } else {
    //     handleMappings({[e.moduleField]: {...newData,...e}})
    //   }
    // }
    
    // if(e.moduleField || e.defaultValue) {
    //   if(newData.moduleField) {
    //     handleMappings({[newData.moduleField]: {...mapData, ...e}}, newData.moduleField)
    //   } else {
    //     handleMappings({[e.moduleField]: {...mapData, ...e}}, e.moduleField)
    //   }
    // }

    // if(e.moduleField || e.defaultValue) {
    //   if(newData.moduleField) {
    //     handleMappings({[newData.moduleField]: {...mapData}})
    //   } else {
    //     handleMappings({[e.moduleField]: {...mapData}})
    //   }
    // }

    
  }

  const hanleDisable = (e)=>{
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
  return (
    <div className={classes.paperLevel}>
      <Grid container spacing={3}>
        <Grid item xs={6} md={3} className={classes.griditemone}>
          <Typography>{newData.headerRow}</Typography>
          {/* <AppTextInput
            value={newData.header}
            placeholder={"Default Value"}
            disabled
          /> */}
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
              setDisabled(arr.length == 0 ? false : true)
            }}
            disabledList={disabledList}
            // disabledList={["displayName", "firstName"]}
            // disabledList={sampleArray.map(k => {
            //   if(k.moduleField) {
            //     return k.moduleField
            //   }
            // })}
            options={moduleFields}
            labels={moduleFields.map(opt => opt.name)}
          />
        </Grid>
        <Grid item xs={6} md={3} className={classes.griditemone}>
          <Typography>{newData.row1}</Typography>
          {/* <AppTextInput
            value={newData.row1}
            placeholder={"Row1"}
            disabled
          /> */}
        </Grid>
        <Grid item xs={6} md={3} className={classes.griditemone}>
          <AppTextInput
            // label="Default Value"
            value={newData.defaultValue}
            placeholder={"Default Value"}
            onChange={e => change({ defaultValue: e.target.value })} 
          />
        </Grid>
      </Grid>
    </div>
  )
}
