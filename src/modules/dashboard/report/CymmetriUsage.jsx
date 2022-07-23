'use strict';

import React from 'react';
import { getFormatedDate } from '../../../utils/helper';
import ReportGrid from './ReportGrid'

const mappings = {
    "userName": "joinTableOne.displayName",
    "email": "joinTableOne.email",
    "lastLogin": "joinTableOne.provisionedApps.CYMMETRI.login.lastLoginTime",
    "userStatus": "joinTableOne.status",
    "accountStatus": "joinTableOne.provisionedApps.CYMMETRI.login.status",
    "department": "joinTableOne.department",
    "designation": "joinTableOne.designation"
}

let body = {
    "json": {
        "collection": "audit_log",
        "join": [
            {
                "collection": "user",
                "localColumn": "source_id",
                "foreignColumn": "_id",
                "joinCollectionAlias": "joinTableOne",
                "isLeftJoin": false
            }
        ],
        "measures": [
            {
                "userId": "source_id"
            }
        ],
        "dimensions": [
            {
                "userName": "joinTableOne.displayName",
                "email": "joinTableOne.email",
                "lastLogin": "joinTableOne.provisionedApps.CYMMETRI.login.lastLoginTime",
                "userStatus": "joinTableOne.status",
                "accountStatus": "joinTableOne.provisionedApps.CYMMETRI.login.status",
                "department": "joinTableOne.department",
                "designation": "joinTableOne.designation"
            }
        ],
        "sort": {
            "userName": 1
        }
        }
    }

export default function CymmetriUsage(props) {

    const filterDateParams = {
        comparator: function (filterLocalDateAtMidnight, cellValue) {
            var dateAsString = cellValue;
            if (dateAsString == null) return -1;
                var dateParts = dateAsString.split('/');
                var cellDate = new Date(
                Number(dateParts[2]),
                Number(dateParts[1]) - 1,
                Number(dateParts[0])
            );
            if (filterLocalDateAtMidnight.getTime() === cellDate.getTime()) {
                return 0;
            }
            if (cellDate < filterLocalDateAtMidnight) {
                return -1;
            }
            if (cellDate > filterLocalDateAtMidnight) {
                return 1;
            }
        },
        buttons: ['reset'],
        browserDatePicker: true,
        minValidYear: 2000,
        filterOptions: ['equals', 'lessThan', 'lessThanOrEqual', 'greaterThan', 'greaterThanOrEqual', 'inRange'],
        defaultOption: 'inRange',
        suppressAndOrCondition: true
    };

    const columnDefs = [
        {
            field: 'userName',
            filter: 'agTextColumnFilter',
        //   buttons: ['reset', 'apply'],
            buttons: ['apply', 'reset'],
        //   filterParams: { values: [] },
            filterParams: {
                filterOptions: ['equals'],
                defaultOption: 'equals',
                buttons: ['reset'],
            },
            menuTabs: ['filterMenuTab', 'generalMenuTab'],
        },
        {
            field: 'email',
            filter: 'agTextColumnFilter',
            filterParams: {
                filterOptions: ['equals'],
                defaultOption: 'equals',
                buttons: ['reset'],
                },
            menuTabs: ['filterMenuTab', 'generalMenuTab'],
          },
        {
            field: 'lastLogin',
            filter: 'agDateColumnFilter',
            filterParams: filterDateParams,
            menuTabs: ['filterMenuTab', 'generalMenuTab'],
            cellRenderer: (data) => {
                return data.data && data.data.lastLogin && getFormatedDate(data.data.lastLogin, 'DD/MM/YYYY HH:mm');
            }
        },
        {
            field: 'department',
            filter: 'agTextColumnFilter',
            filterParams: {
                filterOptions: ['equals'],
                defaultOption: 'equals',
                buttons: ['reset'],
            },
            menuTabs: ['filterMenuTab', 'generalMenuTab'],
        },
        {
            field: 'designation',
            filter: 'agTextColumnFilter',
            filterParams: {
                filterOptions: ['equals'],
                defaultOption: 'equals',
                buttons: ['reset'],
            },
            menuTabs: ['filterMenuTab', 'generalMenuTab'],
        },
        {
            field: 'userStatus',
            // filter: 'agSetColumnFilter',
            // filterParams: { values: ['ACTIVE', 'INACTIVE', 'Test1', 'Test2'] },
            filter: 'agTextColumnFilter',
            filterParams: {
                filterOptions: ['equals'],
                defaultOption: 'equals',
                buttons: ['reset'],
              },
            menuTabs: ['filterMenuTab', 'generalMenuTab'],
        },
        {
            field: 'accountStatus',
            filter: 'agTextColumnFilter',
            filterParams: {
                filterOptions: ['equals'],
                defaultOption: 'equals',
                buttons: ['reset'],
              },
            menuTabs: ['filterMenuTab', 'generalMenuTab'],
        },
        {
            field: 'count',
            filter: false,
            // filter: 'agNumberColumnFilter',
            // filterParams: { values: getSportValuesAsync },
            menuTabs: ['filterMenuTab', 'generalMenuTab'],
        },
      ]

    return (
        <>
            <ReportGrid
                profile={props.profile}
                mappings={mappings}
                body={body}
                columnDefs={columnDefs}
                title="Cymmetri Usage"
                description={"List of all the users used Cymmetri application"}
            />
        </>
    )
    }
