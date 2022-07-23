import React, { useState, useEffect } from "react";
import Grid from "@material-ui/core/Grid";
import MaterialTable from "material-table";
import Button from "@material-ui/core/Button";
import Avatar from "@material-ui/core/Avatar";
import CardViewWrapper from "../../../../../../components/HOC/CardViewWrapper";
import "./styles.css";
import CustomPagination from "../../../../../../components/CustomPagination";
import VisibilityIcon from "@material-ui/icons/Visibility";
import ActiveStatusChip from "../../../../../../components/HOC/ActiveStatusChip";
import InactiveStatusChip from "../../../../../../components/HOC/InactiveStatusChip";
import { isActiveForRoles } from "../../../../../../utils/auth";
import TuneIcon from "@material-ui/icons/Tune";

import { GetTaskListAction } from "../redux/actions/schedularActions";

import { useDispatch, useSelector } from "react-redux";
import { IReduxState } from "../../../../../../redux/reducers";
//import { styles } from '../styles';
import Filters from "../components/filter";
interface Props {
  route: any;
  loading: any;
}

const SchedularList: React.FC<Props> = (Props) => {
  const columns: any = [
    {
      title: "Service / Event",
      field: "id",
    },
    { title: "Sub Event", field: "event" },
    { title: "Planned Execution Date", field: "plannedStart" },
    {
      title: " Task Status",
      field: "status",
      render: (rowData: any) =>
        rowData.status === "ACTIVE" ? (
          <ActiveStatusChip>Active</ActiveStatusChip>
        ) : (
          <InactiveStatusChip>Inactive</InactiveStatusChip>
        ),
    },
    { title: "Cron Expression", field: "cronExpression" },
    { title: "Reference ID", field: "referenceId" },
  ];
  // const defaultQuery = {
  //   "filter": {
  //     "action": "",
  //     "result": "",
  //     "sourceId": "",
  //     "sourceType": "",
  //     "requestorId": "",
  //     "from": "",
  //     "to": ""
  //   },
  //   "keyword": "",
  //   "pageNumber": 0,
  //   "pageSize": 10,
  //   "sortDirection": "DESC",
  //   "sortOn": [
  //     "performedAt"
  //   ]
  // }

  const defaultQuery = {
    filter: {
      referenceId: "",
      referenceType: "",
      status: null,
      from: "",
      to: "",
      entity: null,
    },
    taskLists: [],
    keyword: "",
    pageNumber: 0,
    pageSize: 10,
    sortDirection: "ASC",
    sortOn: ["updatedAt"],
  };

  const [enableFilters, setEnableFilter] = useState(false);
  const [query, _setQuery] = useState(defaultQuery);
  //const {  loading  } = Props;
  //const {  loading ,GetTaskListAction } = Props;
  const dispatch = useDispatch();
  const taskLists = useSelector(
    (store: IReduxState) => store.schedularReducer.taskLists || []
  );
  const loading = useSelector(
    (store: IReduxState) => store.schedularReducer.loading
  );
  const statusOptions = [
    { key: 0, label: "Active" },
    { key: 1, label: "Inactive" },
  ];
  const entity = [
    { key: "Governance", label: "Governance" },
    { key: "Reconciliation", label: "Reconciliation" },
    { key: "De-provision", label: "De-provision" },
    { key: "Hook/Script", label: "Hook/Script" },
  ];

  useEffect(() => {
    dispatch(GetTaskListAction(defaultQuery));
  }, []);

  const handleClickEditRuleCondition = (event: any, rowData: any) => {};
  const setQuery = (e: any) => {
    _setQuery({ ...query, ...e });
  };
  const handleFilterClick = () => setEnableFilter(!enableFilters);
  const filterEvent = (event: any) => {
    dispatch(GetTaskListAction(query));
  };

  return (
    <div style={{ overflow: "auto", height: "min-content" }}>
      <Grid item md={12} xs={12} className="griditemtwo">
        <Button
          onClick={() => handleFilterClick()}
          startIcon={<TuneIcon className="tuneicon" />}
          className="tuneicon"
        >
          Filters
        </Button>
      </Grid>
      <Grid container>
        <Grid item xs={12}>
          {enableFilters && (
            <Grid item xs={12}>
              <Filters
                filterEvent={(event: any) => filterEvent(event)}
                header="Task Status"
                statusOptions={statusOptions}
                query={query}
                setQuery={setQuery}
                defaultQuery={defaultQuery}
                options={entity}
              />
            </Grid>
          )}
          <CardViewWrapper>
            <Grid container spacing={2}>
              <Grid item xs={12} className="ruleTable">
                <MaterialTable
                  title=""
                  columns={columns}
                  data={taskLists}
                  isLoading={loading}
                  options={{
                    paging: false,
                    rowStyle: {
                      backgroundColor: "#fff",
                    },

                    headerStyle: {
                      backgroundColor: "transparent",
                      borderBottom: "none",
                      color: "#666667",
                    },
                    paginationType: "stepped",
                    draggable: true,
                    actionsColumnIndex: -1,
                  }}
                  // localization={{
                  //   pagination: {
                  //     labelRowsPerPage: "",
                  //     labelDisplayedRows:
                  //       "Displaying {from}-{to} of {count} records",
                  //   },
                  // }}
                  /* actions={[
                  {
                    icon: () =>
                      isActiveForRoles(["READ_ONLY"]) ? (
                        <VisibilityIcon style={{ color: "#ddd" }} />
                      ) : (
                        <Avatar
                          src={require("../../../../../../assets/Edit.png")}
                          className="editDeleteIcon"
                        />
                      ),
                    tooltip: "Edit Rule",
                    // hidden:!isActiveForRoles(['ORG_ADMIN','DOMAIN_ADMIN']),
                    onClick: (event, rowData) =>
                      handleClickEditRuleCondition(event, rowData),
                  },
                ]} */
                />
              </Grid>
            </Grid>
          </CardViewWrapper>

          <CustomPagination data={taskLists} />
        </Grid>
      </Grid>
    </div>
  );
};
export default SchedularList;
