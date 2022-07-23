import React from "react";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import SearchIcon from "@material-ui/icons/Search";
import AppSelectInput from "../../../../../../../components/form/AppSelectInput";
import AppDateInput from "../../../../../../../components/form/AppDateInput";
import { Button, InputAdornment } from "@material-ui/core";
import "../../../../../../../FrontendDesigns/new/assets/css/main.css";
import "../../../../../../../FrontendDesigns/new/assets/css/users.css";
import TextField from "@material-ui/core/TextField";
import "./style.css";

/* const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    margin: {
      margin: theme.spacing(1.5),
    },
    formControl: {
      margin: theme.spacing(1.5),
      width: 200,
    },
    selectEmpty: {
      marginTop: theme.spacing(1),
    },
    root: {
      "& > *": {
        margin: theme.spacing(1),
        width: "25ch",
      },
    },
  })
); */

interface Props {
  filterEvent: any;
  header: any;
  statusOptions: any[];
  query: any;
  setQuery: any;
  defaultQuery: any;
  options: any[];
}

const Filters: React.FC<Props> = (Props) => {
  //const classes = useStyles();
  const {
    filterEvent,
    header,
    statusOptions,
    defaultQuery,
    query,
    setQuery,
    options,
  } = Props;

  const setFilters = (e: any) =>
    setQuery({ ...query, filter: { ...query.filter, ...e } });

  const handleSearch = (event: any) => {
    console.log("handleSearch", event);
    filterEvent(event);
  };
  const handleReset = (event: any) => {
    setFilters(defaultQuery.filter);
  };

  return (
    <div className="user-filter-list">
      <div className="container-fluid">
        <div className="row justify-content-center">
          <div className="col-12 col-md-12 col-lg-12">
            <div className="row">
              <div className="col-6 col-md-4">
                <AppDateInput
                  label="Date From"
                  onChange={(e: any) => {
                    setFilters({ from: e.target.valueAsDate.toISOString() });
                  }}
                  value={
                    query.filter.from !== ""
                      ? new Date(query.filter.from).toISOString().split("T")[0]
                      : ""
                  }
                />
                <AppSelectInput
                  label="Entity"
                  name="entity"
                  value={query.filter.entity}
                  options={options.map((opt: any) => opt.key)}
                  labels={options.map((opt: any) => opt.label)}
                  onChange={(e: any) => {
                    setFilters({ entity: e.target.value });
                  }}
                />
              </div>
              <div className="col-6 col-md-8">
                <div className="row">
                  <div className="col-6 col-md-6">
                    <AppDateInput
                      label="Date To"
                      onChange={(e: any) => {
                        let toDate = e.target.valueAsDate;
                        toDate.setHours(23, 59, 59, 999);
                        setFilters({ to: toDate.toISOString() });
                      }}
                      value={
                        query.filter.to !== ""
                          ? new Date(query.filter.to)
                              .toISOString()
                              .split("T")[0]
                          : ""
                      }
                    />

                    <AppSelectInput
                      label={header}
                      value={query.filter.status}
                      name="action"
                      options={statusOptions.map((opt: any) => opt.key)}
                      labels={statusOptions.map((opt: any) => opt.label)}
                      onChange={(e: any) => {
                        setFilters({ status: e.target.value });
                      }}
                    />
                  </div>
                  <div className="col-6 col-md-6 pt-2">
                    <TextField
                      className="margin_12"
                      id="input-with-icon-textfield"
                      label="Scheduler Reference ID"
                      value={query.filter.referenceId}
                      onChange={(e: any) => {
                        setFilters({ referenceId: e.target.value });
                      }}
                      fullWidth
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <SearchIcon />
                          </InputAdornment>
                        ),
                      }}
                    />
                    <TextField
                      className="margin_12"
                      id="input-with-icon-textfield"
                      label="Scheduler Reference Type"
                      name="Scheduler Reference Type"
                      fullWidth
                      value={query.filter.referenceType}
                      onChange={(e: any) => {
                        setFilters({ referenceType: e.target.value });
                      }}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <SearchIcon />
                          </InputAdornment>
                        ),
                      }}
                    />
                  </div>
                </div>
                <div className="row justify-content-end">
                  <div className="text-right mt-3 align-item-flexend">
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={(event: any) => handleReset(event)}
                      // setFilters(defaultQuery.filter);
                    >
                      Reset
                    </Button>
                    <Button
                      className="ml-3"
                      variant="contained"
                      color="primary"
                      onClick={(event: any) => handleSearch(event)}
                    >
                      Search
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Filters;
