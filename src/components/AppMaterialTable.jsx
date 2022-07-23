/* eslint-disable react/display-name */
import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box'
import MaterialTable from 'material-table';
import Grid from '@material-ui/core/Grid';
import InsertDriveFileIcon from '@material-ui/icons/InsertDriveFile';

const useStyles = makeStyles(theme => ({
  ruleTable: {
    // paddingBottom: "0px !important",
    // marginBottom: '-16px',
    '& .MuiToolbar-gutters': {
      padding: "0px !important",
      '& .MuiTextField-root': {
        border: "1px solid #ccc",
        borderRadius: "4px",
        paddingLeft: "8px",
        '& .MuiInput-underline:before': {
          display: "none",
        },
        '& .MuiInput-underline:after': {
          display: "none",
        }
      },

      '& .MuiIconButton-root:hover': {
        background: "transparent",
        '& .MuiTouchRipple-root': {
          display: "none"
        }
      }
    },

    '& table': {
      // overflowX: 'none',
      border: '1px solid #ddd',
      // borderCollapse: "separate",
      borderSpacing: "0",
    },
    '& th ': {
      padding: "16px !important",
    },
    '& td ': {
      borderBottom: 0,
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
  },
  rulesSearchAdd: {
    float: 'right',
  },
  tableAddIcon: {
    height: 32,
  },
  editDeleteIcon: {
    '& img': {
      width: "16px",
      height: "16px",
    }
  },
  cardViewWrapper: {
    padding: theme.spacing(3, 2),
    backgroundColor: "#fff",
    borderRadius: 8,
    margin: 16,
  }

}));

export default function Material(props) {

  const classes = useStyles();

  return (
    <Grid container>
      <Grid item xs={12}>
        <Box className={classes.cardViewWrapper}>
          <Grid container spacing={2}>
            <Grid item xs={12} className={classes.ruleTable}>
              <MaterialTable
                title={props.title ? props.title : ''}
                columns={props.columns}
                data={props.data}
                // isLoading={loading}
                options={{
                  // search: false,
                  paging: false,
                  rowStyle: {
                    border: '1px solid #ddd',
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
                  paginationType: 'stepped',
                  draggable: true,
                  actionsColumnIndex: -1
                }}
                localization={{
                  pagination: {
                    labelRowsPerPage: '',
                    labelDisplayedRows: 'Displaying {from}-{to} of {count} records'
                  },
                  body: {
                    emptyDataSourceMessage:
                      <div style={{ margin: 'auto', display: 'block' }}>
                        <InsertDriveFileIcon style={{ width: 60, height: 60, marginBottom: 20, color: '#363793' }} />
                        <div style={{ color: 'gray', fontSize: 24, marginBottom : 40, fontWeight: 500 }}>No Records Found</div>
                      </div>
                  },
                  header: {
                    actions: props.data.length > 0 ? 'Actions' : ''
                  },
                }}
                {...props}
              />
              {props.body}
            </Grid>
          </Grid>
        </Box>
      </Grid>
    </Grid>
  )
}








