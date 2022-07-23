'use strict';

import React from 'react';
import { getFormatedDate } from '../../../utils/helper';
import ReportGrid from './ReportGrid'


const mappings = {
    "userName": "joinTableOne.displayName",
    "login": "joinTableOne.provisionedApps.CYMMETRI.login.login",
    "mfaFactor": "mfaType",
    "lastLogin": "joinTableOne.provisionedApps.CYMMETRI.login.lastLoginTime"
}

let body = {
    "json": {
        "collection": "mfaAuthentication",
        "join": [
            {
                "collection": "user",
                "localColumn": "userId",
                "foreignColumn": "_id",
                "joinCollectionAlias": "joinTableOne",
                "isLeftJoin": false
            }
        ],
        "dimensions": [
            {
                "userName": "joinTableOne.displayName",
                "login": "joinTableOne.provisionedApps.CYMMETRI.login.login",
                "mfaFactor": "mfaType",
                "lastLogin": "joinTableOne.provisionedApps.CYMMETRI.login.lastLoginTime"
            }
        ]
        }
}

export default function MFAUsage(props) {

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
            field: 'mfaFactor',
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
                return data.data && getFormatedDate(data.data.lastLogin, 'DD/MM/YYYY HH:mm')
            }
        }
    ]

    return (
        <>
            <ReportGrid
                profile={props.profile}
                mappings={mappings}
                body={body}
                columnDefs={columnDefs}
                title="MFA Usage"
                description="Number of times MFA is used"
            />
        </>
    )
    }


