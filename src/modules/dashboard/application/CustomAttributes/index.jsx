import React from "react";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";

import { callApi } from "../../../../utils/api";
import CustomAttributeItem from "./CustomAttributeItem";
import { makeStyles } from "@material-ui/core/styles";
import { isActiveForRoles } from "../../../../utils/auth";
import { TablePagination } from "@material-ui/core";
import CustomPagination from "../../../../components/CustomPagination";
import AddEditCustomAttribute from "./AddEditCustomAttribute";

const useStyles = makeStyles((theme) => ({
  container: {
    display: "flex",
    flex: 1,
    flexDirection: "column",
    width: "100%",
    overflow: "hidden",
  },
  gridcontainer: {
    overflowY: "auto",
    overflowX: "hidden",
    marginBottom: 15,
    marginTop: 15,
    width: "100%",
  },
  griditemone: {
    paddingTop: 0,
    marginLeft: "30px",
    backgroundColor: "#EEF1F8",
    borderRadius: "10px",
  },
  button: {
    borderRadius: "8px",
  },
}));

const defaultFilters = {
  filter: {
    type: "",
  },
  keyword: "",
  pageNumber: "0",
  pageSize: "10",
  sortDirection: "ASC",
  sortOn: [],
};

export default function CustomAttributes(props) {
  const [attributes, setAttributes] = React.useState([]);
  const [filters, setFilters] = React.useState(defaultFilters);
  const [total, setTotal] = React.useState(0);
  const [openAddAttribute, setOpenAddAttribute] = React.useState(false);
  const classes = useStyles();

  const downloadAttributes = () => {
    callApi(`/utilsrvc/meta/list/CustomAttribute`, "POST", filters)
      .then((response) => {
        if (response.success) {
          setAttributes(response.data.content);
          setTotal(response.data ? response.data.totalElements : 0);
        }
      })
      .catch((error) => {});
  };

  const onAdd = () => {
    // setAttributes([...attributes, null]);
    setOpenAddAttribute(true)
  };

  const handleChangePage = (event, newPage) =>
    setFilters({ ...filters, pageNumber: newPage });

  const handleChangeRowsPerPage = (event) => {
    setFilters({ ...filters, pageNumber: 0, pageSize: parseInt(event, 10) });
  };

  React.useEffect(() => {
    downloadAttributes();
  }, [filters.pageNumber, filters.pageSize]);

  const handleClose = () => {
    setOpenAddAttribute(false);
  };

  return (
    <>
      {openAddAttribute ? (
        <AddEditCustomAttribute open={openAddAttribute} handleClose={handleClose} edit={false} editData={null}  downloadAttributes={downloadAttributes} />
      ) : null}
      <div className={classes.container}>
        <Grid container spacing={3} className={classes.gridcontainer}>
          <Grid item xs={12} className={classes.griditemone}>
            <div className="d-flex p-2 mb-3 flex-row align-items-center justify-content-between">
              <div>Custom Attributes</div>
              {isActiveForRoles(["ORG_ADMIN", "DOMAIN_ADMIN", "APP_ADMIN"]) && (
                <Button
                  onClick={onAdd}
                  variant="contained"
                  className={classes.button}
                  color="primary"
                >
                  + Add
                </Button>
              )}
            </div>

            <div>
              {attributes.map((m, i) => {
                return (
                  <CustomAttributeItem
                    key={i}
                    downloadAttributes={downloadAttributes}
                    // app={props.app}
                    item={m}
                  />
                );
              })}
            </div>
            {/* <TablePagination
                        component="div"
                        // rowsPerPageOptions={[12, 24, 60, 120]}
                        count={total}
                        page={filters.pageNumber}
                        onChangePage={handleChangePage}
                        rowsPerPage={filters.pageSize}
                        onChangeRowsPerPage={handleChangeRowsPerPage}
                    /> */}
            <CustomPagination
              count={Math.ceil(total / Number(filters.pageSize))}
              totalCount={total}
              page={Number(filters.pageNumber)}
              onChangePage={handleChangePage}
              rowsPerPage={Number(filters.pageSize)}
              onChangeRowsPerPage={handleChangeRowsPerPage}
            />
          </Grid>
        </Grid>
      </div>
    </>
  );
}
