'use strict';

import React from 'react';
import { getFormatedDate } from '../../../utils/helper';
import ReportGrid from './ReportGrid'


const mappings = {
    "displayName": "displayName",
    "created": "created",
    "status": "status",
    "roles": "provisionedApps.CYMMETRI.assignedRoles"
}

let body = {
    "json": {
        "collection": "user",
        "dimensions": [
            {
                "displayName": "displayName",
                "created": "created",
                "status": "status",
                "roles": "provisionedApps.CYMMETRI.assignedRoles"
            }
        ],
        "filters": {
            "and": [
                {
                    "managerId": { "$exists": false }
                }
            ]
        }
    }
}

const defaultFilters = {
    "and": [
        {
            "managerId": { "$exists": false }
        }
    ]
}


export default function UsersWithoutManagers(props) {

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
            field: 'displayName',
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
            field: 'created',
            filter: 'agDateColumnFilter',
            filterParams: filterDateParams,
            menuTabs: ['filterMenuTab', 'generalMenuTab'],
            cellRenderer: (data) => {
                return data.data && getFormatedDate(data.data.created, 'DD/MM/YYYY HH:mm')
                // return data.data && getFormatedDate(data.data.created, 'MM/DD/YYYY')
            }
        },
        {
            field: 'status',
            filter: 'agTextColumnFilter',
            filterParams: {
                filterOptions: ['equals'],
                defaultOption: 'equals',
                buttons: ['reset']
              },
            menuTabs: ['filterMenuTab', 'generalMenuTab'],
        }
    ]


    return (
        <>
            <ReportGrid 
                profile={props.profile}
                title="Users Without Reporting Managers"
                description="Listing of users without reporting manager."
                mappings={mappings}
                body={body}
                columnDefs={columnDefs}
                defaultFilters={defaultFilters}
            />
        </>
    )
}
    
    
    
