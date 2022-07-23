import React, { useState, useEffect } from 'react'
import Button from '@material-ui/core/Button';
import clsx from 'clsx';
import { Grid, makeStyles, Typography } from '@material-ui/core';
import MaterialTable from 'material-table'
import ListItem from './ListItem';
import { callApi } from '../../../../utils/api';

const useStyles = makeStyles(() => ({
  root: {
    display: 'flex',
    flex: 1,
    // maxHeight: 500,
    flexDirection: 'column',
    width: '100%',
    overflow: 'hidden',
    marginBottom: '20px'
  },
  container: {
    backgroundColor: 'white',
    borderRadius: '8px',
    padding: 15,
    width: "100%"
    // height: '300px',
    // alignContent: 'center',
    // alignItems: 'center'
    // overflow: 'auto'
  },
  button: {
    borderRadius: '8px',
    float: 'right'
  },
  ruleTable: {
    paddingBottom: "0px !important",
    marginBottom: '-16px',
    '& .MuiToolbar-gutters':{
      padding: "0px !important",
      '& .MuiTextField-root':{
        border: "1px solid #ccc",
        borderRadius: "4px",
        paddingLeft:"8px",
        '& .MuiInput-underline:before':{
          display:"none",
        },
        '& .MuiInput-underline:after':{
          display:"none",
        }
      },
      
      '& .MuiIconButton-root:hover': {
        background:"transparent",
        '& .MuiTouchRipple-root': {
          display:"none"
        }
      }
    },
  
    '& table': {
      borderCollapse: "separate",
      borderSpacing: "0 15px",
    },
    '& th ': {
      padding: "0px 16px !important",
    },
    '& td ': {
      borderBottom:0,
    },
    '& .MuiPaper-root': {
      boxShadow: "none",
      background: "transparent"
    },
    '& .MuiTablePagination-caption': {
      display: "unset !important",
      position: "absolute",
      color: "#a9b2c3",
    },
    '& .MuiTableCell-footer': {
      borderBottom: '0px',
      '& .MuiTablePagination-selectRoot': {
        background: "#282a73",
        borderRadius: "20px",
        color: "#fff",
        '& svg': {
          color: "#fff"
        }
      },
      '& .MuiButton-contained.Mui-disabled': {
        background: "transparent",
      }
    },
  }
}))

export default function ListInfo(props) {

  const classes = useStyles();
  // const headerRowData = props.location.state.data.columns;
  // const row1Data = props.location.state.data.samples[0];
  // const id = props.location.state.data.id;
  const [moduleFields, setModuleFields] = useState([]);
  const [disabledList, setDisabledList] = useState([]);
  const [progressCount, setProgressCount] = useState(0);
  const [ mappingArr, setMappingArr ] = useState([]);
  const [ fileMetadata, setFileMetadata] = useState([]);
  const [ sampleArray, setSampleArray] = useState([]);
  const [ disabled, setDisabled] = useState(true);
  const [saving, setSaving] = useState(false)

  // const sampleArray = headerRowData.map((data, i) => {
  //   return {
  //     headerRow: data,
  //     moduleField: '',
  //     row1: row1Data[i],
  //     defaultValue: ''
  //   }
  // })

  const handleMappings = (data, module) => {
    delete data[module]['moduleField']
    setMappingArr({...mappingArr, ...data})
  }

  const finalObj = () => {
    let obj = {};
    sampleArray.map((data, i) => {
      let childObj = {
        'column' : data.headerRow, 
        'defautValue' : data.defaultValue, 
      }
      obj[data.moduleField] = childObj
    }) 
    return obj
  }

  const createMappingObj = {
    "id": props.match.params.id,
    "mapping": mappingArr
  }

  const saveMappingObj = JSON.parse(JSON.stringify(createMappingObj));
  // console.log('typeof', typeof(saveMappingObj));
  // console.log('savemapping',(saveMappingObj));

  const downloadModuleFields = () => {
    const formData = {
      "filter": {
        "type": "user"
      },
      "pageNumber": "0",
      "pageSize": "100"
    }

    callApi(`/utilsrvc/modulefield/list`, 'POST', formData)
      .then(response => {
          if(response.data){
            setModuleFields(response.data.content)
          } 
      })
      .catch(error => {})
  }

  const downloadFileAndMetadata = () => {
    callApi(`/usersrvc/import/users/getFileAndMetadata/${props.match.params.id}`)
      .then(res => {
        if(res.success) {
          setFileMetadata(res.data)
          const arr = res.data.columns.map((data, i) => {
            return {
              headerRow: data,
              moduleField: '',
              row1: res.data.samples[0][i],
              defaultValue: ''
            }
          });
          setSampleArray(arr)
        }
      })
      .catch(err => {})
  }

  const handleProgress = () => {
    setInterval(() => {
      if(progressCount < 100) {
        setProgressCount(progressCount + 25)
      } else {
        props.history.push(`/dash/directory/import/1/created`)
      }
    }, 1000)
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    setSaving(true)

    let mappings = {}
    mappings['id'] = props.match.params.id;
    mappings['mapping'] = finalObj();

    const data = JSON.parse(JSON.stringify(mappings))
    callApi(`/usersrvc/import/users/saveMapping`, 'POST', data)
    // callApi(`/usersrvc/import/users/saveMapping`, 'POST', saveMappingObj)
      .then(res => {
        setSaving(false)
        if(res.success) {
          props.history.push(`/dash/directory/import/users/${res.data.id}/status`)
        }
      })
      .catch((err) => setSaving(false))
  }

  useEffect(() => {
    downloadModuleFields()
    downloadFileAndMetadata()
  }, [])

  return (
    <div className={classes.root}>
      <div className={classes.container}>
        <Grid item xs={12} className={classes.ruleTable}>
          <Grid container spacing={3} style={{padding: '7px 22px'}}>
            <Grid item item xs={6} md={3} className="">
              <Typography><b>Header Row</b></Typography>
            </Grid>
            <Grid item item xs={6} md={3} className="">
              <Typography><b>Module Field</b></Typography>
            </Grid>
            <Grid item item xs={6} md={3} className="">
              <Typography><b>Row 1</b></Typography>
            </Grid>
            <Grid item item xs={6} md={3} className="">
              <Typography><b>Default Value</b></Typography>
            </Grid>
          </Grid>
          <hr />
          {
            sampleArray.length > 0 && sampleArray.map((row, k) => {
              return (
                <ListItem 
                  key={k} 
                  index={k}
                  item={row} 
                  moduleFields={moduleFields || []}
                  handleMappings={handleMappings}
                  setSampleArray={setSampleArray}
                  sampleArray={sampleArray}
                  setDisabledList={setModuleFields}
                  disabledList={moduleFields || []}
                  setDisabled={setDisabled}
                />
              )
            })
          }
          <Button 
              variant="contained" 
              className={clsx(classes.button, "mt-3")}
              color="primary"
              onClick={handleSubmit}
              disabled={disabled || saving}
            >
              Import
          </Button>      
        </Grid>
      </div>
    </div>
  )
}
