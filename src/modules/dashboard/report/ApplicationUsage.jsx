'use strict';

import React, { useState } from 'react';
import { getFormatedDate } from '../../../utils/helper';
import ReportGrid from './ReportGrid'

const mappings = {
    "login": "requestor_id",
    "lastLogin": "performedAt",
    "count": "new_object.count",
    "userName": "joinTableOne.displayName",
    "application": "joinTableTwo.settings.displayName",
    "action": "action"
}

const body = {
    "json": {
        "collection": "audit_log",
        "join": [
            {
                "collection": "user",
                "localColumn": "new_object.userId",
                "foreignColumn": "_id",
                "joinCollectionAlias": "joinTableOne",
                "isLeftJoin": false
            },
            {
                "collection": "applicationTenant",
                "localColumn": "new_object.appId",
                "foreignColumn": "_id",
                "joinCollectionAlias": "joinTableTwo",
                "isLeftJoin": false
            }
        ],
        "dimensions": [
            {
                "login": "requestor_id",
                "lastLogin": "performedAt",
                "count": "new_object.count",
                "userName": "joinTableOne.displayName",
                "application": "joinTableTwo.settings.displayName",
                "action": "action"
            }
        ],
        "filters": {
            "and": [
                {
                    "action": "SELF_SERVICE_UPDATE_FREQUENTHIT_APPLICATION"
                }
            ]
        }
        }
}

export default function ApplicationUsage(props) {
    const defaultFilters = {
        "and": [
            {
                "action": "SELF_SERVICE_UPDATE_FREQUENTHIT_APPLICATION"
            }
        ]
    }

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
        //   filterParams: { values: [] },
            filterParams: {
                filterOptions: ['equals'],
                defaultOption: 'equals',
                buttons: ['reset']
            },
            menuTabs: ['filterMenuTab', 'generalMenuTab'],
        },
        {
            field: 'login',
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
            field: 'count',
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
            field: 'lastLogin',
            filter: 'agDateColumnFilter',
            filterParams: filterDateParams,
            menuTabs: ['filterMenuTab', 'generalMenuTab'],
            cellRenderer: (data) => {
                return data.data && data.data.lastLogin && getFormatedDate(data.data.lastLogin, 'DD/MM/YYYY HH:mm')
                // return data.data && getFormatedDate(data.data.lastLogin, 'MM/DD/YYYY')
            }
        }
      ]

    return (
        <>
            <ReportGrid
                profile={props.profile}
                mappings={mappings}
                body={body}
                defaultFilters={defaultFilters}
                columnDefs={columnDefs}
                title="Application Usage"
                description={"Application usage by the users in cymmetri."}
            />
        </>
    )
    }

