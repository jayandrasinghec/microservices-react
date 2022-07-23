import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Grid, TextField } from '@material-ui/core';
import Autocomplete from '@material-ui/lab/Autocomplete';
import MaterialTable from 'material-table';
import CardViewWrapper from '../../../components/HOC/CardViewWrapper';
import { callApi } from '../../../utils/api';

const useStyles = makeStyles(() => ({
  container: { 
    display: 'flex', 
    flexDirection: 'column', 
    overflow: 'hidden', 
    marginLeft: '10px', 
    marginTop: '10px', 
    marginRight: '10px', 
    backgroundColor: '#EEF1F8', 
    flex: 1, 
    borderRadius: '10px', 
  },
  textField: {
    backgroundColor: '#F7F7F7',
  },
  label: {
    fontSize: 14,
    marginTop: 5,
    marginBottom: 5
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

export default function ManagedView(props) {
  const classes = useStyles()
  const [options, setOptions] = React.useState([])
  const [app, setApp] = React.useState(null)
  const [data, setData] = React.useState([])

  const columns = [
    { title: 'Attribute Name', field: 'attributeName'},
    { title: 'Managed System Value', field: 'internalValue' },
    { title: 'IDM Value', field: 'externalValue' },
  ];

  const downloadAppList = () => {
    callApi(`/usersrvc/api/user/manageSystemView/${props.user.id}`, 'GET')
      .then(e => {
        if (e.success) {
          setOptions(e.data)
        }
      })
  }

  const downloadAttributeList = (id) => {

    let params = {
      "applicationId": id,
      "userId": props.user.id
    }

    let queryParams = Object.keys(params).map(k => encodeURIComponent(k) + '=' + encodeURIComponent(params[k])).join('&');
    let url = `/provsrvc/managedSysViewer/manageSystemAttributeList?${queryParams}`;

    callApi(url)
      .then(e => {
        if (e.success) {
          setData(e.data)
        }
      })
      .catch((err) => {
        setData([])
      })
  }

  React.useEffect(() => downloadAppList(), [])
  
  return (
    <div className={classes.container}>
      <Grid container>
          <Grid item xs={12}>
            <div className="col-3 col-md-3 float-right pt-2">
              <div className={classes.label}>Select Application</div>
              <Autocomplete
                options={options}
                getOptionLabel={(option) => option.applicationName}
                className={classes.textField}
                onChange={(e, val) => {
                  if (val && val.applicationId) {
                    setApp(val.applicationId)
                    downloadAttributeList(val.applicationId)
                  }else {
                    setApp('')
                  }
                }}
                value={options.find(v => v.id)}
                renderInput={(params) => <TextField {...params} variant="outlined" />}
              />
            </div>
            <CardViewWrapper>
              <Grid container spacing={2}>
                <Grid item xs={12} className={classes.ruleTable}>
                  <MaterialTable
                    title="Managed View"
                    columns={columns}
                    data={data}
                    options={{
                      rowStyle: {
                        backgroundColor: '#fff',
                      },
                      cellStyle: {
                        borderBottom: 'none',
                      },
                      headerStyle: {
                        backgroundColor: 'transparent',
                        borderBottom: 'none',
                        color: '#666667',
                      },
                      paging: false,
                      draggable: true,
                      actionsColumnIndex: -1,
                      search:false,
                      toolbar: false
                    }}
                  />
                </Grid>
              </Grid>
            </CardViewWrapper>
          </Grid>
        </Grid>
    </div>
  )
}
