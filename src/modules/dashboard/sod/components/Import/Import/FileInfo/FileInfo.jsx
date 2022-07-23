import React, { useEffect, useState } from 'react';
import { Grid, Typography, Button, makeStyles } from '@material-ui/core';
import clsx from 'clsx';
import FileItem from '../FileItem/FileItem';
import { callApi } from '../../../../../../../utils/api';
import { useHistory, useLocation, useParams } from 'react-router-dom';

const useStyles = makeStyles(() => ({
  root: {
    display: 'flex',
    flex: 1,
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

const FileInfo = ({ }) => {
  const classes = useStyles();
  const history = useHistory();
  const location = useLocation();
  const { type } = useParams();
  
  const [moduleFields, setModuleFields] = useState([]);
  const [mappingArr, setMappingArr] = useState([]);
  const [fileMetadata, setFileMetadata] = useState([]);
  const [sampleArray, setSampleArray] = useState([]);
  const [disabled, setDisabled] = useState(true);
  const [saving, setSaving] = useState(false);
  const [id, setId] = useState(location.state && location.state.id ? location.state.id : '');

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
  
  const handleMappings = (data, module) => {
    delete data[module]['moduleField']
    setMappingArr({...mappingArr, ...data})
  }

  const createMappingObj = {
    "id": id,
    "mapping": mappingArr
  }

  const saveMappingObj = JSON.parse(JSON.stringify(createMappingObj));

  const downloadModuleFields = () => {
    const entityFormData = {
      "filter": {
        "type": "sodEntity"
      },
      "pageNumber": "0",
      "pageSize": "100"
    }

    const policyFormData = {
      "filter": {
        "type": "sodPolicyRule"
      },
      "pageNumber": "0",
      "pageSize": "100"
    }

    callApi(`/utilsrvc/modulefield/list`, 'POST', type === 'entities' ? entityFormData : policyFormData)
      .then(res => {
          if(res.success){
            setModuleFields(res.data ? res.data.content: []);
          } 
      })
      .catch(error => {})
  }

  const downloadFileAndMetadata = () => {
    let url = '';
    if(type === 'entities'){
      url = `/sod/import/sodentities/getFileAndMetadata/${id}`
    }
    if(type === 'policies'){
      url = `/sod/import/policyRule/getFileAndMetadata/${id}`
    }
    callApi(url)
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
  
  useEffect(() => {
    if(id && id !== null && id !== undefined && id !== ''){
      downloadModuleFields();
      downloadFileAndMetadata();
    }else{
      history.push('/dash/sod/import');
    }
  }, [])

  const handleSubmit = (e) => {
    e.preventDefault();
    setSaving(true)

    let mappings = {}
    mappings['id'] = id;
    mappings['mapping'] = finalObj();

    const data = JSON.parse(JSON.stringify(mappings))

    let url = '';
    if(type === 'entities'){
      url = `/sod/import/sodentities/saveMapping`
    }
    if(type === 'policies'){
      url = `/sod/import/policyRule/saveMapping`
    }
    callApi(url, 'POST', data)
      .then(res => {
        setSaving(false)
        if(res.success) {
          history.push({ pathname: `/dash/sod/import/${type}/file/progress`, state: { id: id } });
        }
      })
      .catch((err) => setSaving(false))
  }

  return(
    <div className={classes.root}>
      <div className={classes.container}>
        <Grid item xs={12}>
          <Grid container spacing={3}>
            <Grid item item xs={6} md={3}>
              <Typography><b>Header Row</b></Typography>
            </Grid>
            <Grid item item xs={6} md={3}>
              <Typography><b>Module Field</b></Typography>
            </Grid>
            <Grid item item xs={6} md={3}>
              <Typography><b>Row 1</b></Typography>
            </Grid>
            <Grid item item xs={6} md={3}>
              <Typography><b>Default Value</b></Typography>
            </Grid>
          </Grid>
          <hr />
          {
            sampleArray.length > 0 && sampleArray.map((row, k) => {
              return (
                <FileItem 
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
  );
}

export default FileInfo;