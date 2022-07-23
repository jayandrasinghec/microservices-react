'use strict';

import React from 'react';
import { getFormatedDate } from '../../../utils/helper';
import ReportGrid from './ReportGrid'


const mappings = {
    "application": "joinTableTwo.settings.displayName",
    "loginName": "joinTableOne.provisionedApps.CYMMETRI.login.login",
    "lastLoginApplication": "joinTableOne.provisionedApps.[target_id].login.lastLoginTime",
    "lastLoginCymmetri": "joinTableOne.provisionedApps.CYMMETRI.login.lastLoginTime",
    "assignedOn": "performedAt",
    "userName": "joinTableOne.displayName",
    "action": "action"
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
            },
            {
                "collection": "applicationTenant",
                "localColumn": "target_id",
                "foreignColumn": "_id",
                "joinCollectionAlias": "joinTableTwo",
                "isLeftJoin": false
            }
        ],
        "dimensions": [
            {
                "application": "joinTableTwo.settings.displayName",
                "loginName": "joinTableOne.provisionedApps.CYMMETRI.login.login",
                "lastLoginApplication": "joinTableOne.provisionedApps.[target_id].login.lastLoginTime",
                "lastLoginCymmetri": "joinTableOne.provisionedApps.CYMMETRI.login.lastLoginTime",
                "assignedOn": "performedAt",
                "userName": "joinTableOne.displayName",
                "action": "action"
            }
        ],
        "filters": {
            "and": [
                {
                    "action": "ASSIGN_USER_APP"
                }
            ]
        }
        }
}

const defaultFilters = {
    "and": [
        {
            "action": "ASSIGN_USER_APP"
        }
    ]
}

export default function Provisioning(props) {

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
            field: 'application',
            filter: 'agTextColumnFilter',
        //   filterParams: { values: [] },
            filterParams: {
                filterOptions: ['equals'],
                defaultOption: 'equals',
                buttons: ['reset']
            },
            menuTabs: ['filterMenuTab', 'generalMenuTab'],
        },
        {
            field: 'loginName',
            filter: 'agTextColumnFilter',
        //   filterParams: { values: [] },
            filterParams: {
                filterOptions: ['equals'],
                defaultOption: 'equals',
                buttons: ['reset']
            },
            menuTabs: ['filterMenuTab', 'generalMenuTab'],
        },
        {
            field: 'lastLoginApplication',
            filter: 'agDateColumnFilter',
            filterParams: filterDateParams,
            menuTabs: ['filterMenuTab', 'generalMenuTab'],
            cellRenderer: (data) => {
                return data.data && getFormatedDate(data.data.lastLoginApplication, 'DD/MM/YYYY HH:mm')
                // return data.data && getFormatedDate(data.data.lastLoginApplication, 'MM/DD/YYYY')
            }
        },
        {
            field: 'lastLoginCymmetri',
            filter: 'agDateColumnFilter',
            filterParams: filterDateParams,
            menuTabs: ['filterMenuTab', 'generalMenuTab'],
            cellRenderer: (data) => {
                return data.data && getFormatedDate(data.data.lastLoginCymmetri, 'DD/MM/YYYY HH:mm')
                // return data.data && getFormatedDate(data.data.lastLoginCymmetri, 'MM/DD/YYYY')
            }
        },
        {
            field: 'assignedOn',
            filter: 'agDateColumnFilter',
            filterParams: filterDateParams,
            menuTabs: ['filterMenuTab', 'generalMenuTab'],
            cellRenderer: (data) => {
                return data.data && getFormatedDate(data.data.assignedOn, 'DD/MM/YYYY HH:mm')
                // return data.data && getFormatedDate(data.data.assignedOn, 'MM/DD/YYYY')
            }
        },
        {
            field: 'action',
            filter: 'agTextColumnFilter',
        //   filterParams: { values: [] },
            filterParams: {
                filterOptions: ['equals'],
                defaultOption: 'equals',
                buttons: ['reset']
            },
            menuTabs: ['filterMenuTab', 'generalMenuTab'],
        },
    ]


    return (
        <>
            <ReportGrid
                profile={props.profile}
                mappings={mappings}
                body={body}
                defaultFilters={defaultFilters}
                columnDefs={columnDefs}
                title="Provisioning"
                description="Applications assigned to users/groups."
            />
        </>
    )
}
