import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import { Button, Tab, Tabs } from "@material-ui/core";
import AddIcon from '@material-ui/icons/Add';
import { isActiveForRoles } from "../../../../../../utils/auth";


const useStyles = makeStyles((theme) => ({

  container: {
    margin: 0,
    width: "100%",
  },
  tabWrapper: {
    "& .MuiTab-wrapper": {
      textTransform: "capitalize",
      fontSize: "18px",
      fontWeight: 700,
    },
    "& .MuiTab-root": {
      minWidth: "5vw",
    },
    "& .Mui-selected": {
      borderBottom: "3px solid",
      minWidth: "5vw",
    },
  },
  btnWrapper:{
    display:'flex',
    justifyContent:'flex-end',
    alignItems:'center'
  },

  tableAddIcon: {
    height: 32,
  },
}));

export function TabPanel(props) {
  const { children, value, index, ...other } = props;
  return value === index && children;
}

export function NestedTabs(props) {
  const classes = useStyles();
  const { onChange, value,setIsVisible } = props;
  
  return (
    <>
      <Grid container spacing={3} className={classes.container}>
        <Grid item xs={6} className={classes.Nav}>
          <Tabs
            value={value}
            indicatorColor="primary"
            textColor="primary"
            onChange={onChange}
            className={classes.tabWrapper}
          >
            <Tab
              disableFocusRipple
              disableRipple
              label="Application"
              value={0}
            />
            <Tab
              disableFocusRipple
              disableRipple
              label="Conditions"
              value={1}
            />
          </Tabs>
        </Grid>
          { isActiveForRoles(['ORG_ADMIN','DOMAIN_ADMIN']) && <Grid item xs={6} className={classes.btnWrapper}>
          {value === 0 ? <Button
              variant="contained"
              color="primary"
              startIcon={<AddIcon />}
              disableElevation
              disableFocusRipple
              disableRipple
              className={classes.tableAddIcon}
              onClick={()=>setIsVisible(true)}
            >
              Add New Application
            </Button>:<Button
              variant="contained"
              color="primary"
              startIcon={<AddIcon />}
              disableElevation
              disableFocusRipple
              disableRipple
              className={classes.tableAddIcon}
              onClick={()=>setIsVisible(true)}
            >
              Add New Rule Condition
            </Button>}
          </Grid>}
      </Grid>
    </>
  );
}
